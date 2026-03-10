import type { DevServer, TestRunner, Bundler } from '@adonisjs/assembler'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __izzy_routes_generated_once__: boolean | undefined
}

/**
 * The hook to be executed during the build process. You can perform
 */
const hook = async (parent: DevServer | TestRunner | Bundler) => {
  const { logger } = parent.ui
  // Prevent duplicate generation/logging on rapid consecutive triggers
  if (globalThis.__izzy_routes_generated_once__) {
    return
  }

  globalThis.__izzy_routes_generated_once__ = true

  try {
    await promisify(exec)('node ace izzy:routes')
    logger.info('Named routes file generated successfully 🚀')
  } catch (error) {
    logger.error('Named routes file generation failed 🚨')
    logger.fatal(error)
  }
}

export default hook
