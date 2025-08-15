import type { AssemblerHookHandler } from '@adonisjs/core/types/app'
import generate from '../generate_routes.js'

/**
 * The hook to be executed during the build process. You can perform
 */
const hook: AssemblerHookHandler = async ({ logger }) => {
  try {
    const app = await import('@adonisjs/core/services/app')
    await generate(app.default)
    logger.success('Named routes file generated successfully 🚀')
  } catch (error) {
    logger.error('Named routes file generation failed 🚨')
    logger.fatal(error)
  }
}

export default hook
