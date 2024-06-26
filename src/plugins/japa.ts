/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */
import type { PluginFn } from '@japa/runner/types'
import { namedRoutes } from '../generate_routes.js'

/**
 * A Japa plugin to expose the named routes to the global scope
 * @returns The Japa plugin function
 */
export function izzyRoutePlugin(): PluginFn {
  return async () => {
    const routes = await namedRoutes()
    globalThis.__izzy_route__ = { routes } as any
  }
}
