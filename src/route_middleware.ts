import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class IzzyRouteMiddleware {
  handle({ request }: HttpContext, next: NextFn) {
    const { pathname } = new URL(request.completeUrl())

    globalThis.__izzy_route__['current'] = pathname

    return next()
  }
}
