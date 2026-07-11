import { exec } from 'node:child_process'
import { promisify } from 'node:util'

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __izzy_routes_generated_once__: boolean | undefined
}

interface LoggerLike {
  info(message: string): void
  error(message: string): void
  fatal(error: unknown): void
}

/**
 * Assembler hook executed when the dev server starts. Compatible with both
 * assembler v7 (`onDevServerStarted` receives `{ logger }`) and assembler v8
 * (`devServerStarted` receives the DevServer instance).
 */
const hook = async (context?: { logger?: LoggerLike }) => {
  // Prevent duplicate generation/logging on rapid consecutive triggers
  if (globalThis.__izzy_routes_generated_once__) {
    return
  }

  globalThis.__izzy_routes_generated_once__ = true

  const logger: LoggerLike = context?.logger ?? {
    info: (message) => console.log(message),
    error: (message) => console.error(message),
    fatal: (error) => console.error(error),
  }

  try {
    await promisify(exec)('node ace izzy:routes')
    logger.info('Named routes file generated successfully 🚀')
  } catch (error) {
    logger.error('Named routes file generation failed 🚨')
    logger.fatal(error)
  }
}

export default hook
