import { HttpClient } from './http_client.js'
import { Route } from './route.js'
import { ExcludeName, ExtractName, Params } from './types/routes.js'

// Create default client instance
const client = new HttpClient()

type Config = Omit<RequestInit, 'method' | 'body'>

class RequestBuilder<ResponseSuccess = any, ResponseFailed = Error, Request = any> {
  declare private data: Request | undefined
  declare private config: Config | undefined
  declare private route: Route
  declare private httpClient: HttpClient

  constructor(route: Route, data?: Request, config?: Config, httpClient = client) {
    this.route = route
    this.data = data
    this.config = config
    this.httpClient = httpClient
  }

  successType<InferredResponseSuccess>() {
    return new RequestBuilder<InferredResponseSuccess, ResponseFailed, Request>(
      this.route,
      this.data,
      this.config,
      this.httpClient
    )
  }

  failedType<InferredResponseFailed>() {
    return new RequestBuilder<ResponseSuccess, InferredResponseFailed, Request>(
      this.route,
      this.data,
      this.config,
      this.httpClient
    )
  }

  withData<InferredRequest>(data: InferredRequest) {
    return new RequestBuilder<ResponseSuccess, ResponseFailed, InferredRequest>(
      this.route,
      data,
      this.config,
      this.httpClient
    )
  }

  async run(): Promise<
    | {
        data: ResponseSuccess
        error: null
      }
    | {
        data: null
        error: ResponseFailed
      }
  > {
    try {
      let response

      switch (this.route.method) {
        case 'get':
          response = await this.httpClient.get(this.route.url, this.config)
          break
        case 'post':
          response = await this.httpClient.post(this.route.url, this.data, this.config)
          break
        case 'put':
          response = await this.httpClient.put(this.route.url, this.data, this.config)
          break
        case 'delete':
          response = await this.httpClient.delete(this.route.url, this.config)
          break
        case 'patch':
          response = await this.httpClient.patch(this.route.url, this.data, this.config)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${this.route.method}`)
      }

      const { data, status } = response

      if (status < 200 || status >= 300) {
        return { data: null, error: data as unknown as ResponseFailed }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as ResponseFailed }
    }
  }
}

class ApiBuilder<Name> {
  declare private nameRoute: Name
  declare private params: Record<string, string>
  declare private qs: Record<string, string>
  declare private hash: string
  declare private prefix: string
  declare private httpClient: HttpClient

  constructor(nameRoute: Name, params: Record<string, string>, httpClient = client) {
    this.nameRoute = nameRoute
    this.params = params
    this.httpClient = httpClient
  }

  withQs(qs: Record<string, string>): ApiBuilder<Name> {
    this.qs = qs
    return this
  }

  withHash(hash: string): ApiBuilder<Name> {
    this.hash = hash
    return this
  }

  withPrefix(prefix: string): ApiBuilder<Name> {
    this.prefix = prefix
    return this
  }

  route() {
    return Route.new(this.nameRoute, this.params, this.qs, this.prefix, this.hash)
  }

  request(config?: Config) {
    return new RequestBuilder(this.route(), undefined, config, this.httpClient)
  }
}

function builder<Name extends ExtractName>(nameRoute: Name, params: Params<Name>): ApiBuilder<Name>
function builder<Name extends ExcludeName>(nameRoute: Name): ApiBuilder<Name>
function builder(nameRoute: any, params?: any) {
  return new ApiBuilder(nameRoute, params)
}

// Factory function to create builder with custom client
export function createApiBuilder(customClient: HttpClient) {
  function customBuilder<Name extends ExtractName>(
    nameRoute: Name,
    params: Params<Name>
  ): ApiBuilder<Name>
  function customBuilder<Name extends ExcludeName>(nameRoute: Name): ApiBuilder<Name>
  function customBuilder(nameRoute: any, params?: any) {
    return new ApiBuilder(nameRoute, params, customClient)
  }

  return customBuilder
}

export default builder
