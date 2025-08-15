interface RouteFilter {
  only?: string[]
  except?: string[]
  groups?: Record<string, string[]>
}

interface Config {
  baseUrl: string
  routes?: RouteFilter
}

export default function defineConfig(config: Config) {
  return config
}

export type { Config, RouteFilter }
