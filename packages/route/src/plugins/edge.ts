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
        `\t<script${cspNonce ? ` nonce="${cspNonce}"` : ''}>`,
        `\t\t(globalThis || window).__izzy__ = {`,
        `\t\t\troutes: ${JSON.stringify(routes)},`,
        `\t\t\tcurrent: "${url}"`,
        `\t\t};`,
        '\t</script>',
      ].join('\n')
    })

    edge.registerTag(tag)
  }
}
