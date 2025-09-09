const methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const

export type Method = (typeof methods)[keyof typeof methods]

/**
 * Shape of the serialized route specific to the formatter
 */
export type SerializedRoute = {
  name: string
  path: string
  params?: {
    required?: string[]
    optional?: string[]
  }
  domain: 'root' | string
  method: Method
}

export interface GlobalIzzyJs {
  routes: SerializedRoute[]
  current: string
  config?: {
    baseUrl?: string
  }
}
