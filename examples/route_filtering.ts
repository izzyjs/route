import { defineConfig } from '@izzyjs/route'

// Exemplo 1: Configuração básica com filtros
export const basicConfig = defineConfig({
  baseUrl: 'https://meuapp.com',
  routes: {
    // Excluir rotas de debug e admin
    except: ['_debugbar.*', 'horizon.*', 'admin.*'],
  },
})

// Exemplo 2: Configuração com filtro 'only'
export const onlyConfig = defineConfig({
  baseUrl: 'https://meuapp.com',
  routes: {
    // Incluir apenas rotas específicas
    only: ['home', 'about', 'posts.index', 'posts.show', 'contact'],
  },
})

// Exemplo 3: Configuração com grupos de rotas
export const groupsConfig = defineConfig({
  baseUrl: 'https://meuapp.com',
  routes: {
    // Excluir rotas sensíveis
    except: ['_debugbar.*', 'horizon.*', 'admin.*', 'api.internal.*'],

    // Definir grupos para diferentes contextos
    groups: {
      // Rotas para área administrativa
      admin: ['admin.*', 'users.*', 'roles.*', 'permissions.*', 'settings.*'],

      // Rotas para autores de conteúdo
      author: ['posts.*', 'categories.*', 'tags.*', 'media.*'],

      // Rotas públicas
      public: ['home', 'about', 'contact', 'posts.index', 'posts.show', 'search'],

      // Rotas da API pública
      api: ['api.v1.posts.*', 'api.v1.categories.*', 'api.v1.search'],

      // Rotas para autenticação
      auth: ['login', 'register', 'forgot-password', 'reset-password', 'logout'],
    },
  },
})

// Exemplo 4: Configuração para diferentes ambientes
export const environmentConfig = defineConfig({
  baseUrl: process.env.APP_URL || 'http://localhost:3333',
  routes: {
    // Em desenvolvimento, incluir rotas de debug
    ...(process.env.NODE_ENV === 'development' && {
      except: ['admin.*'], // Apenas excluir admin em dev
    }),

    // Em produção, excluir rotas sensíveis
    ...(process.env.NODE_ENV === 'production' && {
      except: ['_debugbar.*', 'horizon.*', 'admin.*', 'api.internal.*', 'telescope.*'],
    }),

    groups: {
      // Grupos sempre disponíveis
      public: ['home', 'about', 'contact', 'posts.*'],
      api: ['api.v1.*'],
    },
  },
})

// Exemplo 5: Configuração para diferentes usuários/roles
export const roleBasedConfig = defineConfig({
  baseUrl: 'https://meuapp.com',
  routes: {
    groups: {
      // Rotas para usuários anônimos
      guest: ['home', 'about', 'contact', 'posts.index', 'posts.show', 'login', 'register'],

      // Rotas para usuários autenticados
      user: ['dashboard', 'profile', 'posts.create', 'posts.edit', 'posts.delete'],

      // Rotas para moderadores
      moderator: ['moderation.*', 'reports.*', 'comments.*'],

      // Rotas para administradores
      admin: ['admin.*', 'users.*', 'roles.*', 'permissions.*', 'system.*'],
    },
  },
})
