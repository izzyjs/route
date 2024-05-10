import type { Method, SerializedRoute } from './types/manifest.js'
import { isBrowser } from './utils/is_browser.js'

// @ts-ignore
import type { RouteName } from './client/routes.js'
import type { ExcludeName, ExtractName, Params } from './types/routes.js'

export class Route extends String {
  readonly url: string
  readonly method: Method
  readonly params: string[] | undefined
  readonly name: string
  readonly pattern: string

  private constructor(routeName?: string, params?: Record<string, string>) {
    const { routes } = Route.izzy()

    const exist = routes.find((r) => 'name' in r && r.name === routeName)

    if (!exist) {
      throw new Error(`Route with name "${routeName}" not found`)
    }

    let pattern: string

    if ('params' in exist && exist.params) {
      if (!params) {
        throw new Error(
          `Route "${routeName}" requires parameters: ${exist.params.map((p: string) => `"${p}"`).join(', ')}`
        )
      }

      pattern = Route.replaceRouteParams(exist.path, params as Record<string, string>)
    } else {
      pattern = exist.path
    }

    super(pattern)

    this.url = pattern
    this.name = exist.name
    this.method = exist.method
    this.params = exist.params
    this.pattern = exist.path
  }

  static replaceRouteParams(routePath: string, params: Record<string, string>) {
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(`:${key}`, value),
      routePath
    )
  }

  static new(routeName: unknown, params: unknown): Route
  static new(routeName: unknown): Route
  static new(): Routes
  static new(routeName?: unknown, params?: unknown) {
    if (!routeName) {
      return new Routes()
    }

    return new Route(routeName as string, params as Record<string, string>)
  }

  static izzy() {
    let routes: SerializedRoute[]
    let currentRoute: string

    if (isBrowser()) {
      routes = window.__izzy__.routes
      currentRoute = window.location.pathname
    } else {
      routes = globalThis.__izzy__.routes
      currentRoute = globalThis.__izzy__.current
    }

    return { routes, currentRoute }
  }

  toString() {
    return this.url
  }
}

export class Routes {
  private readonly currentRoute: string
  readonly routes: SerializedRoute[]

  constructor() {
    const { routes, currentRoute } = Route.izzy()

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
   * ```
   */
  current<Name extends ExtractName>(routeName: Name, params: Params<Name>): boolean

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
   * ```
   */
  current<Name extends ExcludeName['name']>(routeName: Name, params?: never): boolean
  current(routeName?: string, params?: unknown): RouteName | boolean {
    if (!routeName) {
      return this.currentRoute
    }

    if (routeName.includes('*')) {
      const regex = new RegExp(routeName.replace(/\*/g, '.*'))

      return regex.test(this.currentRoute)
    }

    const route = Route.new(routeName, params)

    return this.currentRoute === route.toString()
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

      return route.params.reduce(
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
