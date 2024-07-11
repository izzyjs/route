/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */

import type { ApplicationService, HttpRouterService } from '@adonisjs/core/types'
import type { SerializedRoute } from '../src/types/manifest.js'
import { serializeRoute } from '../src/serialize_route.js'
import type { RouteJSON } from '@adonisjs/core/types/http'
import type { Route, RouteResource, RouteGroup, BriskRoute } from '@adonisjs/core/http'

declare global {
  namespace globalThis {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    var __izzy_route__: {
      routes: SerializedRoute[]
      current: string
    }
  }
}

export default class IzzyRouteProvider {
  constructor(protected app: ApplicationService) {}

  async ready() {
    const router = await this.app.container.make('router')

    const routes = router.toJSON() || {}
    const domains = Object.keys(routes)

    let routesJSON: { domain: string; routes: SerializedRoute[] }[] = []

    for (let domain of domains) {
      const domainRoutes = await Promise.all(routes[domain].map(serializeRoute))

      routesJSON.push({
        domain,
        routes: domainRoutes,
      })
    }

    if (routesJSON.length === 0) {
      routesJSON = await this.#getTestRoutes(router)
    }

    const exists = routesJSON.find((route) => route.domain === 'root')

    if (exists) {
      this.#registerSsrRoutes(exists.routes)
      await this.#registerEdgePlugin(exists.routes)
    }
  }

  async #getTestRoutes(router: HttpRouterService) {
    const routes = this.#routesToJSON(router.routes)
    const domains = [...new Set(routes.map((route) => route.domain)).values()]
    const routesJSON: { domain: string; routes: SerializedRoute[] }[] = []

    for (let domain of domains) {
      const domainRoutes = routes.filter((route) => route.domain === domain)
      const serializedDomainRoutes = await Promise.all(domainRoutes.map(serializeRoute))

      routesJSON.push({
        domain,
        routes: serializedDomainRoutes,
      })
    }

    return routesJSON
  }

  #routesToJSON(routes: (Route | RouteResource | RouteGroup | BriskRoute)[]): RouteJSON[] {
    return routes
      .flatMap((route) => {
        if ('route' in route) {
          return route.route?.toJSON()
        }

        if ('routes' in route) {
          return this.#routesToJSON(route.routes)
        }

        return route.toJSON()
      })
      .filter((route): route is RouteJSON => route !== null)
  }

  /**
   * Registers edge plugin when edge is installed
   */
  async #registerEdgePlugin(routes: SerializedRoute[]) {
    if (!this.app.usingEdgeJS) return

    const edgeExports = await import('edge.js')
    const { edgePluginIzzy: edgePluginBise } = await import('../src/plugins/edge.js')
    edgeExports.default.use(edgePluginBise(routes))
  }

  #registerSsrRoutes(routes: SerializedRoute[]) {
    globalThis.__izzy_route__ = {
      routes: routes,
      current: '',
    }
  }
}
