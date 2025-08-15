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
import { stubsRoot } from './stubs/main.js'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  // Write config/izzyjs.ts from stub (idempotent)
  await codemods.makeUsingStub(stubsRoot, 'config/izzy_routes.stub', {})

  await codemods.registerMiddleware('server', [
    {
      path: '@izzyjs/route/izzy_middleware',
      position: 'after',
    },
  ])

  await codemods.registerJapaPlugin('izzyRoutePlugin(app)', [
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

  await promisify(exec)('node ace izzy:routes')
}
