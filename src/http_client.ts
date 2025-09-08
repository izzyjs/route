// Function to get the XSRF-TOKEN cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// HTTP Client configuration
export interface HttpClientConfig {
  timeout?: number
  headers?: Record<string, string>
  credentials?: RequestCredentials

  // Retry configuration
  retries?: number
  retryDelay?: number
  retryCondition?: (error: any, attempt: number) => boolean

  // Request/Response interceptors
  requestInterceptor?: (
    config: RequestInit & { url: string }
  ) => (RequestInit & { url: string }) | Promise<RequestInit & { url: string }>
  responseInterceptor?: (response: Response) => Response | Promise<Response>
  errorInterceptor?: (error: any) => any | Promise<any>

  // Validation and transformation
  validateStatus?: (status: number) => boolean
  transformRequest?: (data: any) => any
  transformResponse?: (data: any) => any

  // Development/debugging
  debug?: boolean
  logRequests?: boolean
}

export class HttpClient {
  private config: HttpClientConfig

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      timeout: 30000,
      credentials: 'same-origin',
      retries: 0,
      retryDelay: 1000,
      validateStatus: (status) => status >= 200 && status < 300,
      debug: false,
      logRequests: false,
      ...config,
    }
  }

  private getBodyType(body: any): string | null {
    if (body instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
      return null
    }

    if (body instanceof File) {
      return body.type || 'application/octet-stream'
    }

    if (body instanceof Blob) {
      return body.type || 'application/octet-stream'
    }

    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      return 'application/octet-stream'
    }

    if (typeof body === 'string') {
      // Check if it's already JSON
      try {
        JSON.parse(body)
        return 'application/json'
      } catch {
        return 'text/plain'
      }
    }

    if (typeof body === 'object' && body !== null) {
      return 'application/json'
    }

    // Default fallback
    return 'application/json'
  }

  private async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    let attempt = 0
    const maxAttempts = (this.config.retries || 0) + 1

    while (attempt < maxAttempts) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        try {
          // Apply request interceptor
          let requestConfig = { ...options, url }
          if (this.config.requestInterceptor) {
            requestConfig = await this.config.requestInterceptor(requestConfig)
            url = requestConfig.url
          }

          // Add CSRF token
          const token = getCookie('XSRF-TOKEN')
          const headers = new Headers(requestConfig.headers)

          if (token) {
            headers.set('X-XSRF-TOKEN', token)
          }

          // Set default headers
          if (this.config.headers) {
            Object.entries(this.config.headers).forEach(([key, value]) => {
              headers.set(key, value)
            })
          }

          // Auto-detect Content-Type based on body type
          if (requestConfig.body && !headers.has('Content-Type')) {
            const contentType = this.getBodyType(requestConfig.body)
            if (contentType) {
              headers.set('Content-Type', contentType)
            }
          }

          // Transform request data
          let body = requestConfig.body
          if (body && this.config.transformRequest) {
            body = this.config.transformRequest(typeof body === 'string' ? JSON.parse(body) : body)
            body = typeof body === 'object' ? JSON.stringify(body) : body
          }

          // Log request if enabled
          if (this.config.logRequests || this.config.debug) {
            console.log(`[HTTP] ${requestConfig.method || 'GET'} ${url}`, {
              body: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
            })
          }

          const response = await fetch(url, {
            ...requestConfig,
            headers,
            body,
            credentials: this.config.credentials,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          // Apply response interceptor
          let processedResponse = response
          if (this.config.responseInterceptor) {
            processedResponse = await this.config.responseInterceptor(response.clone())
          }

          // Validate status
          const isValidStatus = this.config.validateStatus
            ? this.config.validateStatus(processedResponse.status)
            : processedResponse.status >= 200 && processedResponse.status < 300

          // Handle specific status codes
          if (processedResponse.status === 401) {
            console.warn('Token expired or unauthorized')
          }

          let data: T
          const contentType = processedResponse.headers.get('content-type')

          if (contentType?.includes('application/json')) {
            data = await processedResponse.json()
          } else if (contentType?.includes('text/')) {
            data = (await processedResponse.text()) as T
          } else {
            data = (await processedResponse.blob()) as T
          }

          // Transform response data
          if (data && this.config.transformResponse) {
            data = this.config.transformResponse(data)
          }

          // If status is invalid, treat as error for retry logic
          if (!isValidStatus) {
            const error = new Error(`HTTP Error ${processedResponse.status}`)
            ;(error as any).response = {
              data,
              status: processedResponse.status,
              headers: processedResponse.headers,
            }
            ;(error as any).status = processedResponse.status
            throw error
          }

          return { data, status: processedResponse.status }
        } catch (error) {
          clearTimeout(timeoutId)

          if (error instanceof Error && error.name === 'AbortError') {
            const timeoutError = new Error('Request timeout')
            ;(timeoutError as any).isTimeout = true
            throw timeoutError
          }

          throw error
        }
      } catch (error) {
        attempt++

        // Apply error interceptor
        if (this.config.errorInterceptor) {
          try {
            const interceptorResult = await this.config.errorInterceptor(error)
            // If interceptor returns data, treat as successful response
            if (
              interceptorResult &&
              typeof interceptorResult === 'object' &&
              'data' in interceptorResult
            ) {
              return interceptorResult
            }
          } catch {
            // Error interceptor failed, continue with original error
          }
        }

        // Check if we should retry
        const shouldRetry =
          attempt < maxAttempts &&
          (this.config.retryCondition
            ? this.config.retryCondition(error, attempt)
            : this.isRetryableError(error))

        if (!shouldRetry) {
          if (this.config.debug) {
            console.error(`[HTTP] Request failed after ${attempt} attempts:`, error)
          }
          throw error
        }

        // Wait before retrying
        if (this.config.retryDelay && attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay))
        }

        if (this.config.debug) {
          console.warn(`[HTTP] Retrying request (attempt ${attempt}/${maxAttempts})`)
        }
      }
    }

    throw new Error('Max retry attempts reached')
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx status codes
    if (error.isTimeout) return true
    if (!error.response && !error.status) return true // Network error

    const status = error.status || error.response?.status
    return status >= 500 && status < 600
  }

  async get<T = any>(url: string, config: RequestInit = {}): Promise<{ data: T; status: number }> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  async post<T = any>(
    url: string,
    data?: any,
    config: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = any>(
    url: string,
    data?: any,
    config: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(
    url: string,
    config: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: data,
    })
  }

  // Utility method to create a new instance with merged config
  withConfig(additionalConfig: Partial<HttpClientConfig>): HttpClient {
    return new HttpClient({ ...this.config, ...additionalConfig })
  }

  // Utility method to get current config
  getConfig(): Readonly<HttpClientConfig> {
    return { ...this.config }
  }
}
