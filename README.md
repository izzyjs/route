# @izzyjs/route

[![GitHub Actions Status](https://img.shields.io/github/actions/workflow/status/izzyjs/route/test.yml?branch=main&style=flat)](https://github.com/izzyjs/route/actions?query=workflow:Tests+branch:main)
[![Coverage Status](https://coveralls.io/repos/github/izzyjs/route/badge.svg?branch=main)](https://coveralls.io/github/izzyjs/route?branch=main)
[![GitHub issues](https://img.shields.io/github/issues/izzyjs/route)](https://img.shields.io/github/issues/izzyjs/route)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/izzyjs/route)](https://img.shields.io/github/issues-pr/izzyjs/route)
[![npm version](https://badge.fury.io/js/%40izzyjs%2Froute.svg)](https://badge.fury.io/js/%40izzyjs%2Froute)
[![License](https://img.shields.io/github/license/izzyjs/route)](https://img.shields.io/github/license/izzyjs/route)

**_Use your AdonisJs routes in JavaScript._**

This package provides a JavaScript `route()` function that can be used to generate URLs for named routes defined in an AdonisJs application.

## Installation

Install and configure the package using the following command :

```bash
node ace add @izzyjs/route
```

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
  hooks: {
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
    // rest of the file 
    @routes() // Add this line
    // rest of the file
  </head>

  <body>
    @inertia()
  </body>
</html>
```

## Usage

Now that we've followed all the steps, we're ready to use `route()` on the client side to generate URLs for named routes.

```javascript
import { route } from '@izzyjs/route/client'

const url = route('users.show', { id: '1' }) // /users/1
```

### Route

Is a callback class with a parameter for route(), with information about the method, partern and path itself.

```javascript
import { route } from '@izzyjs/route/client'

const url = route('users.show', { id: '1' }) // /users/1

url.method // GET
url.pattern // /users/:id
url.path // /users/1
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

These features enable seamless integration of AdonisJs routing within your JavaScript applications, enhancing flexibility and maintainability. By leveraging route(), you can easily manage and navigate your application routes with ease, ensuring a smooth user experience.

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
