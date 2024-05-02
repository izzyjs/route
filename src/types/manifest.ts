const methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const

/**
 * Shape of the serialized route specific to the formatter
 */
export type SerializedRoute = {
  name?: string
  path: string
  params?: string[]
  method: (typeof methods)[keyof typeof methods]
}
