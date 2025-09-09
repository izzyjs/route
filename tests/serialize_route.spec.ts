import { test } from '@japa/runner'
import { serializeRoute } from '../src/serialize_route.js'
import { RouteJSON } from '@adonisjs/core/types/http'

test.group('serializeRoute', () => {
  test('should serialize route correctly', ({ assert }) => {
    const route = {
      name: 'home',
      pattern: '/home',
      methods: ['GET', 'POST'],
    } as RouteJSON

    const expectedSerializedRoute = {
      name: 'home',
      path: '/home',
      method: 'get',
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })

  test('should handle route with parameters', ({ assert }) => {
    const route = {
      name: 'user',
      pattern: '/users/:id',
      methods: ['GET'],
    } as RouteJSON

    const expectedSerializedRoute = {
      name: 'user',
      path: '/users/:id',
      method: 'get',
      params: {
        required: ['id'],
        optional: undefined,
      },
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })

  test('should serialize route with optional parameters', async ({ assert }) => {
    const route = {
      name: 'posts.show',
      pattern: '/posts/:id/:slug?',
      methods: ['GET'],
    } as RouteJSON

    const expectedSerializedRoute = {
      name: 'posts.show',
      path: '/posts/:id/:slug?',
      method: 'get',
      params: {
        required: ['id'],
        optional: ['slug'],
      },
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })

  test('should serialize route with only optional parameters', async ({ assert }) => {
    const route = {
      name: 'posts.index',
      pattern: '/posts/:category?',
      methods: ['GET'],
    } as RouteJSON

    const expectedSerializedRoute = {
      name: 'posts.index',
      path: '/posts/:category?',
      method: 'get',
      params: {
        required: undefined,
        optional: ['category'],
      },
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })

  test('should serialize route with multiple optional parameters', async ({ assert }) => {
    const route = {
      name: 'posts.filter',
      pattern: '/posts/:category?/:tag?',
      methods: ['GET'],
    } as RouteJSON

    const expectedSerializedRoute = {
      name: 'posts.filter',
      path: '/posts/:category?/:tag?',
      method: 'get',
      params: {
        required: undefined,
        optional: ['category', 'tag'],
      },
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })

  test('should serialize route with mixed required and optional parameters', async ({ assert }) => {
    const route = {
      name: 'users.posts.show',
      pattern: '/users/:userId/posts/:id/:slug?',
      methods: ['GET'],
    } as RouteJSON

    const expectedSerializedRoute = {
      name: 'users.posts.show',
      path: '/users/:userId/posts/:id/:slug?',
      method: 'get',
      params: {
        required: ['userId', 'id'],
        optional: ['slug'],
      },
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })
})
