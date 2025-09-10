import type { RouteWithName, RouteWithParams } from '../client/routes.js'

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

type GetRoute<Name extends ExtractName> = Extract<RouteWithParams, { name: Name }>

type ExtractOptionalParams<Name extends ExtractName> =
  GetRoute<Name> extends {
    params: { optional: readonly string[] }
  }
    ? GetRoute<Name>['params']['optional'][number]
    : never

type ExtractRequiredParams<Name extends ExtractName> =
  GetRoute<Name> extends {
    params: { required: readonly string[] }
  }
    ? GetRoute<Name>['params']['required'][number]
    : never

type OptionalParams<Name extends ExtractName> =
  ExtractOptionalParams<Name> extends never
    ? {}
    : {
        [K in ExtractOptionalParams<Name>]?: string | number
      }

type RequiredParams<Name extends ExtractName> =
  ExtractRequiredParams<Name> extends never
    ? {}
    : {
        [K in ExtractRequiredParams<Name>]: string | number
      }

type Prettify<T> = {
  [K in keyof T]: T[K]
}

export type Params<Name extends ExtractName> = Prettify<RequiredParams<Name> & OptionalParams<Name>>

export type ExcludeName = Exclude<RouteWithName, RouteWithParams>['name']
