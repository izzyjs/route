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
  const allParams = route.pattern.match(/:\w+\??/g)?.map((param) => param.slice(1))

  if (allParams) {
    const requiredParams: string[] = []
    const optionalParams: string[] = []

    // First, find all optional parameters (ending with ?)
    const optionalParamPattern = /:\w+\?/g
    const optionalMatches = route.pattern.match(optionalParamPattern)

    if (optionalMatches) {
      optionalParams.push(...optionalMatches.map((param) => param.slice(1, -1))) // Remove : and ?
    }

    // Then, find all parameters (both required and optional)
    const allParamPattern = /:\w+/g
    const allMatches = route.pattern.match(allParamPattern)

    if (allMatches) {
      // Filter out parameters that are optional
      const requiredMatches = allMatches.filter((param) => {
        const paramName = param.slice(1) // Remove :
        return !optionalParams.includes(paramName)
      })
      requiredParams.push(...requiredMatches.map((param) => param.slice(1))) // Remove :
    }

    return {
      name: route.name!,
      path: route.pattern,
      method: methods.toLowerCase() as any,
      params:
        requiredParams.length > 0 || optionalParams.length > 0
          ? {
              required: requiredParams.length > 0 ? requiredParams : undefined,
              optional: optionalParams.length > 0 ? optionalParams : undefined,
            }
          : undefined,
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
