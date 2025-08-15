/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import ConfigureCommand from '@adonisjs/core/commands/configure'
import generateRoutes from './src/generate_routes.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await generateRoutes(command.app)

  await codemods.registerMiddleware('server', [
    {
      path: '@izzyjs/route/izzy_middleware',
      position: 'after',
    },
  ])

  await codemods.registerJapaPlugin('izzyRoutePlugin()', [
    {
      isNamed: true,
      module: '@izzyjs/route/plugins/japa',
      identifier: 'izzyRoutePlugin',
    },
  ])

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@izzyjs/route/izzy_provider')
    rcFile.addCommand('@izzyjs/route/commands')
  })
}
