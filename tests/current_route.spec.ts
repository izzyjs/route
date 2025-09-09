import { test } from '@japa/runner'
import { Routes } from '../src/route.js'

test.group('Routes.current', () => {
  test('should return current route path when called without parameters', async ({ assert }) => {
    // Mock the global Izzy object
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'users.index',
          path: '/users',
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
      current: '/users/123',
    }

    const routes = new Routes()
    const currentRoute = routes.current()

    assert.equal(currentRoute, '/users/123')
  })

  test('should return true when current route matches exact route name', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'users.index',
          path: '/users',
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
      current: '/users/123',
    }

    const routes = new Routes()

    // Should return true for exact match
    assert.isTrue(routes.current('users.show', { id: '123' }))

    // Should return false for different parameters
    assert.isFalse(routes.current('users.show', { id: '456' }))

    // Should return false for different route
    assert.isFalse(routes.current('users.index'))
  })

  test('should return true when current route matches route name without parameters', async ({
    assert,
  }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'users.index',
          path: '/users',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'posts.index',
          path: '/posts',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/users',
    }

    const routes = new Routes()

    // Should return true for exact match
    assert.isTrue(routes.current('users.index'))

    // Should return false for different route
    assert.isFalse(routes.current('posts.index'))
    assert.isFalse(routes.current('home'))
  })

  test('should handle wildcard patterns with *', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'users.index',
          path: '/users',
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
        {
          name: 'users.edit',
          path: '/users/:id/edit',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
        {
          name: 'posts.index',
          path: '/posts',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/users/123/edit',
    }

    const routes = new Routes()

    // Test wildcard patterns - these test the current route path, not route names
    assert.isTrue(routes.current('/users/*'))
    assert.isTrue(routes.current('users.edit', { id: '123' }))
    // users.show with id 123 would generate /users/123, but current is /users/123/edit
    assert.isFalse(routes.current('users.show', { id: '123' }))

    assert.isTrue(routes.current('users.*'))

    // Should return false for non-matching patterns
    assert.isFalse(routes.current('/posts/*'))
    assert.isFalse(routes.current('/todos/*'))
  })

  test('should handle complex wildcard patterns', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'admin.users.index',
          path: '/admin/users',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'admin.users.show',
          path: '/admin/users/:id',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
        {
          name: 'admin.posts.index',
          path: '/admin/posts',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'api.users.index',
          path: '/api/users',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/admin/users/456',
    }

    const routes = new Routes()

    // Test nested wildcard patterns
    assert.isTrue(routes.current('admin.*'))
    assert.isTrue(routes.current('admin.users.*'))
    assert.isTrue(routes.current('/admin/*'))
    assert.isTrue(routes.current('/admin/users/*'))

    // Should return false for non-matching patterns
    assert.isFalse(routes.current('admin.posts.*'))
    assert.isFalse(routes.current('api.*'))
    assert.isFalse(routes.current('/api/*'))
  })

  test('should handle route with query parameters', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.index',
          path: '/posts',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/posts?page=2&category=tech',
    }

    const routes = new Routes()

    // The current method compares the full current route (including query params)
    // with the generated route path (without query params), so this should fail
    assert.isFalse(routes.current('posts.index'))

    // The current method doesn't support query parameters, so we can't match routes with query params
    // This is a limitation of the current implementation
  })

  test('should handle root route', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'about',
          path: '/about',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/',
    }

    const routes = new Routes()

    assert.isTrue(routes.current('home'))
    assert.isFalse(routes.current('about'))
  })

  test('should handle routes with multiple parameters', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'posts.comments.show',
          path: '/posts/:postId/comments/:commentId',
          method: 'get',
          params: { required: ['postId', 'commentId'] },
          domain: 'root',
        },
      ],
      current: '/posts/123/comments/456',
    }

    const routes = new Routes()

    // Should match with correct parameters
    assert.isTrue(routes.current('posts.comments.show', { postId: '123', commentId: '456' }))

    // Should not match with incorrect parameters
    assert.isFalse(routes.current('posts.comments.show', { postId: '123', commentId: '789' }))
    assert.isFalse(routes.current('posts.comments.show', { postId: '456', commentId: '456' }))
  })

  test('should handle case sensitivity in route names', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'Users.Index',
          path: '/users',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'users.index',
          path: '/users',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/users',
    }

    const routes = new Routes()

    // Both should match because they have the same path
    assert.isTrue(routes.current('users.index'))
    assert.isTrue(routes.current('Users.Index'))
  })

  test('should handle empty current route', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'home',
          path: '/',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '',
    }

    const routes = new Routes()

    assert.equal(routes.current(), '')
    assert.isFalse(routes.current('home'))
  })

  test('should handle special characters in route paths', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'api.v1.users',
          path: '/api/v1/users',
          method: 'get',
          domain: 'root',
        },
        {
          name: 'api.v2.users',
          path: '/api/v2/users',
          method: 'get',
          domain: 'root',
        },
      ],
      current: '/api/v1/users',
    }

    const routes = new Routes()

    assert.isTrue(routes.current('api.v1.users'))
    assert.isTrue(routes.current('api.*'))
    assert.isTrue(routes.current('/api/*'))
    assert.isFalse(routes.current('api.v2.users'))
  })

  test('should handle routes with hyphens and underscores', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'user-profile.show',
          path: '/user-profile/:id',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
        {
          name: 'user_profile.show',
          path: '/user_profile/:id',
          method: 'get',
          params: { required: ['id'] },
          domain: 'root',
        },
      ],
      current: '/user-profile/123',
    }

    const routes = new Routes()

    assert.isTrue(routes.current('user-profile.show', { id: '123' }))
    assert.isTrue(routes.current('user-profile.*'))
    assert.isFalse(routes.current('user_profile.show', { id: '123' }))
  })

  test('should handle complex nested routes', async ({ assert }) => {
    globalThis.__izzy_route__ = {
      routes: [
        {
          name: 'admin.users.profile.edit',
          path: '/admin/users/:userId/profile/edit',
          method: 'get',
          params: { required: ['userId'] },
          domain: 'root',
        },
        {
          name: 'admin.users.profile.show',
          path: '/admin/users/:userId/profile',
          method: 'get',
          params: { required: ['userId'] },
          domain: 'root',
        },
      ],
      current: '/admin/users/123/profile/edit',
    }

    const routes = new Routes()

    // Test exact match
    assert.isTrue(routes.current('admin.users.profile.edit', { userId: '123' }))

    // Test wildcard patterns - these test the current route path
    assert.isTrue(routes.current('/admin/*'))
    assert.isTrue(routes.current('/admin/users/*'))

    // Test non-matching patterns
    assert.isFalse(routes.current('admin.users.profile.show', { userId: '123' }))
    assert.isFalse(routes.current('admin.users.profile.edit', { userId: '456' }))
  })

  test('should handle routes with optional parameters in current route matching', async ({
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
      current: '/posts/123',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // Should match with only required params (current route is /posts/123)
    assert.isTrue(Routes.current('posts.show', { id: '123' }))

    // Should not match with wrong required param
    assert.isFalse(Routes.current('posts.show', { id: '456' }))

    // Should not match with wrong optional param
    assert.isFalse(Routes.current('posts.show', { id: '123', slug: 'wrong-slug' }))
  })

  test('should handle routes with only optional parameters in current route matching', async ({
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
      current: '/posts',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // Should match without any params (current route is /posts)
    assert.isTrue(Routes.current('posts.index'))

    // Should not match with wrong optional param
    assert.isFalse(Routes.current('posts.index', { category: 'wrong-category' }))
  })

  test('should handle routes with multiple optional parameters in current route matching', async ({
    assert,
  }) => {
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
      current: '/posts',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // Should match without any optional params (current route is /posts)
    assert.isTrue(Routes.current('posts.filter'))

    // Should not match with wrong params
    assert.isFalse(Routes.current('posts.filter', { category: 'wrong-category' }))
    assert.isFalse(Routes.current('posts.filter', { category: 'tech', tag: 'wrong-tag' }))
  })

  test('should handle mixed required and optional parameters in current route matching', async ({
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
      current: '/users/123/posts/456',
      config: {
        baseUrl: 'https://example.com',
      },
    }

    // Should match with only required params (current route is /users/123/posts/456)
    assert.isTrue(
      Routes.current('users.posts.show', {
        userId: '123',
        id: '456',
      })
    )

    // Should not match with missing required params
    assert.throws(
      () =>
        Routes.current('users.posts.show', {
          userId: '123',
        }),
      'Missing required parameters for route "users.posts.show": "id"'
    )

    assert.throws(
      () =>
        Routes.current('users.posts.show', {
          id: '456',
        }),
      'Missing required parameters for route "users.posts.show": "userId"'
    )

    // Should not match with wrong params
    assert.isFalse(
      Routes.current('users.posts.show', {
        userId: '123',
        id: '456',
        slug: 'wrong-slug',
      })
    )
  })
})
