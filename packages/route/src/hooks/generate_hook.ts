import type { AssemblerHookHandler } from '@adonisjs/core/types/app'
import generate from '../generate_routes.js'

/**
 * The hook to be executed during the build process. You can perform
 */
const biseGenerateHook: AssemblerHookHandler = async ({ logger }) => {
  try {
    await generate()
    logger.success('Named routes file generated successfully 🚀')
  } catch (error) {
    logger.error('Named routes file generation failed 🚨')
    logger.fatal(error)
  }
}

export default biseGenerateHook
