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
          params: ['id'],
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
    assert.equal(postsRoute.url, 'https://example.com/posts%3Fpage=2&category=tech')
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
          params: ['id'],
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
})
