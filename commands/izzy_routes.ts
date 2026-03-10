import { BaseCommand } from '@adonisjs/core/ace'
import generateRoutes from '../src/generate_routes.js'
import { type CommandOptions } from '@adonisjs/core/types/ace'

export default class IzzyRoutes extends BaseCommand {
  static commandName = 'izzy:routes'
  static description = 'Generate routes for @izzyjs/route package'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Generating routes file... ♻️')

    try {
      await generateRoutes()
      this.logger.success('Routes file generated successfully! 🎉')
    } catch (error) {
      this.logger.error('Error generating routes file 🚨')
      this.logger.error(error)
    }
  }
}
