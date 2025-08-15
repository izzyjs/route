import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

/**
 * Detect if we're running in a monorepo environment
 */
function isMonorepo(): boolean {
  // Check for common monorepo indicators
  const cwd = process.cwd()

  return (
    existsSync(join(cwd, 'lerna.json')) ||
    existsSync(join(cwd, 'pnpm-workspace.yaml')) ||
    existsSync(join(cwd, 'rush.json')) ||
    existsSync(join(cwd, 'nx.json')) ||
    existsSync(join(cwd, 'turbo.json')) ||
    existsSync(join(cwd, 'packages')) ||
    existsSync(join(cwd, 'apps')) ||
    existsSync(join(cwd, 'workspaces'))
  )
}

/**
 * Find the package.json file to determine the package name
 */
async function findPackageJson(startPath: string): Promise<{ name: string; path: string } | null> {
  let currentPath = startPath

  while (currentPath !== dirname(currentPath)) {
    const packageJsonPath = join(currentPath, 'package.json')

    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = await import(packageJsonPath, { assert: { type: 'json' } })
        return { name: packageJson.default.name, path: currentPath }
      } catch {
        // Continue searching
      }
    }

    currentPath = dirname(currentPath)
  }

  return null
}

/**
 * Detect the correct build path for the client files
 * Works in both monorepo and standalone project scenarios
 */
export async function detectBuildPath(): Promise<string> {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const cwd = process.cwd()

  // Try to find package.json to get package name
  const packageInfo = await findPackageJson(currentDir)
  const packageName = packageInfo?.name || '@izzyjs/route'

  // Extract the package name without scope
  const packageShortName = packageName.replace(/^@[^/]+\//, '')

  const possiblePaths = [
    // Standalone project: node_modules/@izzyjs/route/build/src/client
    join(cwd, 'node_modules', packageName, 'build', 'src', 'client'),

    // Monorepo: packages/route/build/src/client (relative to workspace root)
    join(cwd, 'packages', packageShortName, 'build', 'src', 'client'),

    // Monorepo: apps/route/build/src/client (relative to workspace root)
    join(cwd, 'apps', packageShortName, 'build', 'src', 'client'),

    // Monorepo: packages/route/build/src/client (relative to current file)
    join(currentDir, '..', '..', '..', 'build', 'src', 'client'),

    // Monorepo: packages/route/build/src/client (relative to current file, going up more)
    join(currentDir, '..', '..', '..', '..', 'build', 'src', 'client'),

    // Development: build/src/client (relative to current file)
    join(currentDir, '..', '..', 'build', 'src', 'client'),

    // Development: dist/src/client (relative to current file)
    join(currentDir, '..', '..', 'dist', 'src', 'client'),
  ]

  // Find the first path that exists
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path
    }
  }

  // If we're in a monorepo, try to create the path in packages/
  if (isMonorepo()) {
    const monorepoPath = join(cwd, 'packages', packageShortName, 'build', 'src', 'client')
    return monorepoPath
  }

  // Fallback: use node_modules path
  return join(cwd, 'node_modules', packageName, 'build', 'src', 'client')
}

/**
 * Get the relative path from the current working directory to the build path
 * Useful for debugging and logging
 */
export async function getRelativeBuildPath(): Promise<string> {
  const buildPath = await detectBuildPath()
  const cwd = process.cwd()

  try {
    return relative(cwd, buildPath)
  } catch {
    return buildPath
  }
}
