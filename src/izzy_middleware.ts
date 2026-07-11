import { type HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'

export default class IzzyRouteMiddleware {
  handle({ request }: HttpContext, next: NextFn) {
    const { pathname, hostname } = new URL(request.completeUrl())

    // Update current route and preserve existing config
    if (globalThis.__izzy_route__) {
      globalThis.__izzy_route__['current'] = pathname
      globalThis.__izzy_route__['currentHost'] = hostname
    }

    return next()
  }
}
