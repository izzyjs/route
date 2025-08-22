/**
 * Exemplo de uso da funcionalidade de URLs completas
 *
 * Quando você configura baseUrl na configuração, as rotas automaticamente
 * geram URLs completas com protocolo + domínio + path
 */

// Exemplo 1: Configuração básica
// config/izzyjs.ts
// export default defineConfig({
//   baseUrl: 'https://meuapp.com',
//   routes: { ... }
// })

// Exemplo 2: Uso das rotas
export function exemploUsoRotas() {
  // Rota simples - retorna apenas o path
  // const homeRoute = route('home')
  // console.log(homeRoute.path)        // "/"
  // console.log(homeRoute.url)         // "https://meuapp.com/"
  // Rota com parâmetros
  // const userRoute = route('users.show', { params: { id: '123' } })
  // console.log(userRoute.path)        // "/users/123"
  // console.log(userRoute.url)         // "https://meuapp.com/users/123"
  // Rota com query string
  // const postsRoute = route('posts.index', {
  //   qs: { page: '2', category: 'tech' }
  // })
  // console.log(postsRoute.path)        // "/posts?page=2&category=tech"
  // console.log(postsRoute.url)         // "https://meuapp.com/posts?page=2&category=tech"
  // Rota com prefixo
  // const apiRoute = route('api.v1.users.index', { prefix: '/v1' })
  // console.log(apiRoute.path)        // "/v1/api/v1/users"
  // console.log(apiRoute.url)         // "https://meuapp.com/v1/api/v1/users"
}

// Exemplo 3: Diferentes tipos de baseUrl
export function exemplosDiferentesBaseUrls() {
  // Com HTTPS
  // baseUrl: 'https://api.meuapp.com'
  // route('users.index').url => "https://api.meuapp.com/users"
  // Com HTTP (desenvolvimento)
  // baseUrl: 'http://localhost:3333'
  // route('users.index').url => "http://localhost:3333/users"
  // Com subdomínio
  // baseUrl: 'https://admin.meuapp.com'
  // route('dashboard').url => "https://admin.meuapp.com/dashboard"
  // Com porta
  // baseUrl: 'http://localhost:8080'
  // route('home').url => "http://localhost:8080/"
}

// Exemplo 3.1: Diferentes domains nas rotas
export function exemplosDiferentesDomains() {
  // Quando você tem rotas com domains diferentes de 'root'
  // O sistema usa o domain específico da rota em vez do baseUrl.host
  // Rota com domain 'root' (usa baseUrl.host)
  // route('home').url => "https://example.com/"
  // Rota com domain específico 'api.example.com'
  // route('api.users.index').url => "https://api.example.com/users"
  // Rota com domain específico 'admin.example.com'
  // route('admin.dashboard').url => "https://admin.example.com/dashboard"
  // Rota com domain específico 'cdn.example.com'
  // route('cdn.assets').url => "https://cdn.example.com/assets"
}

// Exemplo 4: Uso em diferentes contextos
export function exemplosContextos() {
  // Em componentes React/Vue
  // const link = route('posts.show', { params: { id: '456' } }).url
  // Resultado: "https://meuapp.com/posts/456"
  // Em emails
  // const emailLink = route('password.reset', {
  //   params: { token: 'abc123' }
  // }).url
  // Resultado: "https://meuapp.com/password/reset/abc123"
  // Em APIs externas
  // const webhookUrl = route('webhook.stripe').url
  // Resultado: "https://meuapp.com/webhook/stripe"
  // Em notificações push
  // const notificationUrl = route('notifications.show', {
  //   params: { id: '789' }
  // }).url
  // Resultado: "https://meuapp.com/notifications/789"
}

// Exemplo 5: Fallback para configuração inválida
export function exemploFallback() {
  // Se baseUrl for inválido ou não configurado
  // route('home').url retorna apenas o path "/"
  // Se baseUrl for "invalid-url"
  // route('home').url retorna apenas o path "/" (com warning no console)
  // Se baseUrl for undefined
  // route('home').url retorna apenas o path "/"
}

// Exemplo 6: Uso em testes
export function exemplosTestes() {
  // Em testes, você pode configurar diferentes baseUrls
  // para diferentes ambientes
  // Teste local
  // baseUrl: 'http://localhost:3333'
  // Teste de staging
  // baseUrl: 'https://staging.meuapp.com'
  // Teste de produção
  // baseUrl: 'https://meuapp.com'
}

// Exemplo 7: Integração com outras bibliotecas
export function exemplosIntegracao() {
  // Com Axios para requisições HTTP
  // const apiUrl = route('api.v1.users.index').url
  // axios.get(apiUrl)
  // Com fetch API
  // const response = await fetch(route('api.v1.users.index').url)
  // Com window.open para abrir em nova aba
  // window.open(route('posts.show', { params: { id: '123' } }).url)
  // Com window.location para redirecionamento
  // window.location.href = route('dashboard').url
}
