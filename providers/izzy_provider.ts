/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */

import type { ApplicationService, HttpRouterService } from '@adonisjs/core/types'
import type { GlobalIzzyJs, SerializedRoute } from '../src/types/manifest.js'
import { serializeRoute } from '../src/serialize_route.js'
import type { RouteJSON } from '@adonisjs/core/types/http'
import type { Route, RouteResource, RouteGroup, BriskRoute } from '@adonisjs/core/http'

declare global {
  namespace globalThis {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    var __izzy_route__: GlobalIzzyJs
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
      const domainRoutes = await Promise.all(routes[domain].map((r) => serializeRoute(r, domain)))

      routesJSON.push({
        domain,
        routes: domainRoutes,
      })
    }

    if (routesJSON.length === 0 && this.app.getEnvironment() === 'test') {
      routesJSON = await this.#getTestRoutes(router)
    }

    // Register all routes from all domains, not just root
    if (routesJSON.length > 0) {
      // Flatten all routes from all domains
      const allRoutes = routesJSON.flatMap(({ routes: domainRoutes }) => domainRoutes)
      this.#registerSsrRoutes(allRoutes)
      await this.#registerEdgePlugin(allRoutes)
    }
  }

  async #getTestRoutes(router: HttpRouterService) {
    const testRoutes = this.#routesToJSON(router.routes)
    const testDomains = [...new Set(testRoutes.map((route) => route.domain)).values()]
    const testRoutesJSON: { domain: string; routes: SerializedRoute[] }[] = []

    for (let domain of testDomains) {
      const domainRoutes = testRoutes.filter((route) => route.domain === domain)
      const serializedDomainRoutes = await Promise.all(
        domainRoutes.map((r) => serializeRoute(r, domain))
      )

      testRoutesJSON.push({
        domain,
        routes: serializedDomainRoutes,
      })
    }

    return testRoutesJSON
  }

  #routesToJSON(routes: (Route | RouteResource | RouteGroup | BriskRoute)[]): RouteJSON[] {
    return routes
      .map((route) => {
        if ('route' in route) {
          return route.route?.toJSON()
        }

        if ('routes' in route) {
          return this.#routesToJSON(route.routes)
        }

        return route.toJSON()
      })
      .filter((route): route is RouteJSON => route !== null)
      .flat(Number.POSITIVE_INFINITY)
  }

  /**
   * Registers edge plugin when edge is installed
   */
  async #registerEdgePlugin(routes: SerializedRoute[]) {
    if (!this.app.usingEdgeJS) return

    const edgeExports = await import('edge.js')
    const { edgePluginIzzy: edgePluginBise } = await import('../src/plugins/edge.js')

    // Get configuration from app config
    const config = this.app.config.get('izzyjs') as { baseUrl?: string } | undefined

    edgeExports.default.use(edgePluginBise(routes, config))
  }

  #registerSsrRoutes(routes: SerializedRoute[]) {
    // Get configuration from app config
    const config = this.app.config.get('izzyjs') as { baseUrl?: string } | undefined

    globalThis.__izzy_route__ = {
      routes: routes,
      current: '',
      config: config ? { baseUrl: config.baseUrl } : undefined,
    }
  }
}
