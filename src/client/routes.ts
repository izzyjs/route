/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */

/**
 * Route definitions registry.
 *
 * Augmented via `declare module '@izzyjs/route/routes'` in .adonisjs/routes.d.ts
 * by running `node ace izzy:routes`.
 */
export interface RouteDefinitions {}

export type Routes = ReadonlyArray<RouteDefinitions[keyof RouteDefinitions]>
export type Route = RouteDefinitions[keyof RouteDefinitions]
export type RouteWithName = Extract<Route, { name: string }>
export type RouteWithParams = Extract<
  Route,
  { params: { required?: ReadonlyArray<string>; optional?: ReadonlyArray<string> } }
>
export type RouteName = Exclude<RouteWithName['name'], ''>

/**
 * Stub – actual route data is generated to .adonisjs/routes.js
 * by running `node ace izzy:routes`.
 */
export const routes: Routes = [] as unknown as Routes
