import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: 'https://example.com',

  // Configuração de filtragem de rotas
  routes: {
    // Incluir apenas rotas específicas
    // only: ['home', 'posts.index', 'posts.show'],

    // Excluir rotas específicas (padrão)
    except: [
      '_debugbar.*', // Excluir rotas do debugbar
      'horizon.*', // Excluir rotas do horizon
      'admin.*', // Excluir rotas administrativas
      'api.internal.*', // Excluir rotas internas da API
    ],

    // Grupos de rotas para diferentes contextos
    groups: {
      // Rotas para área administrativa
      admin: ['admin.*', 'users.*', 'roles.*', 'permissions.*'],

      // Rotas para autores de posts
      author: ['posts.*', 'categories.*', 'tags.*'],

      // Rotas públicas
      public: ['home', 'about', 'contact', 'posts.index', 'posts.show'],

      // Rotas da API pública
      api: ['api.v1.*'],
    },
  },
})
