/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */

import type { ApplicationService } from '@adonisjs/core/types'
import type { GlobalIzzyJs, SerializedRoute } from '../src/types/manifest.js'
import { serializeRoute } from '../src/serialize_route.js'

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

    let routes = router.toJSON() || {}

    // In the test environment the router may not be committed yet when
    // this provider becomes ready
    if (Object.keys(routes).length === 0 && this.app.getEnvironment() === 'test') {
      router.commit()
      routes = router.toJSON() || {}
    }

    const domains = Object.keys(routes)

    const routesJSON = domains.map((domain) => ({
      domain,
      routes: routes[domain].map((route) => serializeRoute(route, domain)),
    }))

    // Register all routes from all domains, not just root
    if (routesJSON.length > 0) {
      // Flatten all routes from all domains
      const allRoutes = routesJSON.flatMap(({ routes: domainRoutes }) => domainRoutes)
      this.#registerSsrRoutes(allRoutes)
      await this.#registerEdgePlugin(allRoutes)
    }
  }

  /**
   * Registers edge plugin when edge is installed
   */
  async #registerEdgePlugin(routes: SerializedRoute[]) {
    if (!this.app.usingEdgeJS) return

    const edgeExports = await import('edge.js')
    const { edgePluginIzzy } = await import('../src/plugins/edge.js')

    // Get configuration from app config
    const config = this.app.config.get('izzyjs') as { baseUrl?: string } | undefined

    edgeExports.default.use(edgePluginIzzy(routes, config))
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
