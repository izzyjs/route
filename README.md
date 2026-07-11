# @izzyjs/route

[![GitHub Actions Status](https://img.shields.io/github/actions/workflow/status/izzyjs/route/test.yml?branch=main&style=flat)](https://github.com/izzyjs/route/actions?query=workflow:Tests+branch:main)
[![Coverage Status](https://coveralls.io/repos/github/izzyjs/route/badge.svg?branch=main)](https://coveralls.io/github/izzyjs/route?branch=main)
[![npm version](https://badge.fury.io/js/%40izzyjs%2Froute.svg)](https://badge.fury.io/js/%40izzyjs%2Froute)
[![License](https://img.shields.io/github/license/izzyjs/route)](https://img.shields.io/github/license/izzyjs/route)

Use your named AdonisJS routes in JavaScript — like [Ziggy](https://github.com/tighten/ziggy) does for Laravel, but for AdonisJS and Inertia.

It gives you a `route()` helper on the client with full TypeScript inference: route names are autocompleted, required parameters are enforced at compile time, and you never hardcode a URL again.

Works with AdonisJS v6 and v7.

## Installation

```bash
node ace add @izzyjs/route
```

That single command installs the package and configures everything: the provider, the middleware, the Japa plugin, the `config/izzyjs.ts` file, and an initial route generation.

<details>
<summary>Manual setup</summary>

```bash
npm install @izzyjs/route
node ace configure @izzyjs/route
```

The configure step does the same wiring as `node ace add`.

</details>

### Regenerating routes

Route definitions (and their TypeScript types) are generated from your named routes:

```bash
node ace izzy:routes
```

To regenerate automatically whenever the dev server starts, register the dev hook in `adonisrc.ts`:

```ts
// adonisrc.ts — AdonisJS v7 (assembler v8)
{
  hooks: {
    devServerStarted: [() => import('@izzyjs/route/dev_hook')],
  },
}
```

```ts
// adonisrc.ts — AdonisJS v6 (assembler v7)
{
  unstable_assembler: {
    onDevServerStarted: [() => import('@izzyjs/route/dev_hook')],
  },
}
```

### Exposing routes to the browser

Add the `@routes()` tag to your Edge layout, before your app scripts:

```html
<!-- resources/views/inertia_layout.edge -->
<!doctype html>
<html>
  <head>
    @routes()
    @vite(['resources/js/app.js'])
  </head>
  <body>
    @inertia()
  </body>
</html>
```

This injects your (filtered) route list into the page so `route()` can resolve names at runtime.

## Configuration

`config/izzyjs.ts` is created for you. `baseUrl` is required — it's what powers the `url` property (complete URLs with protocol and domain):

```ts
// config/izzyjs.ts
import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: process.env.APP_URL || 'http://localhost:3333',

  routes: {
    // Pick one: `only` or `except`. Setting both disables filtering.
    // only: ['home', 'posts.*'],
    except: ['_debugbar.*', 'admin.*'],

    // Optional named groups (see "Route groups" below)
    groups: {
      admin: ['admin.*', 'users.*'],
      public: ['home', 'about', 'contact'],
    },
  },
})
```

### Filtering routes

Every route you expose is visible in the HTML source, so filter out what the client doesn't need. Patterns support `*` wildcards: `admin.*` matches `admin.login`, `admin.users.index`, and so on.

> **Note**: Filtering is not a security measure. Routes that shouldn't be publicly reachable must be protected by authentication, whether they appear in the client list or not.

## Usage

```ts
import { route } from '@izzyjs/route/client'

// Route without parameters
route('users.index').path // "/users"

// Route with parameters
route('users.show', { params: { id: '1' } }).path // "/users/1"
```

TypeScript enforces the parameters for you:

```ts
route('users.show', { params: { id: '123' } }) // ✅
route('users.show') // ❌ compile error: missing required param `id`
route('users.show', { params: { slug: 'x' } }) // ❌ compile error: unknown param
```

### Options

The second argument accepts `params`, `qs` (query string), `prefix`, and `hash`:

```ts
const url = route('users.show', {
  params: { id: '1' },
  qs: { page: '2' },
  prefix: '/api/v1',
  hash: 'profile',
})

url.path // "/api/v1/users/1?page=2#profile"
url.url // "https://example.com/api/v1/users/1?page=2#profile"
url.method // "get"
url.pattern // "/users/:id"
url.name // "users.show"
url.qs // URLSearchParams
url.hash // "profile"
```

The returned object extends `String`, so you can use it directly wherever a string is expected (e.g. `href` in Inertia's `<Link>`).

### Optional parameters

Optional parameters (`:slug?` in your AdonisJS route) can simply be omitted:

```ts
// router.get('/posts/:id/:slug?', ...).as('posts.show')
route('posts.show', { params: { id: '123', slug: 'my-post' } }).path // "/posts/123/my-post"
route('posts.show', { params: { id: '123' } }).path // "/posts/123"

// router.get('/posts/:category?', ...).as('posts.index')
route('posts.index', { params: { category: 'tech' } }).path // "/posts/tech"
route('posts.index').path // "/posts"
```

### Complete URLs and multi-domain apps

`path` is always relative; `url` includes protocol and host, built from `baseUrl`:

```ts
const user = route('users.show', { params: { id: '123' } })

user.path // "/users/123"
user.url // "https://example.com/users/123"
```

When a route is registered under a specific domain (AdonisJS `router.group().domain(...)`), `url` uses that domain instead of the `baseUrl` host — the protocol and port still come from `baseUrl`:

```ts
route('home').url // "https://example.com/"          (domain: root)
route('api.users.index').url // "https://api.example.com/users"  (domain: api.example.com)
```

If `baseUrl` is invalid, `url` falls back to the relative path.

### Checking the current route

`route()` with no arguments returns a helper for inspecting the current request:

```ts
route().current() // "/users/1" — the current path
route().current('users.show', { id: '1' }) // true/false — match by name + params
route().current('users.*') // true/false — wildcard match
route().current('/users/*') // true/false — wildcard on the path
```

Matching by name is domain-aware. If `admin.login` and `user.login` both resolve to `/login` on different subdomains, `route().current('admin.login')` is only `true` when you're actually on the admin subdomain:

```ts
// On admin.example.com/login
route().current('admin.login') // true
route().current('user.login') // false
```

### `has()` and `params`

```ts
route().has('users.show') // true — the named route exists
route().has('users.*') // true — at least one route matches

route().params // { id: '1' } — params extracted from the current URL
```

### Route groups

Groups defined in your config are exported alongside the generated routes:

```ts
import { routes, groups } from '@izzyjs/route/routes'

routes // every exposed route
groups.admin // only the routes matching the `admin` group patterns
groups.public // only the `public` group
```

> **Heads up**: `routes` and `groups` live in `@izzyjs/route/routes` (the generated file), not `@izzyjs/route/client`. The `groups` export always exists — it's an empty object when no groups are configured.

## Builder: typed HTTP requests

`builder` combines route resolution with a fetch-based HTTP client, so you can call your own API without hardcoding URLs:

```ts
import builder from '@izzyjs/route/builder'

const result = await builder('users.show', { id: '123' })
  .withQs({ include: 'profile' })
  .request()
  .successType<User>()
  .failedType<ApiError>()
  .run()

if (result.data) {
  console.log(result.data) // typed as User
} else {
  console.log(result.error) // typed as ApiError
}
```

`run()` never throws — it always resolves to `{ data, error }` where exactly one is set.

Sending data (POST/PUT/PATCH):

```ts
const result = await builder('users.store')
  .request()
  .withData({ name: 'John Doe', email: 'john@example.com' })
  .successType<User>()
  .run()
```

Builder methods:

| Method               | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `withQs(qs)`         | Add query string parameters                      |
| `withHash(hash)`     | Add a hash fragment                              |
| `withPrefix(prefix)` | Prepend a path prefix                            |
| `route()`            | Return the resolved `Route` (no request made)    |
| `request(config?)`   | Create the request (headers, timeout, etc.)      |
| `withData(data)`     | Set the request body                             |
| `successType<T>()`   | Type the success payload                         |
| `failedType<T>()`    | Type the error payload                           |
| `run()`              | Execute and resolve to `{ data, error }`         |

The HTTP client automatically:

- sends the `XSRF-TOKEN` cookie back as the `X-XSRF-TOKEN` header (CSRF protection)
- detects `Content-Type` from the body (JSON, `FormData`, `File`, `Blob`, `ArrayBuffer`, plain text)
- times out after 30s (configurable via `request({ timeout })`)

```ts
// Per-request configuration
await builder('users.show', { id: '123' })
  .request({
    headers: { Authorization: 'Bearer token' },
    credentials: 'include',
  })
  .run()
```

## Testing

The configure step registers a Japa plugin that loads your named routes into the test environment, so `route()` works inside your tests without a running server.

## Contributing

Contributions are welcome — see the [Contribution Guidelines](/.github/CONTRIBUTING.md) and [Code of Conduct](/.github/CODE_OF_CONDUCT.md).

## License

MIT License © [IzzyJs](https://github.com/IzzyJs)

<div align="center">
  <sub>Built with ❤︎ by <a href="https://github.com/lncitador">Walaff Fernandes</a></sub>
</div>
