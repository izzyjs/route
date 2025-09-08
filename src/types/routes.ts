// @ts-ignore
import type { RouteWithName, RouteWithParams } from '../client/routes.js'
export type { Route as IzzyRoute } from '../route.js'

export type Routes = Router[]

export interface Router {
  domain: string
  routes: Route[]
}

export interface Route {
  name: string
  pattern: string
  methods: string[]
  handler: Handler
  middleware: any[]
}

export interface Handler {
  type: string
  name?: string
  moduleNameOrPath?: string
  method?: string
}

export type ExtractName = Extract<RouteWithName, RouteWithParams>['name']

export type Params<Name extends ExtractName> = {
  [K in Extract<
    RouteWithParams,
    {
      name: Name
    }
  >['params'][number]]: string
}

export type ExcludeName = Exclude<RouteWithName, RouteWithParams>['name']
