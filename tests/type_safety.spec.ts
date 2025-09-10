import { test } from '@japa/runner'
import { expectTypeOf } from 'expect-type'
import type { Params, ExtractName, ExcludeName } from '../src/types/routes.js'
import type { RouteWithName, RouteWithParams } from '../src/client/routes.js'

test.group('Type Safety Tests', () => {
  test('should have correct types for routes with required parameters', () => {
    // Test for route with required parameters
    type SupportCategoryParams = Params<'blog.show'>

    // Should accept required parameter 'slug'
    expectTypeOf<SupportCategoryParams>().toEqualTypeOf<{
      slug: string | number
    }>()

    // Should reject incorrect parameters
    // @ts-expect-error - 'id' is not a valid parameter for this route
    const invalidParams: SupportCategoryParams = { id: '123' }

    // Should accept correct parameters
    const validParams: SupportCategoryParams = { slug: 'my-category' }
    expectTypeOf(validParams).toEqualTypeOf<{ slug: string | number }>()
  })

  test('should have correct types for routes with optional parameters', () => {
    // Test for route with optional parameters (like the 'teste' route)
    type TesteParams = Params<'teste'>

    // Should accept optional parameter 'message'
    expectTypeOf<TesteParams>().toEqualTypeOf<{
      message?: string | number
    }>()

    // Should accept empty object (no parameters)
    const emptyParams: TesteParams = {}
    expectTypeOf(emptyParams).toMatchObjectType<{}>()

    // Should accept optional parameter when provided
    const withParams: TesteParams = { message: 'hello' }
    expectTypeOf(withParams).toEqualTypeOf<{ message?: string | number }>()
  })

  test('should have correct types for routes without parameters', () => {
    // Test for routes without parameters - these routes are not in ExtractName
    // so we can't use Params<> directly, but we can test that
    // they are in ExcludeName
    type TestExcludeName = ExcludeName

    // Should include routes without parameters
    expectTypeOf<'support.index'>().toExtend<TestExcludeName>()
    expectTypeOf<'admin.support.teams'>().toExtend<TestExcludeName>()
  })

  test('should have correct types for ExtractName', () => {
    // ExtractName should include only routes with parameters
    type TestExtractName = ExtractName

    // Should include some known routes with parameters
    expectTypeOf<'support.category'>().toExtend<TestExtractName>()
    expectTypeOf<'teste'>().toExtend<TestExtractName>()
    expectTypeOf<'admin.support.ticket'>().toExtend<TestExtractName>()
  })

  test('should have correct types for ExcludeName', () => {
    // ExcludeName should include only routes without parameters
    type TestExcludeName = ExcludeName

    // Should include some known routes without parameters
    expectTypeOf<'support.index'>().toExtend<TestExcludeName>()
    expectTypeOf<'admin.support.teams'>().toExtend<TestExcludeName>()
  })

  test('should correctly distinguish between routes with and without parameters', () => {
    // Test to verify that the system correctly distinguishes between routes with and without parameters

    // Routes with parameters should be in ExtractName
    type RoutesWithParams = Extract<RouteWithName, RouteWithParams>['name']
    expectTypeOf<'support.category'>().toExtend<RoutesWithParams>()
    expectTypeOf<'teste'>().toExtend<RoutesWithParams>()

    // Routes without parameters should not be in RouteWithParams
    type RoutesWithoutParams = Exclude<RouteWithName, RouteWithParams>['name']
    expectTypeOf<'support.index'>().toExtend<RoutesWithoutParams>()
    expectTypeOf<'admin.support.teams'>().toExtend<RoutesWithoutParams>()
  })

  test('should handle complex parameter combinations', () => {
    // Test to verify that types work with complex parameter combinations

    // Route with mixed required and optional parameters
    type ComplexRouteParams = Params<'admin.support.ticket.message'>

    // Should accept only required parameters
    expectTypeOf<ComplexRouteParams>().toEqualTypeOf<{
      id: string | number
    }>()

    // Should reject incorrect parameters
    // @ts-expect-error - 'slug' is not a valid parameter for this route
    const invalidComplexParams: ComplexRouteParams = { slug: 'test' }
  })

  test('should provide proper type inference for route function', () => {
    // Test to verify that the route() function has correct type inference

    // For routes with parameters, should require the params object
    type RouteWithParamsCall = typeof import('../src/client/index.js').route
    expectTypeOf<RouteWithParamsCall>().toMatchTypeOf<
      <Name extends ExtractName>(
        routeName: Name,
        options: {
          params: Params<Name>
          qs?: Record<string, any>
          prefix?: string
          hash?: string
        }
      ) => any
    >()

    // For routes without parameters, params should be optional
    expectTypeOf<RouteWithParamsCall>().toMatchTypeOf<
      <Name extends ExcludeName>(
        routeName: Name,
        options?: {
          params?: never
          qs?: Record<string, any>
          prefix?: string
          hash?: string
        }
      ) => any
    >()
  })

  test('should handle edge cases with type safety', () => {
    // Test for edge cases of type safety

    // Parameters should accept string or number
    type StringOrNumberParams = Params<'support.category'>
    const stringParam: StringOrNumberParams = { slug: 'string-value' }
    const numberParam: StringOrNumberParams = { slug: 123 }

    expectTypeOf(stringParam).toEqualTypeOf<{ slug: string | number }>()
    expectTypeOf(numberParam).toEqualTypeOf<{ slug: string | number }>()

    // Should reject incorrect types
    // @ts-expect-error - boolean is not a valid type for parameters
    const invalidTypeParam: StringOrNumberParams = { slug: true }
  })

  test('should maintain type safety across different route domains', () => {
    // Test to verify that type safety works across different domains

    // Route from 'suporte.localhost' domain
    type SupportRouteParams = Params<'support.article'>
    expectTypeOf<SupportRouteParams>().toEqualTypeOf<{
      slug: string | number
    }>()

    // Route from 'admin.localhost' domain
    type AdminRouteParams = Params<'admin.support.ticket'>
    expectTypeOf<AdminRouteParams>().toEqualTypeOf<{
      id: string | number
    }>()

    // Route from 'root' domain
    type RootRouteParams = Params<'teste'>
    expectTypeOf<RootRouteParams>().toEqualTypeOf<{
      message?: string | number
    }>()
  })
})
