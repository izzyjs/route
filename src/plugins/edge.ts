import type { PluginFn, TagContract } from 'edge.js/types'
import { SerializedRoute } from '../types/manifest.js'

type EdgePluginIzzyOptions = (routes: SerializedRoute[]) => PluginFn<undefined>

const tag: TagContract = {
  block: false,
  tagName: 'routes',
  seekable: true,
  compile: (_, buffer, token) => {
    buffer.writeExpression(
      `out += state.izzy(state.cspNonce, state.request.url())`,
      token.filename,
      token.loc.start.line
    )
  },
}

export const edgePluginIzzy: EdgePluginIzzyOptions = (routes) => {
  return (edge) => {
    edge.global('izzy', (cspNonce: string, url: string) => {
      return [
        `<script${cspNonce ? ` nonce="${cspNonce}"` : ''}>`,
        `\t(globalThis || window).__izzy_route__ = {`,
        `\t\troutes: ${JSON.stringify(routes)},`,
        `\t\tcurrent: "${url}"`,
        `\t};`,
        '</script>',
      ].join('\n')
    })

    edge.registerTag(tag)
  }
}
