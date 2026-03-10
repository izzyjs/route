import { test } from '@japa/runner'
import { join } from 'node:path'
import { detectBuildPath, getRelativeBuildPath } from '../src/utils/path_resolver.js'

test.group('Path Resolver', () => {
  test('should detect build path correctly', async ({ assert }) => {
    const buildPath = await detectBuildPath()

    // Should return a valid path
    assert.isString(buildPath)
    assert.isNotEmpty(buildPath)

    // Should point to .adonisjs in project root
    assert.equal(buildPath, join(process.cwd(), '.adonisjs'))
  })

  test('should return relative path for logging', async ({ assert }) => {
    const relativePath = await getRelativeBuildPath()

    // Should return a string
    assert.isString(relativePath)
    assert.isNotEmpty(relativePath)

    // Should be the .adonisjs folder name
    assert.equal(relativePath, '.adonisjs')
  })

  test('should handle different project structures', async ({ assert }) => {
    // Test that the function doesn't throw errors
    await assert.doesNotReject(async () => {
      await detectBuildPath()
    })

    await assert.doesNotReject(async () => {
      await getRelativeBuildPath()
    })
  })
})
