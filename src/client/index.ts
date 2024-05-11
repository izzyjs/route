import { ExcludeName, ExtractName, Params } from '../types/routes.js'
import { Route, Routes } from '../route.js'

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
export function route<Name extends ExtractName>(routeName: Name, params: Params<Name>): Route

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
export function route<Name extends ExcludeName['name']>(routeName: Name, params?: never): Route

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
export function route(): Routes

export function route(routeName?: unknown, params?: unknown): Route | Routes {
  return Route.new(routeName, params)
}
