import { test } from '@japa/runner'
import { filterRoutes, getRoutesForGroup, getAvailableGroups } from '../src/utils/route_filter.js'
import type { SerializedRoute } from '../src/types/manifest.js'
import type { RouteFilter } from '../src/define_config.js'

const mockRoutes: SerializedRoute[] = [
  { name: 'home', path: '/', method: 'get', domain: 'root' },
  { name: 'about', path: '/about', method: 'get', domain: 'root' },
  { name: 'admin.login', path: '/admin/login', method: 'get', domain: 'root' },
  { name: 'admin.dashboard', path: '/admin/dashboard', method: 'get', domain: 'root' },
  { name: 'posts.index', path: '/posts', method: 'get', domain: 'root' },
  { name: 'posts.show', path: '/posts/:id', method: 'get', domain: 'root' },
  { name: 'posts.create', path: '/posts/create', method: 'post', domain: 'root' },
  { name: 'users.index', path: '/users', method: 'get', domain: 'root' },
  { name: 'users.show', path: '/users/:id', method: 'get', domain: 'root' },
  { name: '_debugbar.open', path: '/_debugbar/open', method: 'get', domain: 'root' },
  { name: 'horizon.dashboard', path: '/horizon/dashboard', method: 'get', domain: 'root' },
]

test('should return all routes when no filter is provided', ({ assert }) => {
  const result = filterRoutes(mockRoutes)
  assert.equal(result.length, 11)
})

test('should filter routes using only filter', ({ assert }) => {
  const config: RouteFilter = {
    only: ['home', 'about', 'posts.*'],
  }

  const result = filterRoutes(mockRoutes, config)
  assert.equal(result.length, 5)
  assert.deepEqual(
    result.map((r) => r.name),
    ['home', 'about', 'posts.index', 'posts.show', 'posts.create']
  )
})

test('should filter routes using except filter', ({ assert }) => {
  const config: RouteFilter = {
    except: ['admin.*', '_debugbar.*', 'horizon.*'],
  }

  const result = filterRoutes(mockRoutes, config)
  assert.equal(result.length, 7)
  assert.deepEqual(
    result.map((r) => r.name),
    ['home', 'about', 'posts.index', 'posts.show', 'posts.create', 'users.index', 'users.show']
  )
})

test('should disable filtering when both only and except are set', ({ assert }) => {
  const config: RouteFilter = {
    only: ['home'],
    except: ['admin.*'],
  }

  const result = filterRoutes(mockRoutes, config)
  assert.equal(result.length, 11)
})

test('should support wildcard patterns in only filter', ({ assert }) => {
  const config: RouteFilter = {
    only: ['admin.*', 'posts.*'],
  }

  const result = filterRoutes(mockRoutes, config)
  assert.equal(result.length, 5)
  assert.deepEqual(
    result.map((r) => r.name),
    ['admin.login', 'admin.dashboard', 'posts.index', 'posts.show', 'posts.create']
  )
})

test('should support wildcard patterns in except filter', ({ assert }) => {
  const config: RouteFilter = {
    except: ['admin.*', 'posts.*'],
  }

  const result = filterRoutes(mockRoutes, config)
  assert.equal(result.length, 6)
  assert.deepEqual(
    result.map((r) => r.name),
    ['home', 'about', 'users.index', 'users.show', '_debugbar.open', 'horizon.dashboard']
  )
})

test('should return routes for a specific group', ({ assert }) => {
  const config: RouteFilter = {
    groups: {
      admin: ['admin.*', 'users.*'],
      posts: ['posts.*'],
      public: ['home', 'about'],
    },
  }

  const adminRoutes = getRoutesForGroup(mockRoutes, 'admin', config)
  const postsRoutes = getRoutesForGroup(mockRoutes, 'posts', config)
  const publicRoutes = getRoutesForGroup(mockRoutes, 'public', config)

  assert.equal(adminRoutes.length, 4)
  assert.deepEqual(
    adminRoutes.map((r) => r.name),
    ['admin.login', 'admin.dashboard', 'users.index', 'users.show']
  )

  assert.equal(postsRoutes.length, 3)
  assert.deepEqual(
    postsRoutes.map((r) => r.name),
    ['posts.index', 'posts.show', 'posts.create']
  )

  assert.equal(publicRoutes.length, 2)
  assert.deepEqual(
    publicRoutes.map((r) => r.name),
    ['home', 'about']
  )
})

test('should return empty array for non-existent group', ({ assert }) => {
  const config: RouteFilter = {
    groups: {
      admin: ['admin.*'],
    },
  }

  const result = getRoutesForGroup(mockRoutes, 'nonexistent', config)
  assert.equal(result.length, 0)
})

test('should return empty array when no groups are configured', ({ assert }) => {
  const result = getRoutesForGroup(mockRoutes, 'admin')
  assert.equal(result.length, 0)
})

test('should return available group names', ({ assert }) => {
  const config: RouteFilter = {
    groups: {
      admin: ['admin.*'],
      posts: ['posts.*'],
      public: ['home', 'about'],
    },
  }

  const groups = getAvailableGroups(config)
  assert.deepEqual(groups, ['admin', 'posts', 'public'])
})

test('should return empty array when no groups are configured', ({ assert }) => {
  const groups = getAvailableGroups()
  assert.deepEqual(groups, [])
})
