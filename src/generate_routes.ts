/**
 * @izzyjs/route
 *
 * (c) IzzyJs - 2024
 * For the full license information, please view the LICENSE file that was distributed with this source code.
 */
import { exec } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { existsSync, unlinkSync } from 'node:fs'
import type { Routes } from './types/routes.js'
import type { SerializedRoute } from './types/manifest.js'

export default async function generateRoutes() {
  const baseDir = 'node_modules/@izzyjs/route/build/src/client'
  const jsFile = `${baseDir}/routes.js`
  const dtsFile = `${baseDir}/routes.d.ts`

  const routes = await namedRoutes()

  const jsContent = javascriptContent(routes)
  const dtsContent = definitionContent(routes)

  if (existsSync(jsFile)) {
    unlinkSync(jsFile)
  }

  if (existsSync(dtsFile)) {
    unlinkSync(dtsFile)
  }

  await writeFile(jsFile, jsContent, 'utf-8')
  await writeFile(dtsFile, dtsContent, 'utf-8')
}

export async function namedRoutes() {
  const output = await runCommand()
  const root = output.find((route) => route.domain === 'root')

  const bucket: SerializedRoute[] = []

  if (!root) {
    throw new Error('Missing root domain')
  }

  for (const route of root.routes) {
    const params = route.pattern.match(/:\w+/g)?.map((param) => param.slice(1))

    if (route.name) {
      bucket.push({
        name: route.name,
        path: route.pattern,
        method: route.methods[0].toLowerCase() as any,
        params,
      })
    }
  }

  if (bucket.length === 0) {
    throw new Error(
      'No named routes found see: https://docs.adonisjs.com/guides/routing#route-identifier'
    )
  }

  return bucket
}

async function runCommand() {
  return new Promise<Routes>((resolve, reject) => {
    exec('node --no-warnings ace list:routes --json', (error, stdout, stderr) => {
      if (error) reject(error)
      if (stderr) reject(stderr)

      let hasError = false

      for (const line of stdout.split('\n')) {
        if (line.includes('TypeError')) {
          reject(new Error(line))
          hasError = true
          break
        }
      }

      if (hasError) {
        console.error(stdout)
        return
      }

      resolve(JSON.parse(stdout))
    })
  })
}

export function javascriptContent(bucket: SerializedRoute[]) {
  const output = JSON.stringify(bucket, null, '\t')

  return [
    '/* eslint-disable prettier/prettier */\n// Generated automatically by named routes hook\n/* DO NOT EDIT THIS FILE DIRECTLY */',
    `export const routes = ${output};`,
  ].join('\n\n')
}

export function definitionContent(bucket: SerializedRoute[]) {
  const output = bucket
    .map(({ method, path, name, params }) => {
      if (params) {
        const routeType = [
          '\t{',
          `\t\treadonly name: '${name}';`,
          `\t\treadonly path: '${path}';`,
          `\t\treadonly method: '${method}';`,
          `\t\treadonly params: readonly ['${params.join("','")}'];`,
          '\t}',
        ]

        return routeType.join('\n')
      }

      const routeType = [
        '\t{',
        `\t\treadonly name: '${name}';`,
        `\t\treadonly path: '${path}';`,
        `\t\treadonly method: '${method}';`,
        '\t}',
      ]

      return routeType.join('\n')
    })
    .join(',\n')

  const declaredRoutes = ['export declare const routes: readonly [', ` ${output}`, '];'].join('\n')

  return [
    '// Generated automatically by @bise/route\n// Do not modify this file',
    declaredRoutes,
    'export type Routes = typeof routes;',
    'export type Route = Routes[number];',
    'export type RouteWithName = Extract<Route, { name: string }>;',
    'export type RouteWithParams = Extract<Route, { params: ReadonlyArray<string>; }>;',
    "export type RouteName = Exclude<RouteWithName['name'], ''>;",
  ].join('\n\n')
}
