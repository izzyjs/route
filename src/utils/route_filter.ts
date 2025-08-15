import type { SerializedRoute } from '../types/manifest.js'
import type { RouteFilter } from '../define_config.js'

/**
 * Check if a route name matches a pattern
 * Supports wildcards like 'admin.*', 'posts.*'
 */
function matchesPattern(routeName: string, pattern: string): boolean {
  // Convert wildcard pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.') // Escape dots
    .replace(/\*/g, '.*') // Convert * to .*

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(routeName)
}

/**
 * Check if a route should be included based on 'only' filter
 */
function shouldIncludeByOnly(routeName: string, onlyPatterns: string[]): boolean {
  return onlyPatterns.some((pattern) => matchesPattern(routeName, pattern))
}

/**
 * Check if a route should be excluded based on 'except' filter
 */
function shouldExcludeByExcept(routeName: string, exceptPatterns: string[]): boolean {
  return exceptPatterns.some((pattern) => matchesPattern(routeName, pattern))
}

/**
 * Filter routes based on configuration
 */
export function filterRoutes(routes: SerializedRoute[], config?: RouteFilter): SerializedRoute[] {
  if (!config || (!config.only && !config.except)) {
    return routes
  }

  // If both 'only' and 'except' are set, return all routes (disable filtering)
  if (config.only && config.except) {
    console.warn('Both "only" and "except" filters are set. Route filtering is disabled.')
    return routes
  }

  return routes.filter((route) => {
    // Apply 'only' filter
    if (config.only) {
      return shouldIncludeByOnly(route.name, config.only)
    }

    // Apply 'except' filter
    if (config.except) {
      return !shouldExcludeByExcept(route.name, config.except)
    }

    return true
  })
}

/**
 * Get routes for a specific group
 */
export function getRoutesForGroup(
  routes: SerializedRoute[],
  groupName: string,
  config?: RouteFilter
): SerializedRoute[] {
  if (!config?.groups || !config.groups[groupName]) {
    return []
  }

  const groupPatterns = config.groups[groupName]
  return routes.filter((route) =>
    groupPatterns.some((pattern) => matchesPattern(route.name, pattern))
  )
}

/**
 * Get available group names
 */
export function getAvailableGroups(config?: RouteFilter): string[] {
  return config?.groups ? Object.keys(config.groups) : []
}
