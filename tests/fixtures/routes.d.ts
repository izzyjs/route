/**
 * Test fixture: augments @izzyjs/route/routes with sample routes
 * for type-safety tests.
 */
declare module '@izzyjs/route/routes' {
  interface RouteDefinitions {
    'support.index': {
      readonly name: 'support.index'
      readonly path: '/'
      readonly method: 'get'
      readonly domain: 'suporte.localhost'
    }
    'support.category': {
      readonly name: 'support.category'
      readonly path: '/category/:slug'
      readonly method: 'get'
      readonly params: {
        readonly required: readonly ['slug']
      }
      readonly domain: 'suporte.localhost'
    }
    'support.article': {
      readonly name: 'support.article'
      readonly path: '/article/:slug'
      readonly method: 'get'
      readonly params: {
        readonly required: readonly ['slug']
      }
      readonly domain: 'suporte.localhost'
    }
    'admin.support.teams': {
      readonly name: 'admin.support.teams'
      readonly path: '/support/teams'
      readonly method: 'get'
      readonly domain: 'admin.localhost'
    }
    'admin.support.ticket': {
      readonly name: 'admin.support.ticket'
      readonly path: '/support/tickets/:id'
      readonly method: 'get'
      readonly params: {
        readonly required: readonly ['id']
      }
      readonly domain: 'admin.localhost'
    }
    'admin.support.ticket.message': {
      readonly name: 'admin.support.ticket.message'
      readonly path: '/support/tickets/:id/message'
      readonly method: 'post'
      readonly params: {
        readonly required: readonly ['id']
      }
      readonly domain: 'admin.localhost'
    }
    'blog.show': {
      readonly name: 'blog.show'
      readonly path: '/blog/:slug'
      readonly method: 'get'
      readonly params: {
        readonly required: readonly ['slug']
      }
      readonly domain: 'root'
    }
    'teste': {
      readonly name: 'teste'
      readonly path: '/teste/:message?'
      readonly method: 'get'
      readonly params: {
        readonly optional: readonly ['message']
      }
      readonly domain: 'root'
    }
  }
}
