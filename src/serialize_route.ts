/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */

import type { RouteJSON } from '@adonisjs/core/types/http'
import type { SerializedRoute } from './types/manifest.js'

export function serializeRoute(route: RouteJSON, domain: string = 'root'): SerializedRoute {
  const methods = route.methods.filter((method) => method !== 'HEAD').at(0)!
  const params = route.pattern.match(/:\w+/g)?.map((param) => param.slice(1))

  if (params) {
    return {
      name: route.name!,
      path: route.pattern,
      method: methods.toLowerCase() as any,
      params,
      domain,
    }
  }

  return {
    name: route.name!,
    path: route.pattern,
    method: methods.toLowerCase() as any,
    domain,
  }
}
