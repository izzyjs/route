/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */
import { ExcludeName, ExtractName, Params } from '../types/routes.js'
import { Route, Routes } from '../route.js'
import builder from '../builder.js'

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
export function route<Name extends ExtractName>(
  routeName: Name,
  options: {
    params: Params<Name>
    qs?: Record<string, any>
    prefix?: string
    hash?: string
  }
): Route

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
export function route<Name extends ExcludeName>(
  routeName: Name,
  options?: {
    params?: never
    qs?: Record<string, any>
    prefix?: string
    hash?: string
  }
): Route

export function route(): Routes

export function route(routeName?: unknown, options?: any): Route | Routes {
  return Route.new(routeName, options?.params, options?.qs, options?.prefix, options?.hash)
}

route.current = Routes.current
route.new = Route.new
route.builder = builder
