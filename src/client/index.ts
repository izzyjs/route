import { SerializedRoute } from '../types/manifest.js'
import { isBrowser } from '../utils/is_browser.js'
// @ts-ignore
import type { RouteWithName, RouteWithParams, RouteName } from './routes.js'

type ExtractName = Extract<RouteWithName, RouteWithParams>['name']
type Params<Name extends ExtractName> = {
  [K in Extract<
    RouteWithParams,
    {
      name: Name
    }
  >['params'][number]]: string
}
type ExcludeName = Exclude<RouteWithName, RouteWithParams>

type Router = {
  current: typeof current
}

/**
 * Resolve a route path by its name and parameters
 * @param routeName The name of the route
 * @param params The parameters of the route
 * @returns The resolved route path
 * @example
 * ```ts
 * route('users.show', { id: '1' })
 * // => "/users/1"
 * ```
 */
export function route<Name extends ExtractName>(routeName: Name, params: Params<Name>): string

/**
 * Resolve a route path by its name
 * @param routeName The name of the route
 * @returns The resolved route path
 * @example
 * ```ts
 * route('users.index')
 * // => "/users"
 * ```
 */
export function route<Name extends ExcludeName['name']>(routeName: Name, params?: never): string

/**
 * Get the current route path
 * @returns The current route path
 * @example
 * ```ts
 * route().current()
 * // => "/users"
 * route().current('users.show', { id: '1' })
 * // => true
 * ```
 */
export function route(): Router

export function route(routeName?: unknown, params?: unknown): string | Router {
  const { routes } = getIzzyRoutes()

  if (!routeName) {
    return {
      current,
    }
  }

  const exist = routes.find((r) => 'name' in r && r.name === routeName)

  if (!exist) {
    throw new Error(`Route with name "${routeName}" not found`)
  }

  if ('params' in exist && exist.params) {
    if (!params) {
      throw new Error(
        `Route "${routeName}" requires parameters: ${exist.params.map((p) => `"${p}"`).join(', ')}`
      )
    }

    return replaceRouteParams(exist.path, params as Record<string, string>)
  }

  return exist.path
}

/**
 * Check if the current route matches the given route name and parameters
 * @summary Client-side only
 * @example
 * ```ts
 * route().current() // => "/users"
 * ```
 */
function current(): RouteName

/**
 * Check if the current route matches the given route name and parameters
 * @summary Client-side only
 * @param routeName route name
 * @param params route parameters
 * @example
 * ```ts
 * route().current('users.show', { id: '1' }) // => true or false
 * ```
 */
function current<Name extends ExtractName>(routeName: Name, params: Params<Name>): boolean

/**
 * Check if the current route matches the given route name
 * @summary Client-side only
 * @param routeName route name
 * @example
 * ```ts
 * route().current('users.index') // => true or false
 * ```
 */
function current<Name extends ExcludeName['name']>(routeName: Name, params?: never): boolean
function current(routeName?: unknown, params?: unknown): RouteName | boolean {
  const { routes, currentRoute } = getIzzyRoutes()

  if (!routeName) {
    return currentRoute
  }

  const exist = routes.find((r) => 'name' in r && r.name === routeName)

  if (!exist) {
    throw new Error(`Route with name "${routeName}" not found`)
  }

  if ('params' in exist && exist.params) {
    if (!params) {
      throw new Error(
        `Route "${routeName}" requires parameters: ${exist.params.map((p) => `"${p}"`).join(', ')}`
      )
    }

    return currentRoute === replaceRouteParams(exist.path, params as Record<string, string>)
  }

  return currentRoute === exist.path
}

function getIzzyRoutes() {
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

function replaceRouteParams(routePath: string, params: Record<string, string>) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    routePath
  )
}
