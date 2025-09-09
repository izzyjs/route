import { test } from '@japa/runner'
import { Route } from '../src/route.js'

test.group('URL Generation', () => {
  test('should generate complete URL when baseUrl is configured', async ({ assert }) => {
    // Mock the global Izzy object with configuration
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'users.show',
          path: '/users/:id',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const homeRoute = Route.new('home')
    const userRoute = Route.new('users.show', { id: '123' })

    assert.equal(homeRoute.path, '/')
    assert.equal(homeRoute.url, 'https://example.com/')

    assert.equal(userRoute.path, '/users/123')
    assert.equal(userRoute.url, 'https://example.com/users/123')
  })

  test('should fallback to path when baseUrl is not configured', async ({ assert }) => {
    // Mock the global Izzy object without configuration
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
    }

    const homeRoute = Route.new('home')

    assert.equal(homeRoute.path, '/')
    assert.equal(homeRoute.url, '/')
  })

  test('should fallback to path when baseUrl is invalid', async ({ assert }) => {
    // Mock the global Izzy object with invalid configuration
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'invalid-url',
      },
    }

    const homeRoute = Route.new('home')

    assert.equal(homeRoute.path, '/')
    assert.equal(homeRoute.url, '/')
  })

  test('should handle different baseUrl formats', async ({ assert }) => {
    // Test with HTTP
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'http://localhost:3333',
      },
    }

    let homeRoute = Route.new('home')
    assert.equal(homeRoute.url, 'http://localhost:3333/')

    // Test with subdomain
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://api.example.com',
      },
    }

    homeRoute = Route.new('home')
    assert.equal(homeRoute.url, 'https://api.example.com/')

    // Test with port
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'http://localhost:8080',
      },
    }

    homeRoute = Route.new('home')
    assert.equal(homeRoute.url, 'http://localhost:8080/')
  })

  test('should handle routes with query parameters', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.index',
          path: '/posts',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const postsRoute = Route.new('posts.index', undefined, { page: '2', category: 'tech' })

    assert.equal(postsRoute.path, '/posts?page=2&category=tech')
    assert.equal(postsRoute.url, 'https://example.com/posts?page=2&category=tech')
  })

  test('should handle routes with prefix', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'api.users.index',
          path: '/api/users',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://api.example.com',
      },
    }

    const apiRoute = Route.new('api.users.index', undefined, {}, '/v1')

    assert.equal(apiRoute.path, '/v1/api/users')
    assert.equal(apiRoute.url, 'https://api.example.com/v1/api/users')
  })

  test('should handle routes with parameters', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'users.show',
          path: '/users/:id',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const userRoute = Route.new('users.show', { id: '456' })

    assert.equal(userRoute.path, '/users/456')
    assert.equal(userRoute.url, 'https://example.com/users/456')
  })

  test('should use route domain when different from root', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'api.users.index',
          path: '/users',
          method: 'get',
          domain: 'api.example.com',
        },
        {
          name: 'admin.dashboard',
          path: '/dashboard',
          method: 'get',
          domain: 'admin.example.com',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const apiRoute = Route.new('api.users.index')
    const adminRoute = Route.new('admin.dashboard')

    // Should use the route's specific domain, not baseUrl.host
    assert.equal(apiRoute.path, '/users')
    assert.equal(apiRoute.url, 'https://api.example.com/users')

    assert.equal(adminRoute.path, '/dashboard')
    assert.equal(adminRoute.url, 'https://admin.example.com/dashboard')
  })

  test('should fallback to baseUrl.host when domain is root', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const homeRoute = Route.new('home')

    // Should use baseUrl.host when domain is 'root'
    assert.equal(homeRoute.path, '/')
    assert.equal(homeRoute.url, 'https://example.com/')
  })

  test('should preserve port when using custom route domain', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'api.users.index',
          path: '/users',
          method: 'get',
          domain: 'api.example.com',
        },
        {
          name: 'admin.dashboard',
          path: '/dashboard',
          method: 'get',
          domain: 'admin.example.com',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com:3000',
      },
    }

    const apiRoute = Route.new('api.users.index')
    const adminRoute = Route.new('admin.dashboard')

    // Should use route domain without port (since it doesn't have one) and add baseUrl port
    assert.equal(apiRoute.path, '/users')
    assert.equal(apiRoute.url, 'https://api.example.com:3000/users')

    // Should use route domain with its own port (since it already has one)
    assert.equal(adminRoute.path, '/dashboard')
    assert.equal(adminRoute.url, 'https://admin.example.com:3000/dashboard')
  })

  test('should handle routes with hash fragments', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'users.show',
          path: '/users/:id',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const homeRoute = Route.new('home', undefined, undefined, undefined, 'contato')
    const userRoute = Route.new('users.show', { id: '123' }, undefined, undefined, 'profile')

    assert.equal(homeRoute.path, '/#contato')
    assert.equal(homeRoute.url, 'https://example.com/#contato')
    assert.equal(homeRoute.hash, 'contato')

    assert.equal(userRoute.path, '/users/123#profile')
    assert.equal(userRoute.url, 'https://example.com/users/123#profile')
    assert.equal(userRoute.hash, 'profile')
  })

  test('should handle routes with query parameters and hash fragments', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.index',
          path: '/posts',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const postsRoute = Route.new(
      'posts.index',
      undefined,
      { page: '2', category: 'tech' },
      undefined,
      'comments'
    )

    assert.equal(postsRoute.path, '/posts?page=2&category=tech#comments')
    assert.equal(postsRoute.url, 'https://example.com/posts?page=2&category=tech#comments')
    assert.equal(postsRoute.hash, 'comments')
  })

  test('should handle routes with prefix, query parameters and hash fragments', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'api.users.index',
          path: '/api/users',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://api.example.com',
      },
    }

    const apiRoute = Route.new('api.users.index', undefined, { page: '1' }, '/v1', 'list')

    assert.equal(apiRoute.path, '/v1/api/users?page=1#list')
    assert.equal(apiRoute.url, 'https://api.example.com/v1/api/users?page=1#list')
    assert.equal(apiRoute.hash, 'list')
  })

  test('should handle empty hash fragment', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const homeRoute = Route.new('home', undefined, undefined, undefined, '')

    assert.equal(homeRoute.path, '/')
    assert.equal(homeRoute.url, 'https://example.com/')
    assert.equal(homeRoute.hash, '')
  })

  test('should handle routes with optional parameters - with params provided', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.show',
          path: '/posts/:id/:slug?',
          method: 'get',
          params: {
            required: ['id'],
            optional: ['slug'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const postRoute = Route.new('posts.show', { id: '123', slug: 'my-post-title' })

    assert.equal(postRoute.path, '/posts/123/my-post-title')
    assert.equal(postRoute.url, 'https://example.com/posts/123/my-post-title')
  })

  test('should handle routes with optional parameters - without optional params', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.show',
          path: '/posts/:id/:slug?',
          method: 'get',
          params: {
            required: ['id'],
            optional: ['slug'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const postRoute = Route.new('posts.show', { id: '123' })

    assert.equal(postRoute.path, '/posts/123')
    assert.equal(postRoute.url, 'https://example.com/posts/123')
  })

  test('should handle routes with only optional parameters - with params provided', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.index',
          path: '/posts/:category?',
          method: 'get',
          params: {
            optional: ['category'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const postsRoute = Route.new('posts.index', { category: 'tech' })

    assert.equal(postsRoute.path, '/posts/tech')
    assert.equal(postsRoute.url, 'https://example.com/posts/tech')
  })

  test('should handle routes with only optional parameters - without params', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.index',
          path: '/posts/:category?',
          method: 'get',
          params: {
            optional: ['category'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    const postsRoute = Route.new('posts.index')

    assert.equal(postsRoute.path, '/posts')
    assert.equal(postsRoute.url, 'https://example.com/posts')
  })

  test('should handle routes with multiple optional parameters', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.filter',
          path: '/posts/:category?/:tag?',
          method: 'get',
          params: {
            optional: ['category', 'tag'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // With all optional params
    const postsRouteAll = Route.new('posts.filter', { category: 'tech', tag: 'javascript' })
    assert.equal(postsRouteAll.path, '/posts/tech/javascript')
    assert.equal(postsRouteAll.url, 'https://example.com/posts/tech/javascript')

    // With only first optional param
    const postsRouteFirst = Route.new('posts.filter', { category: 'tech' })
    assert.equal(postsRouteFirst.path, '/posts/tech')
    assert.equal(postsRouteFirst.url, 'https://example.com/posts/tech')

    // With only second optional param
    const postsRouteSecond = Route.new('posts.filter', { tag: 'javascript' })
    assert.equal(postsRouteSecond.path, '/posts/javascript')
    assert.equal(postsRouteSecond.url, 'https://example.com/posts/javascript')

    // Without any optional params
    const postsRouteNone = Route.new('posts.filter')
    assert.equal(postsRouteNone.path, '/posts')
    assert.equal(postsRouteNone.url, 'https://example.com/posts')
  })

  test('should handle routes with mixed required and optional parameters', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'users.posts.show',
          path: '/users/:userId/posts/:id/:slug?',
          method: 'get',
          params: {
            required: ['userId', 'id'],
            optional: ['slug'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // With all params including optional
    const postRouteAll = Route.new('users.posts.show', {
      userId: '123',
      id: '456',
      slug: 'my-post-title',
    })
    assert.equal(postRouteAll.path, '/users/123/posts/456/my-post-title')
    assert.equal(postRouteAll.url, 'https://example.com/users/123/posts/456/my-post-title')

    // With only required params
    const postRouteRequired = Route.new('users.posts.show', {
      userId: '123',
      id: '456',
    })
    assert.equal(postRouteRequired.path, '/users/123/posts/456')
    assert.equal(postRouteRequired.url, 'https://example.com/users/123/posts/456')
  })

  test('should throw error when required parameters are missing for mixed params', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'users.posts.show',
          path: '/users/:userId/posts/:id/:slug?',
          method: 'get',
          params: {
            required: ['userId', 'id'],
            optional: ['slug'],
          },
          domain: 'root',
        },
      ],
      current: '/',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // Missing required userId
    assert.throws(
      () => Route.new('users.posts.show', { id: '456' }),
      'Missing required parameters for route "users.posts.show": "userId"'
    )

    // Missing required id
    assert.throws(
      () => Route.new('users.posts.show', { userId: '123' }),
      'Missing required parameters for route "users.posts.show": "id"'
    )

    // Missing all required params
    assert.throws(
      () => Route.new('users.posts.show'),
      'Route "users.posts.show" requires parameters: "userId", "id"'
    )
  })
})
