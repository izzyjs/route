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
