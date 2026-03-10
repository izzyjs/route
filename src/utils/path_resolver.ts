import { join, relative } from 'node:path'

/**
 * Returns the .adonisjs directory in the project root.
 * This is where generated route files are stored.
 */
export async function detectBuildPath(): Promise<string> {
  return join(process.cwd(), '.adonisjs')
}

/**
 * Returns the relative path from cwd to the .adonisjs directory.
 * Useful for logging.
 */
export async function getRelativeBuildPath(): Promise<string> {
  return relative(process.cwd(), join(process.cwd(), '.adonisjs'))
}
