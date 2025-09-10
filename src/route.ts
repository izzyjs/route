/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */
import type { GlobalIzzyJs, Method, SerializedRoute } from './types/manifest.js'
import { isBrowser } from './utils/is_browser.js'

// @ts-ignore
import type { RouteName } from './client/routes.js'
import type { ExcludeName, ExtractName, Params } from './types/routes.js'

export class Route extends String {
  /**
   * The complete URL with protocol and domain when baseUrl is configured
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' })
   * console.log(route.url) // https://example.com/users/1
   * ```
   */
  readonly url: string

  /**
   * The HTTP method for the route
   */
  readonly method: Method

  /**
   * The route parameters as an array
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' })
   * console.log(route.params) // ['id']
   * ```
   */
  readonly params: { required?: string[]; optional?: string[] } | undefined

  /**
   * The route name as a string
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' })
   * console.log(route.name) // user.show
   * ```
   */
  readonly name: string

  /**
   * The route pattern
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' })
   * console.log(route.pattern) // /users/:id
   * ```
   */
  readonly pattern: string

  /**
   * The route path with parameters replaced
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' })
   * console.log(route.path) // /users/1
   * ```
   */
  readonly path: string

  /**
   * The query string
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' }, { page: 1 })
   * console.log(route.qs.toString()) // page=1
   * ```
   */
  readonly qs: URLSearchParams

  /**
   * The hash fragment
   * @example
   * ```ts
   * const route = Route.new('user.show', { id: '1' }, {}, '', 'contato')
   * console.log(route.hash) // contato
   * ```
   */
  readonly hash: string

  private constructor(
    routeName?: string,
    params?: Record<string, string>,
    qs: Record<string, any> = {},
    prefix = '',
    hash = ''
  ) {
    const { routes } = Route.izzy()

    const exist = routes.find((r) => 'name' in r && r.name === routeName)

    if (!exist) {
      throw new Error(`Route with name "${routeName}" not found`)
    }

    const searchParams = new URLSearchParams(qs)

    let pattern: string

    if (exist.params) {
      const requiredParams = exist.params.required || []
      const optionalParams = exist.params.optional || []

      // Check if required parameters are provided
      if (requiredParams.length > 0) {
        if (!params) {
          throw new Error(
            `Route "${routeName}" requires parameters: ${requiredParams.map((p: string) => `"${p}"`).join(', ')}`
          )
        }

        // Check if all required parameters are provided
        const missingParams = requiredParams.filter(
          (param) => !(param in (params as Record<string, string>))
        )
        if (missingParams.length > 0) {
          throw new Error(
            `Missing required parameters for route "${routeName}": ${missingParams.map((p) => `"${p}"`).join(', ')}`
          )
        }
      }

      // Replace parameters in the path
      if (params && Object.keys(params).length > 0) {
        pattern = Route.replaceRouteParams(exist.path, params as Record<string, string>)
      } else if (optionalParams.length > 0) {
        // Remove optional parameters from the path if no params provided
        pattern = exist.path.replace(/:\w+\?/g, '')
        // Clean up double slashes and trailing slashes
        pattern = pattern.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
      } else {
        pattern = exist.path
      }
    } else {
      // Route has no parameters
      pattern = exist.path
    }

    if (searchParams.toString()) {
      pattern += `?${searchParams.toString()}`
    }

    if (hash) {
      pattern += `#${hash}`
    }

    if (prefix) {
      pattern = prefix + pattern
    }

    super(pattern)

    this.path = pattern
    this.name = exist.name
    this.method = exist.method
    this.params = exist.params
    this.pattern = exist.path
    this.qs = searchParams
    this.hash = hash

    // Generate complete URL with protocol and domain if baseUrl is configured
    this.url = this.generateCompleteUrl(pattern, exist.domain)
  }

  /**
   * Generate complete URL with protocol and domain when baseUrl is configured
   */
  private generateCompleteUrl(path: string, routeDomain?: string): string {
    try {
      const config = Route.getConfig()
      if (config?.baseUrl) {
        const baseUrl = new URL(config.baseUrl)

        // If route has a specific domain (not 'root'), use that domain
        // Otherwise use the baseUrl.host
        const host = routeDomain && routeDomain !== 'root' ? routeDomain : baseUrl.host

        // Parse the path to separate pathname, search, and hash
        const url = new URL(path, 'http://example.com')
        baseUrl.pathname = url.pathname
        baseUrl.search = url.search
        baseUrl.hash = url.hash
        baseUrl.host = host

        return baseUrl.toString()
      }
    } catch (error) {
      // If baseUrl is invalid, fallback to path only
      console.warn('Invalid baseUrl configuration, falling back to path only')
    }
    return path
  }

  /**
   * Get the configuration from the global Izzy object
   */
  private static getConfig(): { baseUrl?: string } | null {
    try {
      if (isBrowser()) {
        return window.__izzy_route__?.config || null
      } else {
        return globalThis.__izzy_route__?.config || null
      }
    } catch {
      return null
    }
  }

  static replaceRouteParams(routePath: string, params: Record<string, string>) {
    let result = routePath

    // First, replace all provided parameters
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`:${key}\\??`, 'g'), value)
    }

    // Then, remove any remaining optional parameters that weren't provided
    result = result.replace(/:\w+\?/g, '')

    // Clean up double slashes and trailing slashes
    result = result.replace(/\/+/g, '/').replace(/\/$/, '') || '/'

    return result
  }

  /**
   * Create a new `Route` instance
   * @param routeName The route name
   * @param params The route parameters
   * @param qs The query string
   * @param prefix The route prefix
   * @param hash The hash fragment
   */
  static new(
    routeName: unknown,
    params: unknown,
    qs?: unknown,
    prefix?: string,
    hash?: string
  ): Route

  /**
   * Create a new `Route` instance
   * @param routeName The route name
   * @param params The route parameters
   * @param qs The query string
   * @param prefix The route prefix
   */
  static new(routeName: unknown, params: unknown, qs?: unknown, prefix?: string): Route

  /**
   * Create a new `Route` instance
   * @param routeName The route name
   */
  static new(routeName: unknown): Route

  /**
   * Create a new `Routes` instance
   */
  static new(): Routes

  static new(
    routeName?: unknown,
    params?: unknown,
    qs?: unknown,
    prefix?: string,
    hash?: string
  ): Route | Routes {
    if (!routeName) {
      return new Routes()
    }

    return new Route(
      routeName as string,
      params as Record<string, string>,
      qs as Record<string, any>,
      prefix,
      hash
    )
  }

  /**
   * Get the `Route` instance from the global Izzy object
   * @returns { GlobalIzzyJs }
   */
  static izzy(): GlobalIzzyJs {
    let routes: SerializedRoute[]
    let currentRoute: string

    if (isBrowser()) {
      routes = window.__izzy_route__.routes
      currentRoute = window.location.pathname
    } else {
      routes = globalThis.__izzy_route__.routes
      currentRoute = globalThis.__izzy_route__.current
    }

    return { routes, current: currentRoute }
  }

  toString() {
    return this.path
  }
}

export class Routes {
  private readonly currentRoute: string
  readonly routes: SerializedRoute[]

  constructor() {
    const { routes, current: currentRoute } = Route.izzy()

    this.routes = routes
    this.currentRoute = currentRoute
  }

  /**
   * Check if the current route matches the given route name and parameters
   * @summary unstable
   * @example
   * ```ts
   * route().current() // => "/users"
   * ```
   */
  current(): RouteName

  /**
   * Check if the current route matches the given route name and parameters
   * @summary unstable
   * @param routeName route name
   * @param params route parameters
   * @example
   * ```ts
   * // current route is 'GET /users/1'
   * route().current('users.show', { id: '1' }) // => true
   * route().current('users.show', { id: '2' }) // => false
   * route().current('/users/*', { id: '1' }) // => true
   * ```
   */
  current<Name extends ExtractName>(routeName: Name | string, params: Params<Name>): boolean

  /**
   * Check if the current route matches the given route name
   * @summary unstable
   * @param routeName route name
   * @example
   * ```ts
   * // current route is 'GET /users/1'
   * route().current('users.show') // => true
   * route().current('user.*') // => true
   * route().current('todos.*') // => false
   * route().current('/users/*') // => true
   * route().current('/todos/*') // => false
   * ```
   */
  current<Name extends ExcludeName>(routeName: Name | string, params?: never): boolean

  current(routeName?: string, params?: unknown): RouteName | boolean {
    return Routes.current(routeName as string, params as Params<ExtractName>)
  }

  /**
   * Check if the current route matches the given route name and parameters
   * @summary unstable
   * @example
   * ```ts
   * route.current() // => "/users"
   * ```
   */
  static current(): RouteName

  /**
   * Check if the current route matches the given route name and parameters
   * @summary unstable
   * @param routeName route name
   * @param params route parameters
   * @example
   * ```ts
   * // current route is 'GET /users/1'
   * route.current('users.show', { id: '1' }) // => true
   * route.current('users.show', { id: '2' }) // => false
   * route.current('/users/*', { id: '1' }) // => true
   * ```
   */
  static current<Name extends ExtractName>(routeName: Name | string, params: Params<Name>): boolean

  /**
   * Check if the current route matches the given route name
   * @summary unstable
   * @param routeName route name
   * @example
   * ```ts
   * // current route is 'GET /users/1'
   * route.current('users.show') // => true
   * route.current('user.*') // => true
   * route.current('todos.*') // => false
   * route.current('/users/*') // => true
   * route.current('/todos/*') // => false
   * ```
   */
  static current<Name extends ExcludeName>(routeName: Name | string, params?: never): boolean

  static current(routeName?: string, params?: unknown): RouteName | boolean {
    const routes = new Routes()

    if (!routeName) {
      return routes.currentRoute as RouteName
    }

    if (routeName.includes('*')) {
      const regex = new RegExp(routeName.replace(/\*/g, '.*'))

      return regex.test(routes.currentRoute)
    }

    const route = Route.new(routeName, params)

    return routes.currentRoute === route.toString()
  }

  /**
   * Check if the current route has the given route name
   * @summary unstable
   * @param routeName route name
   * @example
   * ```ts
   * route().has('users.index') // => true or false
   * route().has('user.*') // => true or false
   * ```
   */
  has<T extends string>(routeName: T) {
    if (routeName.includes('*')) {
      const regex = new RegExp(routeName.replace(/\*/g, '.*'))

      return this.routes.some((r) => 'name' in r && regex.test(r.name))
    }

    return this.routes.some((r) => 'name' in r && r.name === routeName)
  }

  get params(): Record<string, string> {
    const route = this.routes.find(({ path }) => {
      const regex = new RegExp(
        path
          .split('/')
          .map((p) => (p.startsWith(':') ? '([^/]+)' : p))
          .join('/')
      )

      return regex.test(this.currentRoute)
    })

    if (route && route.params) {
      const allParams = [...(route.params.required || []), ...(route.params.optional || [])]

      if (allParams.length === 0) {
        return {}
      }

      const regex = new RegExp(
        route.path
          .split('/')
          .map((p) => (p.startsWith(':') ? '([^/]+)' : p))
          .join('/')
      )

      const values = this.currentRoute.match(regex)

      if (!values) {
        return {}
      }

      return allParams.reduce(
        (acc, param, index) => ({
          ...acc,
          [param]: values[index + 1],
        }),
        {}
      )
    }

    return {}
  }
}
