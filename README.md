# @izzyjs/route

[![GitHub Actions Status](https://img.shields.io/github/actions/workflow/status/izzyjs/route/test.yml?branch=main&style=flat)](https://github.com/izzyjs/route/actions?query=workflow:Tests+branch:main)
[![Coverage Status](https://coveralls.io/repos/github/izzyjs/route/badge.svg?branch=main)](https://coveralls.io/github/izzyjs/route?branch=main)
[![GitHub issues](https://img.shields.io/github/issues/izzyjs/route)](https://github.com/izzyjs/route/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/izzyjs/route)](https://github.com/izzyjs/route/pulls)
[![npm version](https://badge.fury.io/js/%40izzyjs%2Froute.svg)](https://badge.fury.io/js/%40izzyjs%2Froute)
[![License](https://img.shields.io/github/license/izzyjs/route)](https://img.shields.io/github/license/izzyjs/route)

**_Use your AdonisJs routes in JavaScript with advanced HTTP client capabilities._**

This package provides a JavaScript `route()` function and a powerful `builder` for generating URLs and making HTTP requests to named routes defined in an AdonisJs application. Features include hash fragments, query parameters, TypeScript support, and automatic CSRF protection.

## Key Features

- 🚀 **Route Generation** - Generate URLs for named AdonisJs routes
- 🔗 **Hash Fragments** - Support for hash fragments (`/path#section`)
- 🌐 **Complete URLs** - Generate full URLs with protocol and domain
- 🔧 **Builder API** - Fluent API for HTTP requests with TypeScript support
- 🛡️ **CSRF Protection** - Automatic CSRF token handling
- 📝 **TypeScript** - Full TypeScript support with type inference
- 🎯 **Query Parameters** - Easy query parameter management
- 🔄 **HTTP Methods** - Support for GET, POST, PUT, DELETE, PATCH
- ⚡ **Error Handling** - Global error handling and response management
- 🎨 **Route Filtering** - Filter routes by patterns or groups

## Quick Start

> **ℹ️ Note**: The `baseUrl` is **mandatory** in your `config/izzyjs.ts` file and will always be available for complete URLs.

```javascript
import { route } from '@izzyjs/route/client'
import builder from '@izzyjs/route/builder'

// Generate URLs
const userUrl = route('users.show', { params: { id: '123' } })
console.log(userUrl.path) // "/users/123"
console.log(userUrl.url) // "https://example.com/users/123" (requires baseUrl config)

// With hash fragments
const homeWithHash = route('home', { hash: 'contact' })
console.log(homeWithHash.path) // "/#contact"

// Make HTTP requests
const result = await builder('users.show', { id: '123' })
  .withQs({ include: 'profile' })
  .withHash('details')
  .request()
  .successType<UserResponse>()
  .run()

if (result.data) {
  console.log('User:', result.data)
}
```

## Installation

### Recommended (automatic)

The following command will install and configure everything automatically (provider, middleware, Japa plugin, config file `config/izzyjs.ts`, and route generation):

```bash
node ace add @izzyjs/route
```

### Manual (step-by-step)

If you prefer manual setup, install the package with your package manager and then run the configure hook:

```bash
# npm
npm install @izzyjs/route

# yarn
yarn add @izzyjs/route

# pnpm
pnpm add @izzyjs/route

# then configure
node ace configure @izzyjs/route
```

The configure step will generate `config/izzyjs.ts`, register the provider/middleware/Japa plugin, and trigger an initial routes generation.

## Configuration

To use the `route()` function in your JavaScript applications, you need to follow these steps:

### Command

You can run a command to generate the route definitions from @izzyjs/routes with:

```bash
node ace izzy:routes
```

These type definitions are only needed in a development environment, so they can be generated automatically in the next step.

### Assemble Hook

Add the following line to the `adonisrc.ts` file to register the `() => import('@izzyjs/route/dev_hook')` on `onDevServerStarted` array list.

```javascript
{
  // rest of adonisrc.ts file
  unstable_assembler: {
    onBuildStarting: [() => import('@adonisjs/vite/build_hook')],
    onDevServerStarted: [() => import('@izzyjs/route/dev_hook')] // Add this line,
  }
}
```

### View Helper

Add edge plugin in entry view file `@routes` to use the `route()` into javascript.

```html
// resources/views/inertia_layout.edge

<!doctype html>
<html>
  <head>
    // rest of the file @routes() // Add this line // rest of the file
  </head>

  <body>
    @inertia()
  </body>
</html>
```

### Route Filtering

@izzyjs/route supports filtering the list of routes it outputs, which is useful if you have certain routes that you don't want to be included and visible in your HTML source.

**Important**: Hiding routes from the output is not a replacement for thorough authentication and authorization. Routes that should not be accessible publicly should be protected by authentication whether they're filtered out or not.

#### Including/Excluding Routes

To set up route filtering, create a config file in your app at `config/izzyjs.ts` and add either an `only` or `except` key containing an array of route name patterns.

**Note**: You have to choose one or the other. Setting both `only` and `except` will disable filtering altogether and return all named routes.

```typescript
// config/izzyjs.ts
import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: 'https://example.com', // ⚠️ MANDATORY - Required for complete URLs

  routes: {
    // Include only specific routes
    only: ['home', 'posts.index', 'posts.show'],

    // OR exclude specific routes
    // except: ['_debugbar.*', 'horizon.*', 'admin.*'],
  },
})
```

You can use asterisks as wildcards in route filters. In the example below, `admin.*` will exclude routes named `admin.login`, `admin.register`, etc.:

```typescript
// config/izzyjs.ts
import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: 'https://example.com',

  routes: {
    except: ['_debugbar.*', 'horizon.*', 'admin.*'],
  },
})
```

#### Filtering with Groups

You can also define groups of routes that you want to make available in different places in your app, using a `groups` key in your config file:

```typescript
// config/izzyjs.ts
import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: 'https://example.com',

  routes: {
    groups: {
      admin: ['admin.*', 'users.*'],
      author: ['posts.*'],
      public: ['home', 'about', 'contact'],
    },
  },
})
```

### Complete URLs

The `baseUrl` is **mandatory** in your `defineConfig`. When configured, the `route()` function automatically generates complete URLs with protocol, domain, and path. This is useful for:

- External links and redirects
- API calls to different domains
- Email templates and notifications
- Webhook URLs
- Cross-domain requests

```typescript
// config/izzyjs.ts
import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: 'https://api.example.com',
  routes: {
    except: ['admin.*'],
  },
})
```

Now when you use the `route()` function, you get both the path and complete URL:

```javascript
import { route } from '@izzyjs/route/client'

const userRoute = route('users.show', { id: '123' })

console.log(userRoute.path) // "/users/123"
console.log(userRoute.url) // "https://api.example.com/users/123"

// Use url for external requests
fetch(userRoute.url)
window.open(userRoute.url)
```

The `baseUrl` can include:

- Protocol: `http://` or `https://`
- Domain: `example.com` or `api.example.com`
- Port: `localhost:8080`
- Subdomain: `admin.example.com`

If the `baseUrl` is invalid or not configured, `url` falls back to just the path.

#### Domain-Specific URLs

When your routes have different domains (not just 'root'), the system automatically uses the route's specific domain instead of the `baseUrl.host`:

```typescript
// config/izzyjs.ts
export default defineConfig({
  baseUrl: 'https://example.com', // Protocol will be extracted from this
  routes: { ... }
})

// Routes with different domains
const homeRoute = route('home')           // domain: 'root'
const apiRoute = route('api.users.index') // domain: 'api.example.com'
const adminRoute = route('admin.dashboard') // domain: 'admin.example.com'

console.log(homeRoute.url)   // "https://example.com/" (uses baseUrl.host)
console.log(apiRoute.url)    // "https://api.example.com/users" (uses route domain)
console.log(adminRoute.url)  // "https://admin.example.com/dashboard" (uses route domain)
```

This is useful for multi-domain applications where different routes need to point to different subdomains or domains.

When groups are configured, they will be available in your generated routes:

```javascript
import { routes, groups } from '@izzyjs/route/client'

// Access all routes
console.log(routes)

// Access specific groups
console.log(groups.admin) // Admin routes only
console.log(groups.author) // Author routes only
console.log(groups.public) // Public routes only
```

## Usage

Now that we've followed all the steps, we're ready to use `route()` on the client side to generate URLs for named routes.

```javascript
import { route } from '@izzyjs/route/client'

const url = route('users.show', { params: { id: '1' } }) // /users/1
```

### Route

Is a callback class with a parameter for route(), with information about the method, pattern and path itself.

#### API Options

The `route()` function accepts an options object with the following properties:

- **`params`** - Route parameters (required for routes with parameters)
- **`qs`** - Query string parameters
- **`prefix`** - Route prefix
- **`hash`** - Hash fragment

```javascript
import { route } from '@izzyjs/route/client'

// Basic usage
const url = route('users.show', { params: { id: '1' } }) // /users/1

// With all options
const fullUrl = route('users.show', {
  params: { id: '1' },
  qs: { page: '2' },
  prefix: '/api/v1',
  hash: 'profile',
})

url.method // GET
url.pattern // /users/:id
url.path // /users/1
url.url // "https://example.com/users/1" (when baseUrl is configured)
url.qs // URLSearchParams object
url.hash // hash fragment (if provided)
```

#### Route Object Properties

The `route` object also provides additional methods:

```javascript
import { route } from '@izzyjs/route/client'

// Check current route
route().current() // Returns current route path
route().current('users.show', { id: '1' }) // Check if current route matches

// Create new Route instance (alternative to route function)
route.new('users.show', { id: '1' }, { page: '2' }, '/api', 'profile')

// Access builder for HTTP requests
route.builder('users.show', { id: '1' }).withQs({ page: '2' }).request()
```

#### Hash Fragments

You can now add hash fragments to your routes for navigation to specific sections of a page:

```javascript
import { route } from '@izzyjs/route/client'

// Basic hash usage
const homeWithHash = route('home', { hash: 'contact' })
console.log(homeWithHash.path) // "/#contact"
console.log(homeWithHash.url) // "https://example.com/#contact"
console.log(homeWithHash.hash) // "contact"

// Hash with parameters
const userWithHash = route('users.show', {
  params: { id: '123' },
  hash: 'profile',
})
console.log(userWithHash.path) // "/users/123#profile"
console.log(userWithHash.url) // "https://example.com/users/123#profile"

// Hash with query parameters
const postsWithHash = route('posts.index', {
  qs: { page: '2' },
  hash: 'comments',
})
console.log(postsWithHash.path) // "/posts?page=2#comments"
console.log(postsWithHash.url) // "https://example.com/posts?page=2#comments"

// Hash with prefix
const apiWithHash = route('api.users.index', {
  qs: { page: '1' },
  prefix: '/v1',
  hash: 'list',
})
console.log(apiWithHash.path) // "/v1/api/users?page=1#list"
console.log(apiWithHash.url) // "https://api.example.com/v1/users?page=1#list"
```

#### Complete URLs

The `url` property provides complete URLs with protocol and domain, but **requires the `baseUrl` to be configured** in your `config/izzyjs.ts` file.

**Important**: The `baseUrl` is **mandatory** in the `defineConfig` and will always be available.

##### Configuration

The `baseUrl` is **mandatory** in your `config/izzyjs.ts` file:

```typescript
// config/izzyjs.ts
import { defineConfig } from '@izzyjs/route'

export default defineConfig({
  baseUrl: process.env.APP_URL || 'http://localhost:3333',
  // ... other config
})
```

##### How URL Generation Works

The `url` property always returns complete URLs with protocol and domain, using the configured `baseUrl`.

When `baseUrl` is configured, you can access the complete URL with protocol and domain:

```javascript
import { route } from '@izzyjs/route/client'

const userRoute = route('users.show', { params: { id: '123' } })

// Basic properties
console.log(userRoute.path) // "/users/123"
console.log(userRoute.url) // "https://api.example.com/users/123"

// Use url for external requests
fetch(userRoute.url)
window.open(userRoute.url)

// With query parameters
const postsRoute = route('posts.index', { qs: { page: '2' } })
console.log(postsRoute.url) // "https://api.example.com/posts?page=2"

// With prefix
const apiRoute = route('api.v1.users.index', { prefix: '/v1' })
console.log(apiRoute.url) // "https://api.example.com/v1/api/v1/users"
```

##### Examples: With vs Without Configuration

**With `baseUrl` configured:**

```javascript
// config/izzyjs.ts
export default defineConfig({
  baseUrl: 'https://api.example.com',
})

const userRoute = route('users.show', { params: { id: '123' } })
console.log(userRoute.path) // "/users/123"
console.log(userRoute.url) // "https://api.example.com/users/123" ✅ Complete URL
```

##### Supported `baseUrl` Formats

The `baseUrl` supports various formats:

```typescript
// config/izzyjs.ts
export default defineConfig({
  // HTTP
  baseUrl: 'http://localhost:3333',

  // HTTPS
  baseUrl: 'https://api.example.com',

  // With port
  baseUrl: 'http://localhost:8080',

  // With subdomain
  baseUrl: 'https://api.example.com',

  // Using environment variable (recommended)
  baseUrl: process.env.APP_URL || 'http://localhost:3333',
})
```

##### Domain-Specific URLs

When your routes have different domains (not just 'root'), the system automatically uses the route's specific domain:

```typescript
// config/izzyjs.ts
export default defineConfig({
  baseUrl: 'https://example.com', // Protocol will be extracted from this
})

// Routes with different domains
const homeRoute = route('home') // domain: 'root'
const apiRoute = route('api.users.index') // domain: 'api.example.com'
const adminRoute = route('admin.dashboard') // domain: 'admin.example.com'

console.log(homeRoute.url) // "https://example.com/" (uses baseUrl.host)
console.log(apiRoute.url) // "https://api.example.com/users" (uses route domain)
console.log(adminRoute.url) // "https://admin.example.com/dashboard" (uses route domain)
```

### Routes

Is a callback class withoout a parameter for route(), with information about the method, partern and path itself.

#### Current

The current method returns the current URL of the page or the URL of the page that the user is currently on.

```javascript
import { route } from '@izzyjs/route/client'

// current /users/1

route().current() // /users/1
route().current('/users/1') // true
route().current('/users/2') // false
route().current('users.*') // true
```

#### Has

The has method returns a boolean value indicating whether the named route exists in the application.

```javascript
// start/routes.ts

import router from '@adonisjs/core/services/router'

const usersConstroller = () => import('#app/controllers/users_controller')

router.get('/users', [usersConstroller, 'index']).as('users.index')
router.get('/users/:id', [usersConstroller, 'show']).as('users.show')
```

```javascript
import { route } from '@izzyjs/route/client'

route().has('users.show') // true
route().has('users.*') // true
route().has('dashboard') // false
```

#### Params

The params method returns the parameters of the URL of the page that the user is currently on.

```javascript
import { route } from '@izzyjs/route/client'

route().params() // { id: '1' }
```

### Builder (Advanced HTTP Requests)

The `builder` provides a powerful, fluent API for making HTTP requests with full TypeScript support. It combines route generation with HTTP client functionality.

```javascript
import builder from '@izzyjs/route/builder'

// Basic usage - get route information
const route = builder('users.show', { id: '123' })
  .withQs({ page: '1' })
  .withHash('profile')
  .withPrefix('/api/v1')
  .route()

console.log(route.path) // "/api/v1/users/123?page=1#profile"
console.log(route.url) // "https://example.com/api/v1/users/123?page=1#profile"
```

#### Making HTTP Requests

```javascript
import builder from '@izzyjs/route/builder'

// GET request
const result = await builder('users.show', { id: '123' })
  .withQs({ include: 'profile' })
  .request()
  .successType<UserResponse>()
  .failedType<ApiError>()
  .run()

if (result.data) {
  console.log('User:', result.data)
} else {
  console.log('Error:', result.error)
}

// POST request with data
const createResult = await builder('users.store')
  .request()
  .successType<User>()
  .failedType<ValidationError>()
  .withData({ name: 'John Doe', email: 'john@example.com' })
  .run()

// PUT request
const updateResult = await builder('users.update', { id: '123' })
  .request()
  .withData({ name: 'Jane Doe' })
  .run()

// DELETE request
const deleteResult = await builder('users.destroy', { id: '123' })
  .request()
  .run()
```

#### Advanced Builder Features

```javascript
// Chain multiple modifiers
const result = await builder('posts.index')
  .withQs({ category: 'tech', page: '2' })
  .withHash('latest')
  .withPrefix('/api/v1')
  .request({
    headers: { 'Authorization': 'Bearer token' },
    timeout: 5000
  })
  .successType<PostsResponse>()
  .failedType<ApiError>()
  .run()

// Type-safe request data
interface CreateUserData {
  name: string
  email: string
}

interface UserResponse {
  id: string
  name: string
  email: string
}

const result = await builder('users.store')
  .request()
  .successType<UserResponse>()
  .failedType<ValidationError>()
  .withData<CreateUserData>({
    name: 'John Doe',
    email: 'john@example.com'
  })
  .run()
```

#### Builder Methods

- **`withQs(qs)`** - Add query parameters
- **`withHash(hash)`** - Add hash fragment
- **`withPrefix(prefix)`** - Add route prefix
- **`route()`** - Get the Route instance
- **`request(config?)`** - Create RequestBuilder for HTTP requests
- **`successType<T>()`** - Define success response type
- **`failedType<T>()`** - Define error response type
- **`withData<T>(data)`** - Add request data (POST/PUT/PATCH)
- **`run()`** - Execute the HTTP request

#### Automatic CSRF Protection

The builder automatically includes CSRF tokens from cookies:

```javascript
// CSRF token is automatically added from XSRF-TOKEN cookie
const result = await builder('users.store').request().withData({ name: 'John' }).run()
```

#### HTTP Client Configuration

The builder uses a built-in HTTP client with automatic CSRF protection and error handling. You can configure it per request:

```javascript
// Request configuration options
const result = await builder('users.show', { id: '123' })
  .request({
    headers: { Authorization: 'Bearer token' },
    timeout: 5000,
    credentials: 'include',
  })
  .run()
```

**Available configuration options:**

- **`headers`** - Custom headers for the request
- **`timeout`** - Request timeout in milliseconds (default: 30000)
- **`credentials`** - Credentials policy (default: 'same-origin')

**Automatic Content-Type Detection:**

The HTTP client automatically detects the appropriate `Content-Type` header based on the request body:

```javascript
// FormData - no Content-Type set (browser handles boundary)
const formData = new FormData()
formData.append('file', fileInput.files[0])
await builder('upload').request().withData(formData).run()

// File - uses file.type or 'application/octet-stream'
const file = new File(['content'], 'test.txt', { type: 'text/plain' })
await builder('upload').request().withData(file).run()

// Blob - uses blob.type or 'application/octet-stream'
const blob = new Blob(['content'], { type: 'application/json' })
await builder('upload').request().withData(blob).run()

// ArrayBuffer - 'application/octet-stream'
const buffer = new ArrayBuffer(8)
await builder('upload').request().withData(buffer).run()

// String - 'text/plain' or 'application/json' (if valid JSON)
await builder('api').request().withData('{"key": "value"}').run() // JSON
await builder('api').request().withData('plain text').run() // text/plain

// Object - 'application/json' (automatically stringified)
await builder('api').request().withData({ name: 'John' }).run()
```

#### Global Error Handling

The builder includes global error handling for common HTTP status codes:

```javascript
// 401 errors are automatically handled
// CSRF tokens are automatically added from cookies
const result = await builder('protected.route').request().run()
// If 401, will log warning and reject promise
```

These features enable seamless integration of AdonisJs routing within your JavaScript applications, enhancing flexibility and maintainability. By leveraging `route()` and `builder`, you can easily manage and navigate your application routes with ease, ensuring a smooth user experience.

## Contributing

Thank you for being interested in making this package better. We encourage everyone to help improve this project with new features, bug fixes, or performance improvements. Please take a little bit of your time to read our guide to make this process faster and easier.

### Contribution Guidelines

To understand how to submit an issue, commit and create pull requests, check our [Contribution Guidelines](/.github/CONTRIBUTING.md).

### Code of Conduct

We expect you to follow our [Code of Conduct](/.github/CODE_OF_CONDUCT.md). You can read it to understand what kind of behavior will and will not be tolerated.

## License

MIT License © [IzzyJs](https://github.com/IzzyJs)

<div align="center">
  <sub>Built with ❤︎ by <a href="https://github.com/lncitador">Walaff Fernandes</a>
</div>
