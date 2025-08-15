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
      params: ['id'],
      domain: 'root',
    }

    const serializedRoute = serializeRoute(route, 'root')

    assert.deepEqual(serializedRoute, expectedSerializedRoute)
  })
})
