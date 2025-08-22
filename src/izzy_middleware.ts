import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class IzzyRouteMiddleware {
  handle({ request }: HttpContext, next: NextFn) {
    const { pathname } = new URL(request.completeUrl())

    // Update current route and preserve existing config
    if (globalThis.__izzy_route__) {
      globalThis.__izzy_route__['current'] = pathname
    }

    return next()
  }
}
