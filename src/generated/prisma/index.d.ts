
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model StyleProfile
 * 
 */
export type StyleProfile = $Result.DefaultSelection<Prisma.$StyleProfilePayload>
/**
 * Model Audience
 * 
 */
export type Audience = $Result.DefaultSelection<Prisma.$AudiencePayload>
/**
 * Model Outline
 * 
 */
export type Outline = $Result.DefaultSelection<Prisma.$OutlinePayload>
/**
 * Model OutlineAudience
 * 
 */
export type OutlineAudience = $Result.DefaultSelection<Prisma.$OutlineAudiencePayload>
/**
 * Model Article
 * 
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more StyleProfiles
 * const styleProfiles = await prisma.styleProfile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more StyleProfiles
   * const styleProfiles = await prisma.styleProfile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.styleProfile`: Exposes CRUD operations for the **StyleProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StyleProfiles
    * const styleProfiles = await prisma.styleProfile.findMany()
    * ```
    */
  get styleProfile(): Prisma.StyleProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.audience`: Exposes CRUD operations for the **Audience** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Audiences
    * const audiences = await prisma.audience.findMany()
    * ```
    */
  get audience(): Prisma.AudienceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.outline`: Exposes CRUD operations for the **Outline** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Outlines
    * const outlines = await prisma.outline.findMany()
    * ```
    */
  get outline(): Prisma.OutlineDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.outlineAudience`: Exposes CRUD operations for the **OutlineAudience** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OutlineAudiences
    * const outlineAudiences = await prisma.outlineAudience.findMany()
    * ```
    */
  get outlineAudience(): Prisma.OutlineAudienceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends bigint
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    StyleProfile: 'StyleProfile',
    Audience: 'Audience',
    Outline: 'Outline',
    OutlineAudience: 'OutlineAudience',
    Article: 'Article'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "styleProfile" | "audience" | "outline" | "outlineAudience" | "article"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      StyleProfile: {
        payload: Prisma.$StyleProfilePayload<ExtArgs>
        fields: Prisma.StyleProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StyleProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StyleProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>
          }
          findFirst: {
            args: Prisma.StyleProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StyleProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>
          }
          findMany: {
            args: Prisma.StyleProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>[]
          }
          create: {
            args: Prisma.StyleProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>
          }
          createMany: {
            args: Prisma.StyleProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StyleProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>[]
          }
          delete: {
            args: Prisma.StyleProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>
          }
          update: {
            args: Prisma.StyleProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>
          }
          deleteMany: {
            args: Prisma.StyleProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StyleProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StyleProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>[]
          }
          upsert: {
            args: Prisma.StyleProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StyleProfilePayload>
          }
          aggregate: {
            args: Prisma.StyleProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStyleProfile>
          }
          groupBy: {
            args: Prisma.StyleProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<StyleProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.StyleProfileCountArgs<ExtArgs>
            result: $Utils.Optional<StyleProfileCountAggregateOutputType> | number
          }
        }
      }
      Audience: {
        payload: Prisma.$AudiencePayload<ExtArgs>
        fields: Prisma.AudienceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AudienceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AudienceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>
          }
          findFirst: {
            args: Prisma.AudienceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AudienceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>
          }
          findMany: {
            args: Prisma.AudienceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>[]
          }
          create: {
            args: Prisma.AudienceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>
          }
          createMany: {
            args: Prisma.AudienceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AudienceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>[]
          }
          delete: {
            args: Prisma.AudienceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>
          }
          update: {
            args: Prisma.AudienceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>
          }
          deleteMany: {
            args: Prisma.AudienceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AudienceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AudienceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>[]
          }
          upsert: {
            args: Prisma.AudienceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudiencePayload>
          }
          aggregate: {
            args: Prisma.AudienceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAudience>
          }
          groupBy: {
            args: Prisma.AudienceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AudienceGroupByOutputType>[]
          }
          count: {
            args: Prisma.AudienceCountArgs<ExtArgs>
            result: $Utils.Optional<AudienceCountAggregateOutputType> | number
          }
        }
      }
      Outline: {
        payload: Prisma.$OutlinePayload<ExtArgs>
        fields: Prisma.OutlineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OutlineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OutlineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>
          }
          findFirst: {
            args: Prisma.OutlineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OutlineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>
          }
          findMany: {
            args: Prisma.OutlineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>[]
          }
          create: {
            args: Prisma.OutlineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>
          }
          createMany: {
            args: Prisma.OutlineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OutlineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>[]
          }
          delete: {
            args: Prisma.OutlineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>
          }
          update: {
            args: Prisma.OutlineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>
          }
          deleteMany: {
            args: Prisma.OutlineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OutlineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OutlineUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>[]
          }
          upsert: {
            args: Prisma.OutlineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlinePayload>
          }
          aggregate: {
            args: Prisma.OutlineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOutline>
          }
          groupBy: {
            args: Prisma.OutlineGroupByArgs<ExtArgs>
            result: $Utils.Optional<OutlineGroupByOutputType>[]
          }
          count: {
            args: Prisma.OutlineCountArgs<ExtArgs>
            result: $Utils.Optional<OutlineCountAggregateOutputType> | number
          }
        }
      }
      OutlineAudience: {
        payload: Prisma.$OutlineAudiencePayload<ExtArgs>
        fields: Prisma.OutlineAudienceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OutlineAudienceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OutlineAudienceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>
          }
          findFirst: {
            args: Prisma.OutlineAudienceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OutlineAudienceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>
          }
          findMany: {
            args: Prisma.OutlineAudienceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>[]
          }
          create: {
            args: Prisma.OutlineAudienceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>
          }
          createMany: {
            args: Prisma.OutlineAudienceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OutlineAudienceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>[]
          }
          delete: {
            args: Prisma.OutlineAudienceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>
          }
          update: {
            args: Prisma.OutlineAudienceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>
          }
          deleteMany: {
            args: Prisma.OutlineAudienceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OutlineAudienceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OutlineAudienceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>[]
          }
          upsert: {
            args: Prisma.OutlineAudienceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OutlineAudiencePayload>
          }
          aggregate: {
            args: Prisma.OutlineAudienceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOutlineAudience>
          }
          groupBy: {
            args: Prisma.OutlineAudienceGroupByArgs<ExtArgs>
            result: $Utils.Optional<OutlineAudienceGroupByOutputType>[]
          }
          count: {
            args: Prisma.OutlineAudienceCountArgs<ExtArgs>
            result: $Utils.Optional<OutlineAudienceCountAggregateOutputType> | number
          }
        }
      }
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    styleProfile?: StyleProfileOmit
    audience?: AudienceOmit
    outline?: OutlineOmit
    outlineAudience?: OutlineAudienceOmit
    article?: ArticleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type StyleProfileCountOutputType
   */

  export type StyleProfileCountOutputType = {
    outlines: number
    articles: number
  }

  export type StyleProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outlines?: boolean | StyleProfileCountOutputTypeCountOutlinesArgs
    articles?: boolean | StyleProfileCountOutputTypeCountArticlesArgs
  }

  // Custom InputTypes
  /**
   * StyleProfileCountOutputType without action
   */
  export type StyleProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfileCountOutputType
     */
    select?: StyleProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StyleProfileCountOutputType without action
   */
  export type StyleProfileCountOutputTypeCountOutlinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OutlineWhereInput
  }

  /**
   * StyleProfileCountOutputType without action
   */
  export type StyleProfileCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }


  /**
   * Count Type AudienceCountOutputType
   */

  export type AudienceCountOutputType = {
    outlineAudiences: number
  }

  export type AudienceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outlineAudiences?: boolean | AudienceCountOutputTypeCountOutlineAudiencesArgs
  }

  // Custom InputTypes
  /**
   * AudienceCountOutputType without action
   */
  export type AudienceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceCountOutputType
     */
    select?: AudienceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AudienceCountOutputType without action
   */
  export type AudienceCountOutputTypeCountOutlineAudiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OutlineAudienceWhereInput
  }


  /**
   * Count Type OutlineCountOutputType
   */

  export type OutlineCountOutputType = {
    outlineAudiences: number
    articles: number
  }

  export type OutlineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outlineAudiences?: boolean | OutlineCountOutputTypeCountOutlineAudiencesArgs
    articles?: boolean | OutlineCountOutputTypeCountArticlesArgs
  }

  // Custom InputTypes
  /**
   * OutlineCountOutputType without action
   */
  export type OutlineCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineCountOutputType
     */
    select?: OutlineCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OutlineCountOutputType without action
   */
  export type OutlineCountOutputTypeCountOutlineAudiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OutlineAudienceWhereInput
  }

  /**
   * OutlineCountOutputType without action
   */
  export type OutlineCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model StyleProfile
   */

  export type AggregateStyleProfile = {
    _count: StyleProfileCountAggregateOutputType | null
    _min: StyleProfileMinAggregateOutputType | null
    _max: StyleProfileMaxAggregateOutputType | null
  }

  export type StyleProfileMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    sampleText: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StyleProfileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    sampleText: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StyleProfileCountAggregateOutputType = {
    id: number
    name: number
    description: number
    authorInfo: number
    styleFeatures: number
    sampleText: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StyleProfileMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    sampleText?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StyleProfileMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    sampleText?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StyleProfileCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorInfo?: true
    styleFeatures?: true
    sampleText?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StyleProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StyleProfile to aggregate.
     */
    where?: StyleProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StyleProfiles to fetch.
     */
    orderBy?: StyleProfileOrderByWithRelationInput | StyleProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StyleProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StyleProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StyleProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StyleProfiles
    **/
    _count?: true | StyleProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StyleProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StyleProfileMaxAggregateInputType
  }

  export type GetStyleProfileAggregateType<T extends StyleProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateStyleProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStyleProfile[P]>
      : GetScalarType<T[P], AggregateStyleProfile[P]>
  }




  export type StyleProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StyleProfileWhereInput
    orderBy?: StyleProfileOrderByWithAggregationInput | StyleProfileOrderByWithAggregationInput[]
    by: StyleProfileScalarFieldEnum[] | StyleProfileScalarFieldEnum
    having?: StyleProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StyleProfileCountAggregateInputType | true
    _min?: StyleProfileMinAggregateInputType
    _max?: StyleProfileMaxAggregateInputType
  }

  export type StyleProfileGroupByOutputType = {
    id: string
    name: string
    description: string | null
    authorInfo: JsonValue | null
    styleFeatures: JsonValue | null
    sampleText: string | null
    createdAt: Date
    updatedAt: Date
    _count: StyleProfileCountAggregateOutputType | null
    _min: StyleProfileMinAggregateOutputType | null
    _max: StyleProfileMaxAggregateOutputType | null
  }

  type GetStyleProfileGroupByPayload<T extends StyleProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StyleProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StyleProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StyleProfileGroupByOutputType[P]>
            : GetScalarType<T[P], StyleProfileGroupByOutputType[P]>
        }
      >
    >


  export type StyleProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorInfo?: boolean
    styleFeatures?: boolean
    sampleText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    outlines?: boolean | StyleProfile$outlinesArgs<ExtArgs>
    articles?: boolean | StyleProfile$articlesArgs<ExtArgs>
    _count?: boolean | StyleProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["styleProfile"]>

  export type StyleProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorInfo?: boolean
    styleFeatures?: boolean
    sampleText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["styleProfile"]>

  export type StyleProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorInfo?: boolean
    styleFeatures?: boolean
    sampleText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["styleProfile"]>

  export type StyleProfileSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    authorInfo?: boolean
    styleFeatures?: boolean
    sampleText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StyleProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "authorInfo" | "styleFeatures" | "sampleText" | "createdAt" | "updatedAt", ExtArgs["result"]["styleProfile"]>
  export type StyleProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outlines?: boolean | StyleProfile$outlinesArgs<ExtArgs>
    articles?: boolean | StyleProfile$articlesArgs<ExtArgs>
    _count?: boolean | StyleProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StyleProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StyleProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StyleProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StyleProfile"
    objects: {
      outlines: Prisma.$OutlinePayload<ExtArgs>[]
      articles: Prisma.$ArticlePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      authorInfo: Prisma.JsonValue | null
      styleFeatures: Prisma.JsonValue | null
      sampleText: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["styleProfile"]>
    composites: {}
  }

  type StyleProfileGetPayload<S extends boolean | null | undefined | StyleProfileDefaultArgs> = $Result.GetResult<Prisma.$StyleProfilePayload, S>

  type StyleProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StyleProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StyleProfileCountAggregateInputType | true
    }

  export interface StyleProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StyleProfile'], meta: { name: 'StyleProfile' } }
    /**
     * Find zero or one StyleProfile that matches the filter.
     * @param {StyleProfileFindUniqueArgs} args - Arguments to find a StyleProfile
     * @example
     * // Get one StyleProfile
     * const styleProfile = await prisma.styleProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StyleProfileFindUniqueArgs>(args: SelectSubset<T, StyleProfileFindUniqueArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StyleProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StyleProfileFindUniqueOrThrowArgs} args - Arguments to find a StyleProfile
     * @example
     * // Get one StyleProfile
     * const styleProfile = await prisma.styleProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StyleProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, StyleProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StyleProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileFindFirstArgs} args - Arguments to find a StyleProfile
     * @example
     * // Get one StyleProfile
     * const styleProfile = await prisma.styleProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StyleProfileFindFirstArgs>(args?: SelectSubset<T, StyleProfileFindFirstArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StyleProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileFindFirstOrThrowArgs} args - Arguments to find a StyleProfile
     * @example
     * // Get one StyleProfile
     * const styleProfile = await prisma.styleProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StyleProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, StyleProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StyleProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StyleProfiles
     * const styleProfiles = await prisma.styleProfile.findMany()
     * 
     * // Get first 10 StyleProfiles
     * const styleProfiles = await prisma.styleProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const styleProfileWithIdOnly = await prisma.styleProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StyleProfileFindManyArgs>(args?: SelectSubset<T, StyleProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StyleProfile.
     * @param {StyleProfileCreateArgs} args - Arguments to create a StyleProfile.
     * @example
     * // Create one StyleProfile
     * const StyleProfile = await prisma.styleProfile.create({
     *   data: {
     *     // ... data to create a StyleProfile
     *   }
     * })
     * 
     */
    create<T extends StyleProfileCreateArgs>(args: SelectSubset<T, StyleProfileCreateArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StyleProfiles.
     * @param {StyleProfileCreateManyArgs} args - Arguments to create many StyleProfiles.
     * @example
     * // Create many StyleProfiles
     * const styleProfile = await prisma.styleProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StyleProfileCreateManyArgs>(args?: SelectSubset<T, StyleProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StyleProfiles and returns the data saved in the database.
     * @param {StyleProfileCreateManyAndReturnArgs} args - Arguments to create many StyleProfiles.
     * @example
     * // Create many StyleProfiles
     * const styleProfile = await prisma.styleProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StyleProfiles and only return the `id`
     * const styleProfileWithIdOnly = await prisma.styleProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StyleProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, StyleProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StyleProfile.
     * @param {StyleProfileDeleteArgs} args - Arguments to delete one StyleProfile.
     * @example
     * // Delete one StyleProfile
     * const StyleProfile = await prisma.styleProfile.delete({
     *   where: {
     *     // ... filter to delete one StyleProfile
     *   }
     * })
     * 
     */
    delete<T extends StyleProfileDeleteArgs>(args: SelectSubset<T, StyleProfileDeleteArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StyleProfile.
     * @param {StyleProfileUpdateArgs} args - Arguments to update one StyleProfile.
     * @example
     * // Update one StyleProfile
     * const styleProfile = await prisma.styleProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StyleProfileUpdateArgs>(args: SelectSubset<T, StyleProfileUpdateArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StyleProfiles.
     * @param {StyleProfileDeleteManyArgs} args - Arguments to filter StyleProfiles to delete.
     * @example
     * // Delete a few StyleProfiles
     * const { count } = await prisma.styleProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StyleProfileDeleteManyArgs>(args?: SelectSubset<T, StyleProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StyleProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StyleProfiles
     * const styleProfile = await prisma.styleProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StyleProfileUpdateManyArgs>(args: SelectSubset<T, StyleProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StyleProfiles and returns the data updated in the database.
     * @param {StyleProfileUpdateManyAndReturnArgs} args - Arguments to update many StyleProfiles.
     * @example
     * // Update many StyleProfiles
     * const styleProfile = await prisma.styleProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StyleProfiles and only return the `id`
     * const styleProfileWithIdOnly = await prisma.styleProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StyleProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, StyleProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StyleProfile.
     * @param {StyleProfileUpsertArgs} args - Arguments to update or create a StyleProfile.
     * @example
     * // Update or create a StyleProfile
     * const styleProfile = await prisma.styleProfile.upsert({
     *   create: {
     *     // ... data to create a StyleProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StyleProfile we want to update
     *   }
     * })
     */
    upsert<T extends StyleProfileUpsertArgs>(args: SelectSubset<T, StyleProfileUpsertArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StyleProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileCountArgs} args - Arguments to filter StyleProfiles to count.
     * @example
     * // Count the number of StyleProfiles
     * const count = await prisma.styleProfile.count({
     *   where: {
     *     // ... the filter for the StyleProfiles we want to count
     *   }
     * })
    **/
    count<T extends StyleProfileCountArgs>(
      args?: Subset<T, StyleProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StyleProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StyleProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StyleProfileAggregateArgs>(args: Subset<T, StyleProfileAggregateArgs>): Prisma.PrismaPromise<GetStyleProfileAggregateType<T>>

    /**
     * Group by StyleProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StyleProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StyleProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StyleProfileGroupByArgs['orderBy'] }
        : { orderBy?: StyleProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StyleProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStyleProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StyleProfile model
   */
  readonly fields: StyleProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StyleProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StyleProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    outlines<T extends StyleProfile$outlinesArgs<ExtArgs> = {}>(args?: Subset<T, StyleProfile$outlinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    articles<T extends StyleProfile$articlesArgs<ExtArgs> = {}>(args?: Subset<T, StyleProfile$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StyleProfile model
   */
  interface StyleProfileFieldRefs {
    readonly id: FieldRef<"StyleProfile", 'String'>
    readonly name: FieldRef<"StyleProfile", 'String'>
    readonly description: FieldRef<"StyleProfile", 'String'>
    readonly authorInfo: FieldRef<"StyleProfile", 'Json'>
    readonly styleFeatures: FieldRef<"StyleProfile", 'Json'>
    readonly sampleText: FieldRef<"StyleProfile", 'String'>
    readonly createdAt: FieldRef<"StyleProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"StyleProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StyleProfile findUnique
   */
  export type StyleProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * Filter, which StyleProfile to fetch.
     */
    where: StyleProfileWhereUniqueInput
  }

  /**
   * StyleProfile findUniqueOrThrow
   */
  export type StyleProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * Filter, which StyleProfile to fetch.
     */
    where: StyleProfileWhereUniqueInput
  }

  /**
   * StyleProfile findFirst
   */
  export type StyleProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * Filter, which StyleProfile to fetch.
     */
    where?: StyleProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StyleProfiles to fetch.
     */
    orderBy?: StyleProfileOrderByWithRelationInput | StyleProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StyleProfiles.
     */
    cursor?: StyleProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StyleProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StyleProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StyleProfiles.
     */
    distinct?: StyleProfileScalarFieldEnum | StyleProfileScalarFieldEnum[]
  }

  /**
   * StyleProfile findFirstOrThrow
   */
  export type StyleProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * Filter, which StyleProfile to fetch.
     */
    where?: StyleProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StyleProfiles to fetch.
     */
    orderBy?: StyleProfileOrderByWithRelationInput | StyleProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StyleProfiles.
     */
    cursor?: StyleProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StyleProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StyleProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StyleProfiles.
     */
    distinct?: StyleProfileScalarFieldEnum | StyleProfileScalarFieldEnum[]
  }

  /**
   * StyleProfile findMany
   */
  export type StyleProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * Filter, which StyleProfiles to fetch.
     */
    where?: StyleProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StyleProfiles to fetch.
     */
    orderBy?: StyleProfileOrderByWithRelationInput | StyleProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StyleProfiles.
     */
    cursor?: StyleProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StyleProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StyleProfiles.
     */
    skip?: number
    distinct?: StyleProfileScalarFieldEnum | StyleProfileScalarFieldEnum[]
  }

  /**
   * StyleProfile create
   */
  export type StyleProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a StyleProfile.
     */
    data: XOR<StyleProfileCreateInput, StyleProfileUncheckedCreateInput>
  }

  /**
   * StyleProfile createMany
   */
  export type StyleProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StyleProfiles.
     */
    data: StyleProfileCreateManyInput | StyleProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StyleProfile createManyAndReturn
   */
  export type StyleProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * The data used to create many StyleProfiles.
     */
    data: StyleProfileCreateManyInput | StyleProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StyleProfile update
   */
  export type StyleProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a StyleProfile.
     */
    data: XOR<StyleProfileUpdateInput, StyleProfileUncheckedUpdateInput>
    /**
     * Choose, which StyleProfile to update.
     */
    where: StyleProfileWhereUniqueInput
  }

  /**
   * StyleProfile updateMany
   */
  export type StyleProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StyleProfiles.
     */
    data: XOR<StyleProfileUpdateManyMutationInput, StyleProfileUncheckedUpdateManyInput>
    /**
     * Filter which StyleProfiles to update
     */
    where?: StyleProfileWhereInput
    /**
     * Limit how many StyleProfiles to update.
     */
    limit?: number
  }

  /**
   * StyleProfile updateManyAndReturn
   */
  export type StyleProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * The data used to update StyleProfiles.
     */
    data: XOR<StyleProfileUpdateManyMutationInput, StyleProfileUncheckedUpdateManyInput>
    /**
     * Filter which StyleProfiles to update
     */
    where?: StyleProfileWhereInput
    /**
     * Limit how many StyleProfiles to update.
     */
    limit?: number
  }

  /**
   * StyleProfile upsert
   */
  export type StyleProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the StyleProfile to update in case it exists.
     */
    where: StyleProfileWhereUniqueInput
    /**
     * In case the StyleProfile found by the `where` argument doesn't exist, create a new StyleProfile with this data.
     */
    create: XOR<StyleProfileCreateInput, StyleProfileUncheckedCreateInput>
    /**
     * In case the StyleProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StyleProfileUpdateInput, StyleProfileUncheckedUpdateInput>
  }

  /**
   * StyleProfile delete
   */
  export type StyleProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    /**
     * Filter which StyleProfile to delete.
     */
    where: StyleProfileWhereUniqueInput
  }

  /**
   * StyleProfile deleteMany
   */
  export type StyleProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StyleProfiles to delete
     */
    where?: StyleProfileWhereInput
    /**
     * Limit how many StyleProfiles to delete.
     */
    limit?: number
  }

  /**
   * StyleProfile.outlines
   */
  export type StyleProfile$outlinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    where?: OutlineWhereInput
    orderBy?: OutlineOrderByWithRelationInput | OutlineOrderByWithRelationInput[]
    cursor?: OutlineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OutlineScalarFieldEnum | OutlineScalarFieldEnum[]
  }

  /**
   * StyleProfile.articles
   */
  export type StyleProfile$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * StyleProfile without action
   */
  export type StyleProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
  }


  /**
   * Model Audience
   */

  export type AggregateAudience = {
    _count: AudienceCountAggregateOutputType | null
    _min: AudienceMinAggregateOutputType | null
    _max: AudienceMaxAggregateOutputType | null
  }

  export type AudienceMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AudienceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AudienceCountAggregateOutputType = {
    id: number
    name: number
    description: number
    type: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AudienceMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AudienceMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AudienceCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AudienceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Audience to aggregate.
     */
    where?: AudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Audiences to fetch.
     */
    orderBy?: AudienceOrderByWithRelationInput | AudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Audiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Audiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Audiences
    **/
    _count?: true | AudienceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AudienceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AudienceMaxAggregateInputType
  }

  export type GetAudienceAggregateType<T extends AudienceAggregateArgs> = {
        [P in keyof T & keyof AggregateAudience]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAudience[P]>
      : GetScalarType<T[P], AggregateAudience[P]>
  }




  export type AudienceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AudienceWhereInput
    orderBy?: AudienceOrderByWithAggregationInput | AudienceOrderByWithAggregationInput[]
    by: AudienceScalarFieldEnum[] | AudienceScalarFieldEnum
    having?: AudienceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AudienceCountAggregateInputType | true
    _min?: AudienceMinAggregateInputType
    _max?: AudienceMaxAggregateInputType
  }

  export type AudienceGroupByOutputType = {
    id: string
    name: string
    description: string | null
    type: string | null
    createdAt: Date
    updatedAt: Date
    _count: AudienceCountAggregateOutputType | null
    _min: AudienceMinAggregateOutputType | null
    _max: AudienceMaxAggregateOutputType | null
  }

  type GetAudienceGroupByPayload<T extends AudienceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AudienceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AudienceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AudienceGroupByOutputType[P]>
            : GetScalarType<T[P], AudienceGroupByOutputType[P]>
        }
      >
    >


  export type AudienceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    outlineAudiences?: boolean | Audience$outlineAudiencesArgs<ExtArgs>
    _count?: boolean | AudienceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["audience"]>

  export type AudienceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["audience"]>

  export type AudienceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["audience"]>

  export type AudienceSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AudienceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "type" | "createdAt" | "updatedAt", ExtArgs["result"]["audience"]>
  export type AudienceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outlineAudiences?: boolean | Audience$outlineAudiencesArgs<ExtArgs>
    _count?: boolean | AudienceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AudienceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AudienceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AudiencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Audience"
    objects: {
      outlineAudiences: Prisma.$OutlineAudiencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      type: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["audience"]>
    composites: {}
  }

  type AudienceGetPayload<S extends boolean | null | undefined | AudienceDefaultArgs> = $Result.GetResult<Prisma.$AudiencePayload, S>

  type AudienceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AudienceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AudienceCountAggregateInputType | true
    }

  export interface AudienceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Audience'], meta: { name: 'Audience' } }
    /**
     * Find zero or one Audience that matches the filter.
     * @param {AudienceFindUniqueArgs} args - Arguments to find a Audience
     * @example
     * // Get one Audience
     * const audience = await prisma.audience.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AudienceFindUniqueArgs>(args: SelectSubset<T, AudienceFindUniqueArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Audience that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AudienceFindUniqueOrThrowArgs} args - Arguments to find a Audience
     * @example
     * // Get one Audience
     * const audience = await prisma.audience.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AudienceFindUniqueOrThrowArgs>(args: SelectSubset<T, AudienceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audience that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceFindFirstArgs} args - Arguments to find a Audience
     * @example
     * // Get one Audience
     * const audience = await prisma.audience.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AudienceFindFirstArgs>(args?: SelectSubset<T, AudienceFindFirstArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audience that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceFindFirstOrThrowArgs} args - Arguments to find a Audience
     * @example
     * // Get one Audience
     * const audience = await prisma.audience.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AudienceFindFirstOrThrowArgs>(args?: SelectSubset<T, AudienceFindFirstOrThrowArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Audiences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Audiences
     * const audiences = await prisma.audience.findMany()
     * 
     * // Get first 10 Audiences
     * const audiences = await prisma.audience.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const audienceWithIdOnly = await prisma.audience.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AudienceFindManyArgs>(args?: SelectSubset<T, AudienceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Audience.
     * @param {AudienceCreateArgs} args - Arguments to create a Audience.
     * @example
     * // Create one Audience
     * const Audience = await prisma.audience.create({
     *   data: {
     *     // ... data to create a Audience
     *   }
     * })
     * 
     */
    create<T extends AudienceCreateArgs>(args: SelectSubset<T, AudienceCreateArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Audiences.
     * @param {AudienceCreateManyArgs} args - Arguments to create many Audiences.
     * @example
     * // Create many Audiences
     * const audience = await prisma.audience.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AudienceCreateManyArgs>(args?: SelectSubset<T, AudienceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Audiences and returns the data saved in the database.
     * @param {AudienceCreateManyAndReturnArgs} args - Arguments to create many Audiences.
     * @example
     * // Create many Audiences
     * const audience = await prisma.audience.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Audiences and only return the `id`
     * const audienceWithIdOnly = await prisma.audience.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AudienceCreateManyAndReturnArgs>(args?: SelectSubset<T, AudienceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Audience.
     * @param {AudienceDeleteArgs} args - Arguments to delete one Audience.
     * @example
     * // Delete one Audience
     * const Audience = await prisma.audience.delete({
     *   where: {
     *     // ... filter to delete one Audience
     *   }
     * })
     * 
     */
    delete<T extends AudienceDeleteArgs>(args: SelectSubset<T, AudienceDeleteArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Audience.
     * @param {AudienceUpdateArgs} args - Arguments to update one Audience.
     * @example
     * // Update one Audience
     * const audience = await prisma.audience.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AudienceUpdateArgs>(args: SelectSubset<T, AudienceUpdateArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Audiences.
     * @param {AudienceDeleteManyArgs} args - Arguments to filter Audiences to delete.
     * @example
     * // Delete a few Audiences
     * const { count } = await prisma.audience.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AudienceDeleteManyArgs>(args?: SelectSubset<T, AudienceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Audiences
     * const audience = await prisma.audience.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AudienceUpdateManyArgs>(args: SelectSubset<T, AudienceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audiences and returns the data updated in the database.
     * @param {AudienceUpdateManyAndReturnArgs} args - Arguments to update many Audiences.
     * @example
     * // Update many Audiences
     * const audience = await prisma.audience.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Audiences and only return the `id`
     * const audienceWithIdOnly = await prisma.audience.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AudienceUpdateManyAndReturnArgs>(args: SelectSubset<T, AudienceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Audience.
     * @param {AudienceUpsertArgs} args - Arguments to update or create a Audience.
     * @example
     * // Update or create a Audience
     * const audience = await prisma.audience.upsert({
     *   create: {
     *     // ... data to create a Audience
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Audience we want to update
     *   }
     * })
     */
    upsert<T extends AudienceUpsertArgs>(args: SelectSubset<T, AudienceUpsertArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Audiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceCountArgs} args - Arguments to filter Audiences to count.
     * @example
     * // Count the number of Audiences
     * const count = await prisma.audience.count({
     *   where: {
     *     // ... the filter for the Audiences we want to count
     *   }
     * })
    **/
    count<T extends AudienceCountArgs>(
      args?: Subset<T, AudienceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AudienceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Audience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AudienceAggregateArgs>(args: Subset<T, AudienceAggregateArgs>): Prisma.PrismaPromise<GetAudienceAggregateType<T>>

    /**
     * Group by Audience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AudienceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AudienceGroupByArgs['orderBy'] }
        : { orderBy?: AudienceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AudienceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudienceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Audience model
   */
  readonly fields: AudienceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Audience.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AudienceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    outlineAudiences<T extends Audience$outlineAudiencesArgs<ExtArgs> = {}>(args?: Subset<T, Audience$outlineAudiencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Audience model
   */
  interface AudienceFieldRefs {
    readonly id: FieldRef<"Audience", 'String'>
    readonly name: FieldRef<"Audience", 'String'>
    readonly description: FieldRef<"Audience", 'String'>
    readonly type: FieldRef<"Audience", 'String'>
    readonly createdAt: FieldRef<"Audience", 'DateTime'>
    readonly updatedAt: FieldRef<"Audience", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Audience findUnique
   */
  export type AudienceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * Filter, which Audience to fetch.
     */
    where: AudienceWhereUniqueInput
  }

  /**
   * Audience findUniqueOrThrow
   */
  export type AudienceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * Filter, which Audience to fetch.
     */
    where: AudienceWhereUniqueInput
  }

  /**
   * Audience findFirst
   */
  export type AudienceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * Filter, which Audience to fetch.
     */
    where?: AudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Audiences to fetch.
     */
    orderBy?: AudienceOrderByWithRelationInput | AudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Audiences.
     */
    cursor?: AudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Audiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Audiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Audiences.
     */
    distinct?: AudienceScalarFieldEnum | AudienceScalarFieldEnum[]
  }

  /**
   * Audience findFirstOrThrow
   */
  export type AudienceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * Filter, which Audience to fetch.
     */
    where?: AudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Audiences to fetch.
     */
    orderBy?: AudienceOrderByWithRelationInput | AudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Audiences.
     */
    cursor?: AudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Audiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Audiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Audiences.
     */
    distinct?: AudienceScalarFieldEnum | AudienceScalarFieldEnum[]
  }

  /**
   * Audience findMany
   */
  export type AudienceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * Filter, which Audiences to fetch.
     */
    where?: AudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Audiences to fetch.
     */
    orderBy?: AudienceOrderByWithRelationInput | AudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Audiences.
     */
    cursor?: AudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Audiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Audiences.
     */
    skip?: number
    distinct?: AudienceScalarFieldEnum | AudienceScalarFieldEnum[]
  }

  /**
   * Audience create
   */
  export type AudienceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * The data needed to create a Audience.
     */
    data: XOR<AudienceCreateInput, AudienceUncheckedCreateInput>
  }

  /**
   * Audience createMany
   */
  export type AudienceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Audiences.
     */
    data: AudienceCreateManyInput | AudienceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Audience createManyAndReturn
   */
  export type AudienceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * The data used to create many Audiences.
     */
    data: AudienceCreateManyInput | AudienceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Audience update
   */
  export type AudienceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * The data needed to update a Audience.
     */
    data: XOR<AudienceUpdateInput, AudienceUncheckedUpdateInput>
    /**
     * Choose, which Audience to update.
     */
    where: AudienceWhereUniqueInput
  }

  /**
   * Audience updateMany
   */
  export type AudienceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Audiences.
     */
    data: XOR<AudienceUpdateManyMutationInput, AudienceUncheckedUpdateManyInput>
    /**
     * Filter which Audiences to update
     */
    where?: AudienceWhereInput
    /**
     * Limit how many Audiences to update.
     */
    limit?: number
  }

  /**
   * Audience updateManyAndReturn
   */
  export type AudienceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * The data used to update Audiences.
     */
    data: XOR<AudienceUpdateManyMutationInput, AudienceUncheckedUpdateManyInput>
    /**
     * Filter which Audiences to update
     */
    where?: AudienceWhereInput
    /**
     * Limit how many Audiences to update.
     */
    limit?: number
  }

  /**
   * Audience upsert
   */
  export type AudienceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * The filter to search for the Audience to update in case it exists.
     */
    where: AudienceWhereUniqueInput
    /**
     * In case the Audience found by the `where` argument doesn't exist, create a new Audience with this data.
     */
    create: XOR<AudienceCreateInput, AudienceUncheckedCreateInput>
    /**
     * In case the Audience was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AudienceUpdateInput, AudienceUncheckedUpdateInput>
  }

  /**
   * Audience delete
   */
  export type AudienceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
    /**
     * Filter which Audience to delete.
     */
    where: AudienceWhereUniqueInput
  }

  /**
   * Audience deleteMany
   */
  export type AudienceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Audiences to delete
     */
    where?: AudienceWhereInput
    /**
     * Limit how many Audiences to delete.
     */
    limit?: number
  }

  /**
   * Audience.outlineAudiences
   */
  export type Audience$outlineAudiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    where?: OutlineAudienceWhereInput
    orderBy?: OutlineAudienceOrderByWithRelationInput | OutlineAudienceOrderByWithRelationInput[]
    cursor?: OutlineAudienceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OutlineAudienceScalarFieldEnum | OutlineAudienceScalarFieldEnum[]
  }

  /**
   * Audience without action
   */
  export type AudienceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Audience
     */
    select?: AudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Audience
     */
    omit?: AudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudienceInclude<ExtArgs> | null
  }


  /**
   * Model Outline
   */

  export type AggregateOutline = {
    _count: OutlineCountAggregateOutputType | null
    _min: OutlineMinAggregateOutputType | null
    _max: OutlineMaxAggregateOutputType | null
  }

  export type OutlineMinAggregateOutputType = {
    id: string | null
    title: string | null
    outlineText: string | null
    createdAt: Date | null
    updatedAt: Date | null
    styleProfileId: string | null
  }

  export type OutlineMaxAggregateOutputType = {
    id: string | null
    title: string | null
    outlineText: string | null
    createdAt: Date | null
    updatedAt: Date | null
    styleProfileId: string | null
  }

  export type OutlineCountAggregateOutputType = {
    id: number
    title: number
    keyPoints: number
    outlineText: number
    createdAt: number
    updatedAt: number
    styleProfileId: number
    _all: number
  }


  export type OutlineMinAggregateInputType = {
    id?: true
    title?: true
    outlineText?: true
    createdAt?: true
    updatedAt?: true
    styleProfileId?: true
  }

  export type OutlineMaxAggregateInputType = {
    id?: true
    title?: true
    outlineText?: true
    createdAt?: true
    updatedAt?: true
    styleProfileId?: true
  }

  export type OutlineCountAggregateInputType = {
    id?: true
    title?: true
    keyPoints?: true
    outlineText?: true
    createdAt?: true
    updatedAt?: true
    styleProfileId?: true
    _all?: true
  }

  export type OutlineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Outline to aggregate.
     */
    where?: OutlineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Outlines to fetch.
     */
    orderBy?: OutlineOrderByWithRelationInput | OutlineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OutlineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Outlines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Outlines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Outlines
    **/
    _count?: true | OutlineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OutlineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OutlineMaxAggregateInputType
  }

  export type GetOutlineAggregateType<T extends OutlineAggregateArgs> = {
        [P in keyof T & keyof AggregateOutline]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOutline[P]>
      : GetScalarType<T[P], AggregateOutline[P]>
  }




  export type OutlineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OutlineWhereInput
    orderBy?: OutlineOrderByWithAggregationInput | OutlineOrderByWithAggregationInput[]
    by: OutlineScalarFieldEnum[] | OutlineScalarFieldEnum
    having?: OutlineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OutlineCountAggregateInputType | true
    _min?: OutlineMinAggregateInputType
    _max?: OutlineMaxAggregateInputType
  }

  export type OutlineGroupByOutputType = {
    id: string
    title: string
    keyPoints: string[]
    outlineText: string
    createdAt: Date
    updatedAt: Date
    styleProfileId: string | null
    _count: OutlineCountAggregateOutputType | null
    _min: OutlineMinAggregateOutputType | null
    _max: OutlineMaxAggregateOutputType | null
  }

  type GetOutlineGroupByPayload<T extends OutlineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OutlineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OutlineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OutlineGroupByOutputType[P]>
            : GetScalarType<T[P], OutlineGroupByOutputType[P]>
        }
      >
    >


  export type OutlineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    keyPoints?: boolean
    outlineText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    styleProfileId?: boolean
    styleProfile?: boolean | Outline$styleProfileArgs<ExtArgs>
    outlineAudiences?: boolean | Outline$outlineAudiencesArgs<ExtArgs>
    articles?: boolean | Outline$articlesArgs<ExtArgs>
    _count?: boolean | OutlineCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["outline"]>

  export type OutlineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    keyPoints?: boolean
    outlineText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    styleProfileId?: boolean
    styleProfile?: boolean | Outline$styleProfileArgs<ExtArgs>
  }, ExtArgs["result"]["outline"]>

  export type OutlineSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    keyPoints?: boolean
    outlineText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    styleProfileId?: boolean
    styleProfile?: boolean | Outline$styleProfileArgs<ExtArgs>
  }, ExtArgs["result"]["outline"]>

  export type OutlineSelectScalar = {
    id?: boolean
    title?: boolean
    keyPoints?: boolean
    outlineText?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    styleProfileId?: boolean
  }

  export type OutlineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "keyPoints" | "outlineText" | "createdAt" | "updatedAt" | "styleProfileId", ExtArgs["result"]["outline"]>
  export type OutlineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    styleProfile?: boolean | Outline$styleProfileArgs<ExtArgs>
    outlineAudiences?: boolean | Outline$outlineAudiencesArgs<ExtArgs>
    articles?: boolean | Outline$articlesArgs<ExtArgs>
    _count?: boolean | OutlineCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OutlineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    styleProfile?: boolean | Outline$styleProfileArgs<ExtArgs>
  }
  export type OutlineIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    styleProfile?: boolean | Outline$styleProfileArgs<ExtArgs>
  }

  export type $OutlinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Outline"
    objects: {
      styleProfile: Prisma.$StyleProfilePayload<ExtArgs> | null
      outlineAudiences: Prisma.$OutlineAudiencePayload<ExtArgs>[]
      articles: Prisma.$ArticlePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      keyPoints: string[]
      outlineText: string
      createdAt: Date
      updatedAt: Date
      styleProfileId: string | null
    }, ExtArgs["result"]["outline"]>
    composites: {}
  }

  type OutlineGetPayload<S extends boolean | null | undefined | OutlineDefaultArgs> = $Result.GetResult<Prisma.$OutlinePayload, S>

  type OutlineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OutlineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OutlineCountAggregateInputType | true
    }

  export interface OutlineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Outline'], meta: { name: 'Outline' } }
    /**
     * Find zero or one Outline that matches the filter.
     * @param {OutlineFindUniqueArgs} args - Arguments to find a Outline
     * @example
     * // Get one Outline
     * const outline = await prisma.outline.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OutlineFindUniqueArgs>(args: SelectSubset<T, OutlineFindUniqueArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Outline that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OutlineFindUniqueOrThrowArgs} args - Arguments to find a Outline
     * @example
     * // Get one Outline
     * const outline = await prisma.outline.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OutlineFindUniqueOrThrowArgs>(args: SelectSubset<T, OutlineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Outline that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineFindFirstArgs} args - Arguments to find a Outline
     * @example
     * // Get one Outline
     * const outline = await prisma.outline.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OutlineFindFirstArgs>(args?: SelectSubset<T, OutlineFindFirstArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Outline that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineFindFirstOrThrowArgs} args - Arguments to find a Outline
     * @example
     * // Get one Outline
     * const outline = await prisma.outline.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OutlineFindFirstOrThrowArgs>(args?: SelectSubset<T, OutlineFindFirstOrThrowArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Outlines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Outlines
     * const outlines = await prisma.outline.findMany()
     * 
     * // Get first 10 Outlines
     * const outlines = await prisma.outline.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const outlineWithIdOnly = await prisma.outline.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OutlineFindManyArgs>(args?: SelectSubset<T, OutlineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Outline.
     * @param {OutlineCreateArgs} args - Arguments to create a Outline.
     * @example
     * // Create one Outline
     * const Outline = await prisma.outline.create({
     *   data: {
     *     // ... data to create a Outline
     *   }
     * })
     * 
     */
    create<T extends OutlineCreateArgs>(args: SelectSubset<T, OutlineCreateArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Outlines.
     * @param {OutlineCreateManyArgs} args - Arguments to create many Outlines.
     * @example
     * // Create many Outlines
     * const outline = await prisma.outline.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OutlineCreateManyArgs>(args?: SelectSubset<T, OutlineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Outlines and returns the data saved in the database.
     * @param {OutlineCreateManyAndReturnArgs} args - Arguments to create many Outlines.
     * @example
     * // Create many Outlines
     * const outline = await prisma.outline.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Outlines and only return the `id`
     * const outlineWithIdOnly = await prisma.outline.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OutlineCreateManyAndReturnArgs>(args?: SelectSubset<T, OutlineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Outline.
     * @param {OutlineDeleteArgs} args - Arguments to delete one Outline.
     * @example
     * // Delete one Outline
     * const Outline = await prisma.outline.delete({
     *   where: {
     *     // ... filter to delete one Outline
     *   }
     * })
     * 
     */
    delete<T extends OutlineDeleteArgs>(args: SelectSubset<T, OutlineDeleteArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Outline.
     * @param {OutlineUpdateArgs} args - Arguments to update one Outline.
     * @example
     * // Update one Outline
     * const outline = await prisma.outline.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OutlineUpdateArgs>(args: SelectSubset<T, OutlineUpdateArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Outlines.
     * @param {OutlineDeleteManyArgs} args - Arguments to filter Outlines to delete.
     * @example
     * // Delete a few Outlines
     * const { count } = await prisma.outline.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OutlineDeleteManyArgs>(args?: SelectSubset<T, OutlineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Outlines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Outlines
     * const outline = await prisma.outline.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OutlineUpdateManyArgs>(args: SelectSubset<T, OutlineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Outlines and returns the data updated in the database.
     * @param {OutlineUpdateManyAndReturnArgs} args - Arguments to update many Outlines.
     * @example
     * // Update many Outlines
     * const outline = await prisma.outline.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Outlines and only return the `id`
     * const outlineWithIdOnly = await prisma.outline.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OutlineUpdateManyAndReturnArgs>(args: SelectSubset<T, OutlineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Outline.
     * @param {OutlineUpsertArgs} args - Arguments to update or create a Outline.
     * @example
     * // Update or create a Outline
     * const outline = await prisma.outline.upsert({
     *   create: {
     *     // ... data to create a Outline
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Outline we want to update
     *   }
     * })
     */
    upsert<T extends OutlineUpsertArgs>(args: SelectSubset<T, OutlineUpsertArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Outlines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineCountArgs} args - Arguments to filter Outlines to count.
     * @example
     * // Count the number of Outlines
     * const count = await prisma.outline.count({
     *   where: {
     *     // ... the filter for the Outlines we want to count
     *   }
     * })
    **/
    count<T extends OutlineCountArgs>(
      args?: Subset<T, OutlineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OutlineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Outline.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OutlineAggregateArgs>(args: Subset<T, OutlineAggregateArgs>): Prisma.PrismaPromise<GetOutlineAggregateType<T>>

    /**
     * Group by Outline.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OutlineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OutlineGroupByArgs['orderBy'] }
        : { orderBy?: OutlineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OutlineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOutlineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Outline model
   */
  readonly fields: OutlineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Outline.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OutlineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    styleProfile<T extends Outline$styleProfileArgs<ExtArgs> = {}>(args?: Subset<T, Outline$styleProfileArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    outlineAudiences<T extends Outline$outlineAudiencesArgs<ExtArgs> = {}>(args?: Subset<T, Outline$outlineAudiencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    articles<T extends Outline$articlesArgs<ExtArgs> = {}>(args?: Subset<T, Outline$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Outline model
   */
  interface OutlineFieldRefs {
    readonly id: FieldRef<"Outline", 'String'>
    readonly title: FieldRef<"Outline", 'String'>
    readonly keyPoints: FieldRef<"Outline", 'String[]'>
    readonly outlineText: FieldRef<"Outline", 'String'>
    readonly createdAt: FieldRef<"Outline", 'DateTime'>
    readonly updatedAt: FieldRef<"Outline", 'DateTime'>
    readonly styleProfileId: FieldRef<"Outline", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Outline findUnique
   */
  export type OutlineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * Filter, which Outline to fetch.
     */
    where: OutlineWhereUniqueInput
  }

  /**
   * Outline findUniqueOrThrow
   */
  export type OutlineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * Filter, which Outline to fetch.
     */
    where: OutlineWhereUniqueInput
  }

  /**
   * Outline findFirst
   */
  export type OutlineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * Filter, which Outline to fetch.
     */
    where?: OutlineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Outlines to fetch.
     */
    orderBy?: OutlineOrderByWithRelationInput | OutlineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Outlines.
     */
    cursor?: OutlineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Outlines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Outlines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Outlines.
     */
    distinct?: OutlineScalarFieldEnum | OutlineScalarFieldEnum[]
  }

  /**
   * Outline findFirstOrThrow
   */
  export type OutlineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * Filter, which Outline to fetch.
     */
    where?: OutlineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Outlines to fetch.
     */
    orderBy?: OutlineOrderByWithRelationInput | OutlineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Outlines.
     */
    cursor?: OutlineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Outlines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Outlines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Outlines.
     */
    distinct?: OutlineScalarFieldEnum | OutlineScalarFieldEnum[]
  }

  /**
   * Outline findMany
   */
  export type OutlineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * Filter, which Outlines to fetch.
     */
    where?: OutlineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Outlines to fetch.
     */
    orderBy?: OutlineOrderByWithRelationInput | OutlineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Outlines.
     */
    cursor?: OutlineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Outlines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Outlines.
     */
    skip?: number
    distinct?: OutlineScalarFieldEnum | OutlineScalarFieldEnum[]
  }

  /**
   * Outline create
   */
  export type OutlineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * The data needed to create a Outline.
     */
    data: XOR<OutlineCreateInput, OutlineUncheckedCreateInput>
  }

  /**
   * Outline createMany
   */
  export type OutlineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Outlines.
     */
    data: OutlineCreateManyInput | OutlineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Outline createManyAndReturn
   */
  export type OutlineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * The data used to create many Outlines.
     */
    data: OutlineCreateManyInput | OutlineCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Outline update
   */
  export type OutlineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * The data needed to update a Outline.
     */
    data: XOR<OutlineUpdateInput, OutlineUncheckedUpdateInput>
    /**
     * Choose, which Outline to update.
     */
    where: OutlineWhereUniqueInput
  }

  /**
   * Outline updateMany
   */
  export type OutlineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Outlines.
     */
    data: XOR<OutlineUpdateManyMutationInput, OutlineUncheckedUpdateManyInput>
    /**
     * Filter which Outlines to update
     */
    where?: OutlineWhereInput
    /**
     * Limit how many Outlines to update.
     */
    limit?: number
  }

  /**
   * Outline updateManyAndReturn
   */
  export type OutlineUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * The data used to update Outlines.
     */
    data: XOR<OutlineUpdateManyMutationInput, OutlineUncheckedUpdateManyInput>
    /**
     * Filter which Outlines to update
     */
    where?: OutlineWhereInput
    /**
     * Limit how many Outlines to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Outline upsert
   */
  export type OutlineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * The filter to search for the Outline to update in case it exists.
     */
    where: OutlineWhereUniqueInput
    /**
     * In case the Outline found by the `where` argument doesn't exist, create a new Outline with this data.
     */
    create: XOR<OutlineCreateInput, OutlineUncheckedCreateInput>
    /**
     * In case the Outline was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OutlineUpdateInput, OutlineUncheckedUpdateInput>
  }

  /**
   * Outline delete
   */
  export type OutlineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
    /**
     * Filter which Outline to delete.
     */
    where: OutlineWhereUniqueInput
  }

  /**
   * Outline deleteMany
   */
  export type OutlineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Outlines to delete
     */
    where?: OutlineWhereInput
    /**
     * Limit how many Outlines to delete.
     */
    limit?: number
  }

  /**
   * Outline.styleProfile
   */
  export type Outline$styleProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StyleProfile
     */
    select?: StyleProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StyleProfile
     */
    omit?: StyleProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StyleProfileInclude<ExtArgs> | null
    where?: StyleProfileWhereInput
  }

  /**
   * Outline.outlineAudiences
   */
  export type Outline$outlineAudiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    where?: OutlineAudienceWhereInput
    orderBy?: OutlineAudienceOrderByWithRelationInput | OutlineAudienceOrderByWithRelationInput[]
    cursor?: OutlineAudienceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OutlineAudienceScalarFieldEnum | OutlineAudienceScalarFieldEnum[]
  }

  /**
   * Outline.articles
   */
  export type Outline$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Outline without action
   */
  export type OutlineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Outline
     */
    select?: OutlineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Outline
     */
    omit?: OutlineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineInclude<ExtArgs> | null
  }


  /**
   * Model OutlineAudience
   */

  export type AggregateOutlineAudience = {
    _count: OutlineAudienceCountAggregateOutputType | null
    _min: OutlineAudienceMinAggregateOutputType | null
    _max: OutlineAudienceMaxAggregateOutputType | null
  }

  export type OutlineAudienceMinAggregateOutputType = {
    outlineId: string | null
    audienceId: string | null
    assignedAt: Date | null
  }

  export type OutlineAudienceMaxAggregateOutputType = {
    outlineId: string | null
    audienceId: string | null
    assignedAt: Date | null
  }

  export type OutlineAudienceCountAggregateOutputType = {
    outlineId: number
    audienceId: number
    assignedAt: number
    _all: number
  }


  export type OutlineAudienceMinAggregateInputType = {
    outlineId?: true
    audienceId?: true
    assignedAt?: true
  }

  export type OutlineAudienceMaxAggregateInputType = {
    outlineId?: true
    audienceId?: true
    assignedAt?: true
  }

  export type OutlineAudienceCountAggregateInputType = {
    outlineId?: true
    audienceId?: true
    assignedAt?: true
    _all?: true
  }

  export type OutlineAudienceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OutlineAudience to aggregate.
     */
    where?: OutlineAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OutlineAudiences to fetch.
     */
    orderBy?: OutlineAudienceOrderByWithRelationInput | OutlineAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OutlineAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OutlineAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OutlineAudiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OutlineAudiences
    **/
    _count?: true | OutlineAudienceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OutlineAudienceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OutlineAudienceMaxAggregateInputType
  }

  export type GetOutlineAudienceAggregateType<T extends OutlineAudienceAggregateArgs> = {
        [P in keyof T & keyof AggregateOutlineAudience]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOutlineAudience[P]>
      : GetScalarType<T[P], AggregateOutlineAudience[P]>
  }




  export type OutlineAudienceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OutlineAudienceWhereInput
    orderBy?: OutlineAudienceOrderByWithAggregationInput | OutlineAudienceOrderByWithAggregationInput[]
    by: OutlineAudienceScalarFieldEnum[] | OutlineAudienceScalarFieldEnum
    having?: OutlineAudienceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OutlineAudienceCountAggregateInputType | true
    _min?: OutlineAudienceMinAggregateInputType
    _max?: OutlineAudienceMaxAggregateInputType
  }

  export type OutlineAudienceGroupByOutputType = {
    outlineId: string
    audienceId: string
    assignedAt: Date
    _count: OutlineAudienceCountAggregateOutputType | null
    _min: OutlineAudienceMinAggregateOutputType | null
    _max: OutlineAudienceMaxAggregateOutputType | null
  }

  type GetOutlineAudienceGroupByPayload<T extends OutlineAudienceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OutlineAudienceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OutlineAudienceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OutlineAudienceGroupByOutputType[P]>
            : GetScalarType<T[P], OutlineAudienceGroupByOutputType[P]>
        }
      >
    >


  export type OutlineAudienceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    outlineId?: boolean
    audienceId?: boolean
    assignedAt?: boolean
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    audience?: boolean | AudienceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["outlineAudience"]>

  export type OutlineAudienceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    outlineId?: boolean
    audienceId?: boolean
    assignedAt?: boolean
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    audience?: boolean | AudienceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["outlineAudience"]>

  export type OutlineAudienceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    outlineId?: boolean
    audienceId?: boolean
    assignedAt?: boolean
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    audience?: boolean | AudienceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["outlineAudience"]>

  export type OutlineAudienceSelectScalar = {
    outlineId?: boolean
    audienceId?: boolean
    assignedAt?: boolean
  }

  export type OutlineAudienceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"outlineId" | "audienceId" | "assignedAt", ExtArgs["result"]["outlineAudience"]>
  export type OutlineAudienceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    audience?: boolean | AudienceDefaultArgs<ExtArgs>
  }
  export type OutlineAudienceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    audience?: boolean | AudienceDefaultArgs<ExtArgs>
  }
  export type OutlineAudienceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    audience?: boolean | AudienceDefaultArgs<ExtArgs>
  }

  export type $OutlineAudiencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OutlineAudience"
    objects: {
      outline: Prisma.$OutlinePayload<ExtArgs>
      audience: Prisma.$AudiencePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      outlineId: string
      audienceId: string
      assignedAt: Date
    }, ExtArgs["result"]["outlineAudience"]>
    composites: {}
  }

  type OutlineAudienceGetPayload<S extends boolean | null | undefined | OutlineAudienceDefaultArgs> = $Result.GetResult<Prisma.$OutlineAudiencePayload, S>

  type OutlineAudienceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OutlineAudienceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OutlineAudienceCountAggregateInputType | true
    }

  export interface OutlineAudienceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OutlineAudience'], meta: { name: 'OutlineAudience' } }
    /**
     * Find zero or one OutlineAudience that matches the filter.
     * @param {OutlineAudienceFindUniqueArgs} args - Arguments to find a OutlineAudience
     * @example
     * // Get one OutlineAudience
     * const outlineAudience = await prisma.outlineAudience.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OutlineAudienceFindUniqueArgs>(args: SelectSubset<T, OutlineAudienceFindUniqueArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OutlineAudience that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OutlineAudienceFindUniqueOrThrowArgs} args - Arguments to find a OutlineAudience
     * @example
     * // Get one OutlineAudience
     * const outlineAudience = await prisma.outlineAudience.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OutlineAudienceFindUniqueOrThrowArgs>(args: SelectSubset<T, OutlineAudienceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OutlineAudience that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceFindFirstArgs} args - Arguments to find a OutlineAudience
     * @example
     * // Get one OutlineAudience
     * const outlineAudience = await prisma.outlineAudience.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OutlineAudienceFindFirstArgs>(args?: SelectSubset<T, OutlineAudienceFindFirstArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OutlineAudience that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceFindFirstOrThrowArgs} args - Arguments to find a OutlineAudience
     * @example
     * // Get one OutlineAudience
     * const outlineAudience = await prisma.outlineAudience.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OutlineAudienceFindFirstOrThrowArgs>(args?: SelectSubset<T, OutlineAudienceFindFirstOrThrowArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OutlineAudiences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OutlineAudiences
     * const outlineAudiences = await prisma.outlineAudience.findMany()
     * 
     * // Get first 10 OutlineAudiences
     * const outlineAudiences = await prisma.outlineAudience.findMany({ take: 10 })
     * 
     * // Only select the `outlineId`
     * const outlineAudienceWithOutlineIdOnly = await prisma.outlineAudience.findMany({ select: { outlineId: true } })
     * 
     */
    findMany<T extends OutlineAudienceFindManyArgs>(args?: SelectSubset<T, OutlineAudienceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OutlineAudience.
     * @param {OutlineAudienceCreateArgs} args - Arguments to create a OutlineAudience.
     * @example
     * // Create one OutlineAudience
     * const OutlineAudience = await prisma.outlineAudience.create({
     *   data: {
     *     // ... data to create a OutlineAudience
     *   }
     * })
     * 
     */
    create<T extends OutlineAudienceCreateArgs>(args: SelectSubset<T, OutlineAudienceCreateArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OutlineAudiences.
     * @param {OutlineAudienceCreateManyArgs} args - Arguments to create many OutlineAudiences.
     * @example
     * // Create many OutlineAudiences
     * const outlineAudience = await prisma.outlineAudience.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OutlineAudienceCreateManyArgs>(args?: SelectSubset<T, OutlineAudienceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OutlineAudiences and returns the data saved in the database.
     * @param {OutlineAudienceCreateManyAndReturnArgs} args - Arguments to create many OutlineAudiences.
     * @example
     * // Create many OutlineAudiences
     * const outlineAudience = await prisma.outlineAudience.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OutlineAudiences and only return the `outlineId`
     * const outlineAudienceWithOutlineIdOnly = await prisma.outlineAudience.createManyAndReturn({
     *   select: { outlineId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OutlineAudienceCreateManyAndReturnArgs>(args?: SelectSubset<T, OutlineAudienceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OutlineAudience.
     * @param {OutlineAudienceDeleteArgs} args - Arguments to delete one OutlineAudience.
     * @example
     * // Delete one OutlineAudience
     * const OutlineAudience = await prisma.outlineAudience.delete({
     *   where: {
     *     // ... filter to delete one OutlineAudience
     *   }
     * })
     * 
     */
    delete<T extends OutlineAudienceDeleteArgs>(args: SelectSubset<T, OutlineAudienceDeleteArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OutlineAudience.
     * @param {OutlineAudienceUpdateArgs} args - Arguments to update one OutlineAudience.
     * @example
     * // Update one OutlineAudience
     * const outlineAudience = await prisma.outlineAudience.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OutlineAudienceUpdateArgs>(args: SelectSubset<T, OutlineAudienceUpdateArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OutlineAudiences.
     * @param {OutlineAudienceDeleteManyArgs} args - Arguments to filter OutlineAudiences to delete.
     * @example
     * // Delete a few OutlineAudiences
     * const { count } = await prisma.outlineAudience.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OutlineAudienceDeleteManyArgs>(args?: SelectSubset<T, OutlineAudienceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OutlineAudiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OutlineAudiences
     * const outlineAudience = await prisma.outlineAudience.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OutlineAudienceUpdateManyArgs>(args: SelectSubset<T, OutlineAudienceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OutlineAudiences and returns the data updated in the database.
     * @param {OutlineAudienceUpdateManyAndReturnArgs} args - Arguments to update many OutlineAudiences.
     * @example
     * // Update many OutlineAudiences
     * const outlineAudience = await prisma.outlineAudience.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OutlineAudiences and only return the `outlineId`
     * const outlineAudienceWithOutlineIdOnly = await prisma.outlineAudience.updateManyAndReturn({
     *   select: { outlineId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OutlineAudienceUpdateManyAndReturnArgs>(args: SelectSubset<T, OutlineAudienceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OutlineAudience.
     * @param {OutlineAudienceUpsertArgs} args - Arguments to update or create a OutlineAudience.
     * @example
     * // Update or create a OutlineAudience
     * const outlineAudience = await prisma.outlineAudience.upsert({
     *   create: {
     *     // ... data to create a OutlineAudience
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OutlineAudience we want to update
     *   }
     * })
     */
    upsert<T extends OutlineAudienceUpsertArgs>(args: SelectSubset<T, OutlineAudienceUpsertArgs<ExtArgs>>): Prisma__OutlineAudienceClient<$Result.GetResult<Prisma.$OutlineAudiencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OutlineAudiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceCountArgs} args - Arguments to filter OutlineAudiences to count.
     * @example
     * // Count the number of OutlineAudiences
     * const count = await prisma.outlineAudience.count({
     *   where: {
     *     // ... the filter for the OutlineAudiences we want to count
     *   }
     * })
    **/
    count<T extends OutlineAudienceCountArgs>(
      args?: Subset<T, OutlineAudienceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OutlineAudienceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OutlineAudience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OutlineAudienceAggregateArgs>(args: Subset<T, OutlineAudienceAggregateArgs>): Prisma.PrismaPromise<GetOutlineAudienceAggregateType<T>>

    /**
     * Group by OutlineAudience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OutlineAudienceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OutlineAudienceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OutlineAudienceGroupByArgs['orderBy'] }
        : { orderBy?: OutlineAudienceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OutlineAudienceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOutlineAudienceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OutlineAudience model
   */
  readonly fields: OutlineAudienceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OutlineAudience.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OutlineAudienceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    outline<T extends OutlineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OutlineDefaultArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    audience<T extends AudienceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AudienceDefaultArgs<ExtArgs>>): Prisma__AudienceClient<$Result.GetResult<Prisma.$AudiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OutlineAudience model
   */
  interface OutlineAudienceFieldRefs {
    readonly outlineId: FieldRef<"OutlineAudience", 'String'>
    readonly audienceId: FieldRef<"OutlineAudience", 'String'>
    readonly assignedAt: FieldRef<"OutlineAudience", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OutlineAudience findUnique
   */
  export type OutlineAudienceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * Filter, which OutlineAudience to fetch.
     */
    where: OutlineAudienceWhereUniqueInput
  }

  /**
   * OutlineAudience findUniqueOrThrow
   */
  export type OutlineAudienceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * Filter, which OutlineAudience to fetch.
     */
    where: OutlineAudienceWhereUniqueInput
  }

  /**
   * OutlineAudience findFirst
   */
  export type OutlineAudienceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * Filter, which OutlineAudience to fetch.
     */
    where?: OutlineAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OutlineAudiences to fetch.
     */
    orderBy?: OutlineAudienceOrderByWithRelationInput | OutlineAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OutlineAudiences.
     */
    cursor?: OutlineAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OutlineAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OutlineAudiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OutlineAudiences.
     */
    distinct?: OutlineAudienceScalarFieldEnum | OutlineAudienceScalarFieldEnum[]
  }

  /**
   * OutlineAudience findFirstOrThrow
   */
  export type OutlineAudienceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * Filter, which OutlineAudience to fetch.
     */
    where?: OutlineAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OutlineAudiences to fetch.
     */
    orderBy?: OutlineAudienceOrderByWithRelationInput | OutlineAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OutlineAudiences.
     */
    cursor?: OutlineAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OutlineAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OutlineAudiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OutlineAudiences.
     */
    distinct?: OutlineAudienceScalarFieldEnum | OutlineAudienceScalarFieldEnum[]
  }

  /**
   * OutlineAudience findMany
   */
  export type OutlineAudienceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * Filter, which OutlineAudiences to fetch.
     */
    where?: OutlineAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OutlineAudiences to fetch.
     */
    orderBy?: OutlineAudienceOrderByWithRelationInput | OutlineAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OutlineAudiences.
     */
    cursor?: OutlineAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OutlineAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OutlineAudiences.
     */
    skip?: number
    distinct?: OutlineAudienceScalarFieldEnum | OutlineAudienceScalarFieldEnum[]
  }

  /**
   * OutlineAudience create
   */
  export type OutlineAudienceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * The data needed to create a OutlineAudience.
     */
    data: XOR<OutlineAudienceCreateInput, OutlineAudienceUncheckedCreateInput>
  }

  /**
   * OutlineAudience createMany
   */
  export type OutlineAudienceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OutlineAudiences.
     */
    data: OutlineAudienceCreateManyInput | OutlineAudienceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OutlineAudience createManyAndReturn
   */
  export type OutlineAudienceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * The data used to create many OutlineAudiences.
     */
    data: OutlineAudienceCreateManyInput | OutlineAudienceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OutlineAudience update
   */
  export type OutlineAudienceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * The data needed to update a OutlineAudience.
     */
    data: XOR<OutlineAudienceUpdateInput, OutlineAudienceUncheckedUpdateInput>
    /**
     * Choose, which OutlineAudience to update.
     */
    where: OutlineAudienceWhereUniqueInput
  }

  /**
   * OutlineAudience updateMany
   */
  export type OutlineAudienceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OutlineAudiences.
     */
    data: XOR<OutlineAudienceUpdateManyMutationInput, OutlineAudienceUncheckedUpdateManyInput>
    /**
     * Filter which OutlineAudiences to update
     */
    where?: OutlineAudienceWhereInput
    /**
     * Limit how many OutlineAudiences to update.
     */
    limit?: number
  }

  /**
   * OutlineAudience updateManyAndReturn
   */
  export type OutlineAudienceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * The data used to update OutlineAudiences.
     */
    data: XOR<OutlineAudienceUpdateManyMutationInput, OutlineAudienceUncheckedUpdateManyInput>
    /**
     * Filter which OutlineAudiences to update
     */
    where?: OutlineAudienceWhereInput
    /**
     * Limit how many OutlineAudiences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OutlineAudience upsert
   */
  export type OutlineAudienceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * The filter to search for the OutlineAudience to update in case it exists.
     */
    where: OutlineAudienceWhereUniqueInput
    /**
     * In case the OutlineAudience found by the `where` argument doesn't exist, create a new OutlineAudience with this data.
     */
    create: XOR<OutlineAudienceCreateInput, OutlineAudienceUncheckedCreateInput>
    /**
     * In case the OutlineAudience was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OutlineAudienceUpdateInput, OutlineAudienceUncheckedUpdateInput>
  }

  /**
   * OutlineAudience delete
   */
  export type OutlineAudienceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
    /**
     * Filter which OutlineAudience to delete.
     */
    where: OutlineAudienceWhereUniqueInput
  }

  /**
   * OutlineAudience deleteMany
   */
  export type OutlineAudienceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OutlineAudiences to delete
     */
    where?: OutlineAudienceWhereInput
    /**
     * Limit how many OutlineAudiences to delete.
     */
    limit?: number
  }

  /**
   * OutlineAudience without action
   */
  export type OutlineAudienceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OutlineAudience
     */
    select?: OutlineAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OutlineAudience
     */
    omit?: OutlineAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OutlineAudienceInclude<ExtArgs> | null
  }


  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    outlineId: string | null
    styleProfileId: string | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    outlineId: string | null
    styleProfileId: string | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    structuredContent: number
    status: number
    writingPurpose: number
    createdAt: number
    updatedAt: number
    outlineId: number
    styleProfileId: number
    targetAudienceIds: number
    _all: number
  }


  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    outlineId?: true
    styleProfileId?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    outlineId?: true
    styleProfileId?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    structuredContent?: true
    status?: true
    writingPurpose?: true
    createdAt?: true
    updatedAt?: true
    outlineId?: true
    styleProfileId?: true
    targetAudienceIds?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: string
    title: string
    content: string
    structuredContent: JsonValue | null
    status: string
    writingPurpose: string[]
    createdAt: Date
    updatedAt: Date
    outlineId: string
    styleProfileId: string
    targetAudienceIds: string[]
    _count: ArticleCountAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    structuredContent?: boolean
    status?: boolean
    writingPurpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    outlineId?: boolean
    styleProfileId?: boolean
    targetAudienceIds?: boolean
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    styleProfile?: boolean | StyleProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    structuredContent?: boolean
    status?: boolean
    writingPurpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    outlineId?: boolean
    styleProfileId?: boolean
    targetAudienceIds?: boolean
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    styleProfile?: boolean | StyleProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    structuredContent?: boolean
    status?: boolean
    writingPurpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    outlineId?: boolean
    styleProfileId?: boolean
    targetAudienceIds?: boolean
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    styleProfile?: boolean | StyleProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    structuredContent?: boolean
    status?: boolean
    writingPurpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    outlineId?: boolean
    styleProfileId?: boolean
    targetAudienceIds?: boolean
  }

  export type ArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "structuredContent" | "status" | "writingPurpose" | "createdAt" | "updatedAt" | "outlineId" | "styleProfileId" | "targetAudienceIds", ExtArgs["result"]["article"]>
  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    styleProfile?: boolean | StyleProfileDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    styleProfile?: boolean | StyleProfileDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outline?: boolean | OutlineDefaultArgs<ExtArgs>
    styleProfile?: boolean | StyleProfileDefaultArgs<ExtArgs>
  }

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      outline: Prisma.$OutlinePayload<ExtArgs>
      styleProfile: Prisma.$StyleProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      structuredContent: Prisma.JsonValue | null
      status: string
      writingPurpose: string[]
      createdAt: Date
      updatedAt: Date
      outlineId: string
      styleProfileId: string
      targetAudienceIds: string[]
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {ArticleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    outline<T extends OutlineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OutlineDefaultArgs<ExtArgs>>): Prisma__OutlineClient<$Result.GetResult<Prisma.$OutlinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    styleProfile<T extends StyleProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StyleProfileDefaultArgs<ExtArgs>>): Prisma__StyleProfileClient<$Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'String'>
    readonly title: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly structuredContent: FieldRef<"Article", 'Json'>
    readonly status: FieldRef<"Article", 'String'>
    readonly writingPurpose: FieldRef<"Article", 'String[]'>
    readonly createdAt: FieldRef<"Article", 'DateTime'>
    readonly updatedAt: FieldRef<"Article", 'DateTime'>
    readonly outlineId: FieldRef<"Article", 'String'>
    readonly styleProfileId: FieldRef<"Article", 'String'>
    readonly targetAudienceIds: FieldRef<"Article", 'String[]'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article updateManyAndReturn
   */
  export type ArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StyleProfileScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    authorInfo: 'authorInfo',
    styleFeatures: 'styleFeatures',
    sampleText: 'sampleText',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StyleProfileScalarFieldEnum = (typeof StyleProfileScalarFieldEnum)[keyof typeof StyleProfileScalarFieldEnum]


  export const AudienceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AudienceScalarFieldEnum = (typeof AudienceScalarFieldEnum)[keyof typeof AudienceScalarFieldEnum]


  export const OutlineScalarFieldEnum: {
    id: 'id',
    title: 'title',
    keyPoints: 'keyPoints',
    outlineText: 'outlineText',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    styleProfileId: 'styleProfileId'
  };

  export type OutlineScalarFieldEnum = (typeof OutlineScalarFieldEnum)[keyof typeof OutlineScalarFieldEnum]


  export const OutlineAudienceScalarFieldEnum: {
    outlineId: 'outlineId',
    audienceId: 'audienceId',
    assignedAt: 'assignedAt'
  };

  export type OutlineAudienceScalarFieldEnum = (typeof OutlineAudienceScalarFieldEnum)[keyof typeof OutlineAudienceScalarFieldEnum]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    structuredContent: 'structuredContent',
    status: 'status',
    writingPurpose: 'writingPurpose',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    outlineId: 'outlineId',
    styleProfileId: 'styleProfileId',
    targetAudienceIds: 'targetAudienceIds'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type StyleProfileWhereInput = {
    AND?: StyleProfileWhereInput | StyleProfileWhereInput[]
    OR?: StyleProfileWhereInput[]
    NOT?: StyleProfileWhereInput | StyleProfileWhereInput[]
    id?: StringFilter<"StyleProfile"> | string
    name?: StringFilter<"StyleProfile"> | string
    description?: StringNullableFilter<"StyleProfile"> | string | null
    authorInfo?: JsonNullableFilter<"StyleProfile">
    styleFeatures?: JsonNullableFilter<"StyleProfile">
    sampleText?: StringNullableFilter<"StyleProfile"> | string | null
    createdAt?: DateTimeFilter<"StyleProfile"> | Date | string
    updatedAt?: DateTimeFilter<"StyleProfile"> | Date | string
    outlines?: OutlineListRelationFilter
    articles?: ArticleListRelationFilter
  }

  export type StyleProfileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    authorInfo?: SortOrderInput | SortOrder
    styleFeatures?: SortOrderInput | SortOrder
    sampleText?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlines?: OutlineOrderByRelationAggregateInput
    articles?: ArticleOrderByRelationAggregateInput
  }

  export type StyleProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: StyleProfileWhereInput | StyleProfileWhereInput[]
    OR?: StyleProfileWhereInput[]
    NOT?: StyleProfileWhereInput | StyleProfileWhereInput[]
    description?: StringNullableFilter<"StyleProfile"> | string | null
    authorInfo?: JsonNullableFilter<"StyleProfile">
    styleFeatures?: JsonNullableFilter<"StyleProfile">
    sampleText?: StringNullableFilter<"StyleProfile"> | string | null
    createdAt?: DateTimeFilter<"StyleProfile"> | Date | string
    updatedAt?: DateTimeFilter<"StyleProfile"> | Date | string
    outlines?: OutlineListRelationFilter
    articles?: ArticleListRelationFilter
  }, "id" | "name">

  export type StyleProfileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    authorInfo?: SortOrderInput | SortOrder
    styleFeatures?: SortOrderInput | SortOrder
    sampleText?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StyleProfileCountOrderByAggregateInput
    _max?: StyleProfileMaxOrderByAggregateInput
    _min?: StyleProfileMinOrderByAggregateInput
  }

  export type StyleProfileScalarWhereWithAggregatesInput = {
    AND?: StyleProfileScalarWhereWithAggregatesInput | StyleProfileScalarWhereWithAggregatesInput[]
    OR?: StyleProfileScalarWhereWithAggregatesInput[]
    NOT?: StyleProfileScalarWhereWithAggregatesInput | StyleProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StyleProfile"> | string
    name?: StringWithAggregatesFilter<"StyleProfile"> | string
    description?: StringNullableWithAggregatesFilter<"StyleProfile"> | string | null
    authorInfo?: JsonNullableWithAggregatesFilter<"StyleProfile">
    styleFeatures?: JsonNullableWithAggregatesFilter<"StyleProfile">
    sampleText?: StringNullableWithAggregatesFilter<"StyleProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StyleProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StyleProfile"> | Date | string
  }

  export type AudienceWhereInput = {
    AND?: AudienceWhereInput | AudienceWhereInput[]
    OR?: AudienceWhereInput[]
    NOT?: AudienceWhereInput | AudienceWhereInput[]
    id?: StringFilter<"Audience"> | string
    name?: StringFilter<"Audience"> | string
    description?: StringNullableFilter<"Audience"> | string | null
    type?: StringNullableFilter<"Audience"> | string | null
    createdAt?: DateTimeFilter<"Audience"> | Date | string
    updatedAt?: DateTimeFilter<"Audience"> | Date | string
    outlineAudiences?: OutlineAudienceListRelationFilter
  }

  export type AudienceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlineAudiences?: OutlineAudienceOrderByRelationAggregateInput
  }

  export type AudienceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AudienceWhereInput | AudienceWhereInput[]
    OR?: AudienceWhereInput[]
    NOT?: AudienceWhereInput | AudienceWhereInput[]
    description?: StringNullableFilter<"Audience"> | string | null
    type?: StringNullableFilter<"Audience"> | string | null
    createdAt?: DateTimeFilter<"Audience"> | Date | string
    updatedAt?: DateTimeFilter<"Audience"> | Date | string
    outlineAudiences?: OutlineAudienceListRelationFilter
  }, "id" | "name">

  export type AudienceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AudienceCountOrderByAggregateInput
    _max?: AudienceMaxOrderByAggregateInput
    _min?: AudienceMinOrderByAggregateInput
  }

  export type AudienceScalarWhereWithAggregatesInput = {
    AND?: AudienceScalarWhereWithAggregatesInput | AudienceScalarWhereWithAggregatesInput[]
    OR?: AudienceScalarWhereWithAggregatesInput[]
    NOT?: AudienceScalarWhereWithAggregatesInput | AudienceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Audience"> | string
    name?: StringWithAggregatesFilter<"Audience"> | string
    description?: StringNullableWithAggregatesFilter<"Audience"> | string | null
    type?: StringNullableWithAggregatesFilter<"Audience"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Audience"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Audience"> | Date | string
  }

  export type OutlineWhereInput = {
    AND?: OutlineWhereInput | OutlineWhereInput[]
    OR?: OutlineWhereInput[]
    NOT?: OutlineWhereInput | OutlineWhereInput[]
    id?: StringFilter<"Outline"> | string
    title?: StringFilter<"Outline"> | string
    keyPoints?: StringNullableListFilter<"Outline">
    outlineText?: StringFilter<"Outline"> | string
    createdAt?: DateTimeFilter<"Outline"> | Date | string
    updatedAt?: DateTimeFilter<"Outline"> | Date | string
    styleProfileId?: StringNullableFilter<"Outline"> | string | null
    styleProfile?: XOR<StyleProfileNullableScalarRelationFilter, StyleProfileWhereInput> | null
    outlineAudiences?: OutlineAudienceListRelationFilter
    articles?: ArticleListRelationFilter
  }

  export type OutlineOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    keyPoints?: SortOrder
    outlineText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    styleProfileId?: SortOrderInput | SortOrder
    styleProfile?: StyleProfileOrderByWithRelationInput
    outlineAudiences?: OutlineAudienceOrderByRelationAggregateInput
    articles?: ArticleOrderByRelationAggregateInput
  }

  export type OutlineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OutlineWhereInput | OutlineWhereInput[]
    OR?: OutlineWhereInput[]
    NOT?: OutlineWhereInput | OutlineWhereInput[]
    title?: StringFilter<"Outline"> | string
    keyPoints?: StringNullableListFilter<"Outline">
    outlineText?: StringFilter<"Outline"> | string
    createdAt?: DateTimeFilter<"Outline"> | Date | string
    updatedAt?: DateTimeFilter<"Outline"> | Date | string
    styleProfileId?: StringNullableFilter<"Outline"> | string | null
    styleProfile?: XOR<StyleProfileNullableScalarRelationFilter, StyleProfileWhereInput> | null
    outlineAudiences?: OutlineAudienceListRelationFilter
    articles?: ArticleListRelationFilter
  }, "id">

  export type OutlineOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    keyPoints?: SortOrder
    outlineText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    styleProfileId?: SortOrderInput | SortOrder
    _count?: OutlineCountOrderByAggregateInput
    _max?: OutlineMaxOrderByAggregateInput
    _min?: OutlineMinOrderByAggregateInput
  }

  export type OutlineScalarWhereWithAggregatesInput = {
    AND?: OutlineScalarWhereWithAggregatesInput | OutlineScalarWhereWithAggregatesInput[]
    OR?: OutlineScalarWhereWithAggregatesInput[]
    NOT?: OutlineScalarWhereWithAggregatesInput | OutlineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Outline"> | string
    title?: StringWithAggregatesFilter<"Outline"> | string
    keyPoints?: StringNullableListFilter<"Outline">
    outlineText?: StringWithAggregatesFilter<"Outline"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Outline"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Outline"> | Date | string
    styleProfileId?: StringNullableWithAggregatesFilter<"Outline"> | string | null
  }

  export type OutlineAudienceWhereInput = {
    AND?: OutlineAudienceWhereInput | OutlineAudienceWhereInput[]
    OR?: OutlineAudienceWhereInput[]
    NOT?: OutlineAudienceWhereInput | OutlineAudienceWhereInput[]
    outlineId?: StringFilter<"OutlineAudience"> | string
    audienceId?: StringFilter<"OutlineAudience"> | string
    assignedAt?: DateTimeFilter<"OutlineAudience"> | Date | string
    outline?: XOR<OutlineScalarRelationFilter, OutlineWhereInput>
    audience?: XOR<AudienceScalarRelationFilter, AudienceWhereInput>
  }

  export type OutlineAudienceOrderByWithRelationInput = {
    outlineId?: SortOrder
    audienceId?: SortOrder
    assignedAt?: SortOrder
    outline?: OutlineOrderByWithRelationInput
    audience?: AudienceOrderByWithRelationInput
  }

  export type OutlineAudienceWhereUniqueInput = Prisma.AtLeast<{
    outlineId_audienceId?: OutlineAudienceOutlineIdAudienceIdCompoundUniqueInput
    AND?: OutlineAudienceWhereInput | OutlineAudienceWhereInput[]
    OR?: OutlineAudienceWhereInput[]
    NOT?: OutlineAudienceWhereInput | OutlineAudienceWhereInput[]
    outlineId?: StringFilter<"OutlineAudience"> | string
    audienceId?: StringFilter<"OutlineAudience"> | string
    assignedAt?: DateTimeFilter<"OutlineAudience"> | Date | string
    outline?: XOR<OutlineScalarRelationFilter, OutlineWhereInput>
    audience?: XOR<AudienceScalarRelationFilter, AudienceWhereInput>
  }, "outlineId_audienceId">

  export type OutlineAudienceOrderByWithAggregationInput = {
    outlineId?: SortOrder
    audienceId?: SortOrder
    assignedAt?: SortOrder
    _count?: OutlineAudienceCountOrderByAggregateInput
    _max?: OutlineAudienceMaxOrderByAggregateInput
    _min?: OutlineAudienceMinOrderByAggregateInput
  }

  export type OutlineAudienceScalarWhereWithAggregatesInput = {
    AND?: OutlineAudienceScalarWhereWithAggregatesInput | OutlineAudienceScalarWhereWithAggregatesInput[]
    OR?: OutlineAudienceScalarWhereWithAggregatesInput[]
    NOT?: OutlineAudienceScalarWhereWithAggregatesInput | OutlineAudienceScalarWhereWithAggregatesInput[]
    outlineId?: StringWithAggregatesFilter<"OutlineAudience"> | string
    audienceId?: StringWithAggregatesFilter<"OutlineAudience"> | string
    assignedAt?: DateTimeWithAggregatesFilter<"OutlineAudience"> | Date | string
  }

  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    structuredContent?: JsonNullableFilter<"Article">
    status?: StringFilter<"Article"> | string
    writingPurpose?: StringNullableListFilter<"Article">
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    outlineId?: StringFilter<"Article"> | string
    styleProfileId?: StringFilter<"Article"> | string
    targetAudienceIds?: StringNullableListFilter<"Article">
    outline?: XOR<OutlineScalarRelationFilter, OutlineWhereInput>
    styleProfile?: XOR<StyleProfileScalarRelationFilter, StyleProfileWhereInput>
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    structuredContent?: SortOrderInput | SortOrder
    status?: SortOrder
    writingPurpose?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlineId?: SortOrder
    styleProfileId?: SortOrder
    targetAudienceIds?: SortOrder
    outline?: OutlineOrderByWithRelationInput
    styleProfile?: StyleProfileOrderByWithRelationInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    structuredContent?: JsonNullableFilter<"Article">
    status?: StringFilter<"Article"> | string
    writingPurpose?: StringNullableListFilter<"Article">
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    outlineId?: StringFilter<"Article"> | string
    styleProfileId?: StringFilter<"Article"> | string
    targetAudienceIds?: StringNullableListFilter<"Article">
    outline?: XOR<OutlineScalarRelationFilter, OutlineWhereInput>
    styleProfile?: XOR<StyleProfileScalarRelationFilter, StyleProfileWhereInput>
  }, "id">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    structuredContent?: SortOrderInput | SortOrder
    status?: SortOrder
    writingPurpose?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlineId?: SortOrder
    styleProfileId?: SortOrder
    targetAudienceIds?: SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Article"> | string
    title?: StringWithAggregatesFilter<"Article"> | string
    content?: StringWithAggregatesFilter<"Article"> | string
    structuredContent?: JsonNullableWithAggregatesFilter<"Article">
    status?: StringWithAggregatesFilter<"Article"> | string
    writingPurpose?: StringNullableListFilter<"Article">
    createdAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    outlineId?: StringWithAggregatesFilter<"Article"> | string
    styleProfileId?: StringWithAggregatesFilter<"Article"> | string
    targetAudienceIds?: StringNullableListFilter<"Article">
  }

  export type StyleProfileCreateInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    outlines?: OutlineCreateNestedManyWithoutStyleProfileInput
    articles?: ArticleCreateNestedManyWithoutStyleProfileInput
  }

  export type StyleProfileUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    outlines?: OutlineUncheckedCreateNestedManyWithoutStyleProfileInput
    articles?: ArticleUncheckedCreateNestedManyWithoutStyleProfileInput
  }

  export type StyleProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlines?: OutlineUpdateManyWithoutStyleProfileNestedInput
    articles?: ArticleUpdateManyWithoutStyleProfileNestedInput
  }

  export type StyleProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlines?: OutlineUncheckedUpdateManyWithoutStyleProfileNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutStyleProfileNestedInput
  }

  export type StyleProfileCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StyleProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StyleProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudienceCreateInput = {
    id?: string
    name: string
    description?: string | null
    type?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineAudiences?: OutlineAudienceCreateNestedManyWithoutAudienceInput
  }

  export type AudienceUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    type?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineAudiences?: OutlineAudienceUncheckedCreateNestedManyWithoutAudienceInput
  }

  export type AudienceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineAudiences?: OutlineAudienceUpdateManyWithoutAudienceNestedInput
  }

  export type AudienceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineAudiences?: OutlineAudienceUncheckedUpdateManyWithoutAudienceNestedInput
  }

  export type AudienceCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    type?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AudienceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudienceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineCreateInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfile?: StyleProfileCreateNestedOneWithoutOutlinesInput
    outlineAudiences?: OutlineAudienceCreateNestedManyWithoutOutlineInput
    articles?: ArticleCreateNestedManyWithoutOutlineInput
  }

  export type OutlineUncheckedCreateInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfileId?: string | null
    outlineAudiences?: OutlineAudienceUncheckedCreateNestedManyWithoutOutlineInput
    articles?: ArticleUncheckedCreateNestedManyWithoutOutlineInput
  }

  export type OutlineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfile?: StyleProfileUpdateOneWithoutOutlinesNestedInput
    outlineAudiences?: OutlineAudienceUpdateManyWithoutOutlineNestedInput
    articles?: ArticleUpdateManyWithoutOutlineNestedInput
  }

  export type OutlineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    outlineAudiences?: OutlineAudienceUncheckedUpdateManyWithoutOutlineNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutOutlineNestedInput
  }

  export type OutlineCreateManyInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfileId?: string | null
  }

  export type OutlineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfileId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type OutlineAudienceCreateInput = {
    assignedAt?: Date | string
    outline: OutlineCreateNestedOneWithoutOutlineAudiencesInput
    audience: AudienceCreateNestedOneWithoutOutlineAudiencesInput
  }

  export type OutlineAudienceUncheckedCreateInput = {
    outlineId: string
    audienceId: string
    assignedAt?: Date | string
  }

  export type OutlineAudienceUpdateInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outline?: OutlineUpdateOneRequiredWithoutOutlineAudiencesNestedInput
    audience?: AudienceUpdateOneRequiredWithoutOutlineAudiencesNestedInput
  }

  export type OutlineAudienceUncheckedUpdateInput = {
    outlineId?: StringFieldUpdateOperationsInput | string
    audienceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineAudienceCreateManyInput = {
    outlineId: string
    audienceId: string
    assignedAt?: Date | string
  }

  export type OutlineAudienceUpdateManyMutationInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineAudienceUncheckedUpdateManyInput = {
    outlineId?: StringFieldUpdateOperationsInput | string
    audienceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCreateInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
    outline: OutlineCreateNestedOneWithoutArticlesInput
    styleProfile: StyleProfileCreateNestedOneWithoutArticlesInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineId: string
    styleProfileId: string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
  }

  export type ArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
    outline?: OutlineUpdateOneRequiredWithoutArticlesNestedInput
    styleProfile?: StyleProfileUpdateOneRequiredWithoutArticlesNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineId?: StringFieldUpdateOperationsInput | string
    styleProfileId?: StringFieldUpdateOperationsInput | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }

  export type ArticleCreateManyInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineId: string
    styleProfileId: string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
  }

  export type ArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineId?: StringFieldUpdateOperationsInput | string
    styleProfileId?: StringFieldUpdateOperationsInput | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OutlineListRelationFilter = {
    every?: OutlineWhereInput
    some?: OutlineWhereInput
    none?: OutlineWhereInput
  }

  export type ArticleListRelationFilter = {
    every?: ArticleWhereInput
    some?: ArticleWhereInput
    none?: ArticleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OutlineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StyleProfileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorInfo?: SortOrder
    styleFeatures?: SortOrder
    sampleText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StyleProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    sampleText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StyleProfileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    sampleText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OutlineAudienceListRelationFilter = {
    every?: OutlineAudienceWhereInput
    some?: OutlineAudienceWhereInput
    none?: OutlineAudienceWhereInput
  }

  export type OutlineAudienceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AudienceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AudienceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AudienceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type StyleProfileNullableScalarRelationFilter = {
    is?: StyleProfileWhereInput | null
    isNot?: StyleProfileWhereInput | null
  }

  export type OutlineCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    keyPoints?: SortOrder
    outlineText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    styleProfileId?: SortOrder
  }

  export type OutlineMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    outlineText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    styleProfileId?: SortOrder
  }

  export type OutlineMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    outlineText?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    styleProfileId?: SortOrder
  }

  export type OutlineScalarRelationFilter = {
    is?: OutlineWhereInput
    isNot?: OutlineWhereInput
  }

  export type AudienceScalarRelationFilter = {
    is?: AudienceWhereInput
    isNot?: AudienceWhereInput
  }

  export type OutlineAudienceOutlineIdAudienceIdCompoundUniqueInput = {
    outlineId: string
    audienceId: string
  }

  export type OutlineAudienceCountOrderByAggregateInput = {
    outlineId?: SortOrder
    audienceId?: SortOrder
    assignedAt?: SortOrder
  }

  export type OutlineAudienceMaxOrderByAggregateInput = {
    outlineId?: SortOrder
    audienceId?: SortOrder
    assignedAt?: SortOrder
  }

  export type OutlineAudienceMinOrderByAggregateInput = {
    outlineId?: SortOrder
    audienceId?: SortOrder
    assignedAt?: SortOrder
  }

  export type StyleProfileScalarRelationFilter = {
    is?: StyleProfileWhereInput
    isNot?: StyleProfileWhereInput
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    structuredContent?: SortOrder
    status?: SortOrder
    writingPurpose?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlineId?: SortOrder
    styleProfileId?: SortOrder
    targetAudienceIds?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlineId?: SortOrder
    styleProfileId?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    outlineId?: SortOrder
    styleProfileId?: SortOrder
  }

  export type OutlineCreateNestedManyWithoutStyleProfileInput = {
    create?: XOR<OutlineCreateWithoutStyleProfileInput, OutlineUncheckedCreateWithoutStyleProfileInput> | OutlineCreateWithoutStyleProfileInput[] | OutlineUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: OutlineCreateOrConnectWithoutStyleProfileInput | OutlineCreateOrConnectWithoutStyleProfileInput[]
    createMany?: OutlineCreateManyStyleProfileInputEnvelope
    connect?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
  }

  export type ArticleCreateNestedManyWithoutStyleProfileInput = {
    create?: XOR<ArticleCreateWithoutStyleProfileInput, ArticleUncheckedCreateWithoutStyleProfileInput> | ArticleCreateWithoutStyleProfileInput[] | ArticleUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutStyleProfileInput | ArticleCreateOrConnectWithoutStyleProfileInput[]
    createMany?: ArticleCreateManyStyleProfileInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type OutlineUncheckedCreateNestedManyWithoutStyleProfileInput = {
    create?: XOR<OutlineCreateWithoutStyleProfileInput, OutlineUncheckedCreateWithoutStyleProfileInput> | OutlineCreateWithoutStyleProfileInput[] | OutlineUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: OutlineCreateOrConnectWithoutStyleProfileInput | OutlineCreateOrConnectWithoutStyleProfileInput[]
    createMany?: OutlineCreateManyStyleProfileInputEnvelope
    connect?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutStyleProfileInput = {
    create?: XOR<ArticleCreateWithoutStyleProfileInput, ArticleUncheckedCreateWithoutStyleProfileInput> | ArticleCreateWithoutStyleProfileInput[] | ArticleUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutStyleProfileInput | ArticleCreateOrConnectWithoutStyleProfileInput[]
    createMany?: ArticleCreateManyStyleProfileInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OutlineUpdateManyWithoutStyleProfileNestedInput = {
    create?: XOR<OutlineCreateWithoutStyleProfileInput, OutlineUncheckedCreateWithoutStyleProfileInput> | OutlineCreateWithoutStyleProfileInput[] | OutlineUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: OutlineCreateOrConnectWithoutStyleProfileInput | OutlineCreateOrConnectWithoutStyleProfileInput[]
    upsert?: OutlineUpsertWithWhereUniqueWithoutStyleProfileInput | OutlineUpsertWithWhereUniqueWithoutStyleProfileInput[]
    createMany?: OutlineCreateManyStyleProfileInputEnvelope
    set?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    disconnect?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    delete?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    connect?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    update?: OutlineUpdateWithWhereUniqueWithoutStyleProfileInput | OutlineUpdateWithWhereUniqueWithoutStyleProfileInput[]
    updateMany?: OutlineUpdateManyWithWhereWithoutStyleProfileInput | OutlineUpdateManyWithWhereWithoutStyleProfileInput[]
    deleteMany?: OutlineScalarWhereInput | OutlineScalarWhereInput[]
  }

  export type ArticleUpdateManyWithoutStyleProfileNestedInput = {
    create?: XOR<ArticleCreateWithoutStyleProfileInput, ArticleUncheckedCreateWithoutStyleProfileInput> | ArticleCreateWithoutStyleProfileInput[] | ArticleUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutStyleProfileInput | ArticleCreateOrConnectWithoutStyleProfileInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutStyleProfileInput | ArticleUpsertWithWhereUniqueWithoutStyleProfileInput[]
    createMany?: ArticleCreateManyStyleProfileInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutStyleProfileInput | ArticleUpdateWithWhereUniqueWithoutStyleProfileInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutStyleProfileInput | ArticleUpdateManyWithWhereWithoutStyleProfileInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type OutlineUncheckedUpdateManyWithoutStyleProfileNestedInput = {
    create?: XOR<OutlineCreateWithoutStyleProfileInput, OutlineUncheckedCreateWithoutStyleProfileInput> | OutlineCreateWithoutStyleProfileInput[] | OutlineUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: OutlineCreateOrConnectWithoutStyleProfileInput | OutlineCreateOrConnectWithoutStyleProfileInput[]
    upsert?: OutlineUpsertWithWhereUniqueWithoutStyleProfileInput | OutlineUpsertWithWhereUniqueWithoutStyleProfileInput[]
    createMany?: OutlineCreateManyStyleProfileInputEnvelope
    set?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    disconnect?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    delete?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    connect?: OutlineWhereUniqueInput | OutlineWhereUniqueInput[]
    update?: OutlineUpdateWithWhereUniqueWithoutStyleProfileInput | OutlineUpdateWithWhereUniqueWithoutStyleProfileInput[]
    updateMany?: OutlineUpdateManyWithWhereWithoutStyleProfileInput | OutlineUpdateManyWithWhereWithoutStyleProfileInput[]
    deleteMany?: OutlineScalarWhereInput | OutlineScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutStyleProfileNestedInput = {
    create?: XOR<ArticleCreateWithoutStyleProfileInput, ArticleUncheckedCreateWithoutStyleProfileInput> | ArticleCreateWithoutStyleProfileInput[] | ArticleUncheckedCreateWithoutStyleProfileInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutStyleProfileInput | ArticleCreateOrConnectWithoutStyleProfileInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutStyleProfileInput | ArticleUpsertWithWhereUniqueWithoutStyleProfileInput[]
    createMany?: ArticleCreateManyStyleProfileInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutStyleProfileInput | ArticleUpdateWithWhereUniqueWithoutStyleProfileInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutStyleProfileInput | ArticleUpdateManyWithWhereWithoutStyleProfileInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type OutlineAudienceCreateNestedManyWithoutAudienceInput = {
    create?: XOR<OutlineAudienceCreateWithoutAudienceInput, OutlineAudienceUncheckedCreateWithoutAudienceInput> | OutlineAudienceCreateWithoutAudienceInput[] | OutlineAudienceUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutAudienceInput | OutlineAudienceCreateOrConnectWithoutAudienceInput[]
    createMany?: OutlineAudienceCreateManyAudienceInputEnvelope
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
  }

  export type OutlineAudienceUncheckedCreateNestedManyWithoutAudienceInput = {
    create?: XOR<OutlineAudienceCreateWithoutAudienceInput, OutlineAudienceUncheckedCreateWithoutAudienceInput> | OutlineAudienceCreateWithoutAudienceInput[] | OutlineAudienceUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutAudienceInput | OutlineAudienceCreateOrConnectWithoutAudienceInput[]
    createMany?: OutlineAudienceCreateManyAudienceInputEnvelope
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
  }

  export type OutlineAudienceUpdateManyWithoutAudienceNestedInput = {
    create?: XOR<OutlineAudienceCreateWithoutAudienceInput, OutlineAudienceUncheckedCreateWithoutAudienceInput> | OutlineAudienceCreateWithoutAudienceInput[] | OutlineAudienceUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutAudienceInput | OutlineAudienceCreateOrConnectWithoutAudienceInput[]
    upsert?: OutlineAudienceUpsertWithWhereUniqueWithoutAudienceInput | OutlineAudienceUpsertWithWhereUniqueWithoutAudienceInput[]
    createMany?: OutlineAudienceCreateManyAudienceInputEnvelope
    set?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    disconnect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    delete?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    update?: OutlineAudienceUpdateWithWhereUniqueWithoutAudienceInput | OutlineAudienceUpdateWithWhereUniqueWithoutAudienceInput[]
    updateMany?: OutlineAudienceUpdateManyWithWhereWithoutAudienceInput | OutlineAudienceUpdateManyWithWhereWithoutAudienceInput[]
    deleteMany?: OutlineAudienceScalarWhereInput | OutlineAudienceScalarWhereInput[]
  }

  export type OutlineAudienceUncheckedUpdateManyWithoutAudienceNestedInput = {
    create?: XOR<OutlineAudienceCreateWithoutAudienceInput, OutlineAudienceUncheckedCreateWithoutAudienceInput> | OutlineAudienceCreateWithoutAudienceInput[] | OutlineAudienceUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutAudienceInput | OutlineAudienceCreateOrConnectWithoutAudienceInput[]
    upsert?: OutlineAudienceUpsertWithWhereUniqueWithoutAudienceInput | OutlineAudienceUpsertWithWhereUniqueWithoutAudienceInput[]
    createMany?: OutlineAudienceCreateManyAudienceInputEnvelope
    set?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    disconnect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    delete?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    update?: OutlineAudienceUpdateWithWhereUniqueWithoutAudienceInput | OutlineAudienceUpdateWithWhereUniqueWithoutAudienceInput[]
    updateMany?: OutlineAudienceUpdateManyWithWhereWithoutAudienceInput | OutlineAudienceUpdateManyWithWhereWithoutAudienceInput[]
    deleteMany?: OutlineAudienceScalarWhereInput | OutlineAudienceScalarWhereInput[]
  }

  export type OutlineCreatekeyPointsInput = {
    set: string[]
  }

  export type StyleProfileCreateNestedOneWithoutOutlinesInput = {
    create?: XOR<StyleProfileCreateWithoutOutlinesInput, StyleProfileUncheckedCreateWithoutOutlinesInput>
    connectOrCreate?: StyleProfileCreateOrConnectWithoutOutlinesInput
    connect?: StyleProfileWhereUniqueInput
  }

  export type OutlineAudienceCreateNestedManyWithoutOutlineInput = {
    create?: XOR<OutlineAudienceCreateWithoutOutlineInput, OutlineAudienceUncheckedCreateWithoutOutlineInput> | OutlineAudienceCreateWithoutOutlineInput[] | OutlineAudienceUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutOutlineInput | OutlineAudienceCreateOrConnectWithoutOutlineInput[]
    createMany?: OutlineAudienceCreateManyOutlineInputEnvelope
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
  }

  export type ArticleCreateNestedManyWithoutOutlineInput = {
    create?: XOR<ArticleCreateWithoutOutlineInput, ArticleUncheckedCreateWithoutOutlineInput> | ArticleCreateWithoutOutlineInput[] | ArticleUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutOutlineInput | ArticleCreateOrConnectWithoutOutlineInput[]
    createMany?: ArticleCreateManyOutlineInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type OutlineAudienceUncheckedCreateNestedManyWithoutOutlineInput = {
    create?: XOR<OutlineAudienceCreateWithoutOutlineInput, OutlineAudienceUncheckedCreateWithoutOutlineInput> | OutlineAudienceCreateWithoutOutlineInput[] | OutlineAudienceUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutOutlineInput | OutlineAudienceCreateOrConnectWithoutOutlineInput[]
    createMany?: OutlineAudienceCreateManyOutlineInputEnvelope
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutOutlineInput = {
    create?: XOR<ArticleCreateWithoutOutlineInput, ArticleUncheckedCreateWithoutOutlineInput> | ArticleCreateWithoutOutlineInput[] | ArticleUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutOutlineInput | ArticleCreateOrConnectWithoutOutlineInput[]
    createMany?: ArticleCreateManyOutlineInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type OutlineUpdatekeyPointsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type StyleProfileUpdateOneWithoutOutlinesNestedInput = {
    create?: XOR<StyleProfileCreateWithoutOutlinesInput, StyleProfileUncheckedCreateWithoutOutlinesInput>
    connectOrCreate?: StyleProfileCreateOrConnectWithoutOutlinesInput
    upsert?: StyleProfileUpsertWithoutOutlinesInput
    disconnect?: StyleProfileWhereInput | boolean
    delete?: StyleProfileWhereInput | boolean
    connect?: StyleProfileWhereUniqueInput
    update?: XOR<XOR<StyleProfileUpdateToOneWithWhereWithoutOutlinesInput, StyleProfileUpdateWithoutOutlinesInput>, StyleProfileUncheckedUpdateWithoutOutlinesInput>
  }

  export type OutlineAudienceUpdateManyWithoutOutlineNestedInput = {
    create?: XOR<OutlineAudienceCreateWithoutOutlineInput, OutlineAudienceUncheckedCreateWithoutOutlineInput> | OutlineAudienceCreateWithoutOutlineInput[] | OutlineAudienceUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutOutlineInput | OutlineAudienceCreateOrConnectWithoutOutlineInput[]
    upsert?: OutlineAudienceUpsertWithWhereUniqueWithoutOutlineInput | OutlineAudienceUpsertWithWhereUniqueWithoutOutlineInput[]
    createMany?: OutlineAudienceCreateManyOutlineInputEnvelope
    set?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    disconnect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    delete?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    update?: OutlineAudienceUpdateWithWhereUniqueWithoutOutlineInput | OutlineAudienceUpdateWithWhereUniqueWithoutOutlineInput[]
    updateMany?: OutlineAudienceUpdateManyWithWhereWithoutOutlineInput | OutlineAudienceUpdateManyWithWhereWithoutOutlineInput[]
    deleteMany?: OutlineAudienceScalarWhereInput | OutlineAudienceScalarWhereInput[]
  }

  export type ArticleUpdateManyWithoutOutlineNestedInput = {
    create?: XOR<ArticleCreateWithoutOutlineInput, ArticleUncheckedCreateWithoutOutlineInput> | ArticleCreateWithoutOutlineInput[] | ArticleUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutOutlineInput | ArticleCreateOrConnectWithoutOutlineInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutOutlineInput | ArticleUpsertWithWhereUniqueWithoutOutlineInput[]
    createMany?: ArticleCreateManyOutlineInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutOutlineInput | ArticleUpdateWithWhereUniqueWithoutOutlineInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutOutlineInput | ArticleUpdateManyWithWhereWithoutOutlineInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type OutlineAudienceUncheckedUpdateManyWithoutOutlineNestedInput = {
    create?: XOR<OutlineAudienceCreateWithoutOutlineInput, OutlineAudienceUncheckedCreateWithoutOutlineInput> | OutlineAudienceCreateWithoutOutlineInput[] | OutlineAudienceUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: OutlineAudienceCreateOrConnectWithoutOutlineInput | OutlineAudienceCreateOrConnectWithoutOutlineInput[]
    upsert?: OutlineAudienceUpsertWithWhereUniqueWithoutOutlineInput | OutlineAudienceUpsertWithWhereUniqueWithoutOutlineInput[]
    createMany?: OutlineAudienceCreateManyOutlineInputEnvelope
    set?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    disconnect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    delete?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    connect?: OutlineAudienceWhereUniqueInput | OutlineAudienceWhereUniqueInput[]
    update?: OutlineAudienceUpdateWithWhereUniqueWithoutOutlineInput | OutlineAudienceUpdateWithWhereUniqueWithoutOutlineInput[]
    updateMany?: OutlineAudienceUpdateManyWithWhereWithoutOutlineInput | OutlineAudienceUpdateManyWithWhereWithoutOutlineInput[]
    deleteMany?: OutlineAudienceScalarWhereInput | OutlineAudienceScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutOutlineNestedInput = {
    create?: XOR<ArticleCreateWithoutOutlineInput, ArticleUncheckedCreateWithoutOutlineInput> | ArticleCreateWithoutOutlineInput[] | ArticleUncheckedCreateWithoutOutlineInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutOutlineInput | ArticleCreateOrConnectWithoutOutlineInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutOutlineInput | ArticleUpsertWithWhereUniqueWithoutOutlineInput[]
    createMany?: ArticleCreateManyOutlineInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutOutlineInput | ArticleUpdateWithWhereUniqueWithoutOutlineInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutOutlineInput | ArticleUpdateManyWithWhereWithoutOutlineInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type OutlineCreateNestedOneWithoutOutlineAudiencesInput = {
    create?: XOR<OutlineCreateWithoutOutlineAudiencesInput, OutlineUncheckedCreateWithoutOutlineAudiencesInput>
    connectOrCreate?: OutlineCreateOrConnectWithoutOutlineAudiencesInput
    connect?: OutlineWhereUniqueInput
  }

  export type AudienceCreateNestedOneWithoutOutlineAudiencesInput = {
    create?: XOR<AudienceCreateWithoutOutlineAudiencesInput, AudienceUncheckedCreateWithoutOutlineAudiencesInput>
    connectOrCreate?: AudienceCreateOrConnectWithoutOutlineAudiencesInput
    connect?: AudienceWhereUniqueInput
  }

  export type OutlineUpdateOneRequiredWithoutOutlineAudiencesNestedInput = {
    create?: XOR<OutlineCreateWithoutOutlineAudiencesInput, OutlineUncheckedCreateWithoutOutlineAudiencesInput>
    connectOrCreate?: OutlineCreateOrConnectWithoutOutlineAudiencesInput
    upsert?: OutlineUpsertWithoutOutlineAudiencesInput
    connect?: OutlineWhereUniqueInput
    update?: XOR<XOR<OutlineUpdateToOneWithWhereWithoutOutlineAudiencesInput, OutlineUpdateWithoutOutlineAudiencesInput>, OutlineUncheckedUpdateWithoutOutlineAudiencesInput>
  }

  export type AudienceUpdateOneRequiredWithoutOutlineAudiencesNestedInput = {
    create?: XOR<AudienceCreateWithoutOutlineAudiencesInput, AudienceUncheckedCreateWithoutOutlineAudiencesInput>
    connectOrCreate?: AudienceCreateOrConnectWithoutOutlineAudiencesInput
    upsert?: AudienceUpsertWithoutOutlineAudiencesInput
    connect?: AudienceWhereUniqueInput
    update?: XOR<XOR<AudienceUpdateToOneWithWhereWithoutOutlineAudiencesInput, AudienceUpdateWithoutOutlineAudiencesInput>, AudienceUncheckedUpdateWithoutOutlineAudiencesInput>
  }

  export type ArticleCreatewritingPurposeInput = {
    set: string[]
  }

  export type ArticleCreatetargetAudienceIdsInput = {
    set: string[]
  }

  export type OutlineCreateNestedOneWithoutArticlesInput = {
    create?: XOR<OutlineCreateWithoutArticlesInput, OutlineUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: OutlineCreateOrConnectWithoutArticlesInput
    connect?: OutlineWhereUniqueInput
  }

  export type StyleProfileCreateNestedOneWithoutArticlesInput = {
    create?: XOR<StyleProfileCreateWithoutArticlesInput, StyleProfileUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: StyleProfileCreateOrConnectWithoutArticlesInput
    connect?: StyleProfileWhereUniqueInput
  }

  export type ArticleUpdatewritingPurposeInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ArticleUpdatetargetAudienceIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type OutlineUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: XOR<OutlineCreateWithoutArticlesInput, OutlineUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: OutlineCreateOrConnectWithoutArticlesInput
    upsert?: OutlineUpsertWithoutArticlesInput
    connect?: OutlineWhereUniqueInput
    update?: XOR<XOR<OutlineUpdateToOneWithWhereWithoutArticlesInput, OutlineUpdateWithoutArticlesInput>, OutlineUncheckedUpdateWithoutArticlesInput>
  }

  export type StyleProfileUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: XOR<StyleProfileCreateWithoutArticlesInput, StyleProfileUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: StyleProfileCreateOrConnectWithoutArticlesInput
    upsert?: StyleProfileUpsertWithoutArticlesInput
    connect?: StyleProfileWhereUniqueInput
    update?: XOR<XOR<StyleProfileUpdateToOneWithWhereWithoutArticlesInput, StyleProfileUpdateWithoutArticlesInput>, StyleProfileUncheckedUpdateWithoutArticlesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OutlineCreateWithoutStyleProfileInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineAudiences?: OutlineAudienceCreateNestedManyWithoutOutlineInput
    articles?: ArticleCreateNestedManyWithoutOutlineInput
  }

  export type OutlineUncheckedCreateWithoutStyleProfileInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineAudiences?: OutlineAudienceUncheckedCreateNestedManyWithoutOutlineInput
    articles?: ArticleUncheckedCreateNestedManyWithoutOutlineInput
  }

  export type OutlineCreateOrConnectWithoutStyleProfileInput = {
    where: OutlineWhereUniqueInput
    create: XOR<OutlineCreateWithoutStyleProfileInput, OutlineUncheckedCreateWithoutStyleProfileInput>
  }

  export type OutlineCreateManyStyleProfileInputEnvelope = {
    data: OutlineCreateManyStyleProfileInput | OutlineCreateManyStyleProfileInput[]
    skipDuplicates?: boolean
  }

  export type ArticleCreateWithoutStyleProfileInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
    outline: OutlineCreateNestedOneWithoutArticlesInput
  }

  export type ArticleUncheckedCreateWithoutStyleProfileInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineId: string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
  }

  export type ArticleCreateOrConnectWithoutStyleProfileInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutStyleProfileInput, ArticleUncheckedCreateWithoutStyleProfileInput>
  }

  export type ArticleCreateManyStyleProfileInputEnvelope = {
    data: ArticleCreateManyStyleProfileInput | ArticleCreateManyStyleProfileInput[]
    skipDuplicates?: boolean
  }

  export type OutlineUpsertWithWhereUniqueWithoutStyleProfileInput = {
    where: OutlineWhereUniqueInput
    update: XOR<OutlineUpdateWithoutStyleProfileInput, OutlineUncheckedUpdateWithoutStyleProfileInput>
    create: XOR<OutlineCreateWithoutStyleProfileInput, OutlineUncheckedCreateWithoutStyleProfileInput>
  }

  export type OutlineUpdateWithWhereUniqueWithoutStyleProfileInput = {
    where: OutlineWhereUniqueInput
    data: XOR<OutlineUpdateWithoutStyleProfileInput, OutlineUncheckedUpdateWithoutStyleProfileInput>
  }

  export type OutlineUpdateManyWithWhereWithoutStyleProfileInput = {
    where: OutlineScalarWhereInput
    data: XOR<OutlineUpdateManyMutationInput, OutlineUncheckedUpdateManyWithoutStyleProfileInput>
  }

  export type OutlineScalarWhereInput = {
    AND?: OutlineScalarWhereInput | OutlineScalarWhereInput[]
    OR?: OutlineScalarWhereInput[]
    NOT?: OutlineScalarWhereInput | OutlineScalarWhereInput[]
    id?: StringFilter<"Outline"> | string
    title?: StringFilter<"Outline"> | string
    keyPoints?: StringNullableListFilter<"Outline">
    outlineText?: StringFilter<"Outline"> | string
    createdAt?: DateTimeFilter<"Outline"> | Date | string
    updatedAt?: DateTimeFilter<"Outline"> | Date | string
    styleProfileId?: StringNullableFilter<"Outline"> | string | null
  }

  export type ArticleUpsertWithWhereUniqueWithoutStyleProfileInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutStyleProfileInput, ArticleUncheckedUpdateWithoutStyleProfileInput>
    create: XOR<ArticleCreateWithoutStyleProfileInput, ArticleUncheckedCreateWithoutStyleProfileInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutStyleProfileInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutStyleProfileInput, ArticleUncheckedUpdateWithoutStyleProfileInput>
  }

  export type ArticleUpdateManyWithWhereWithoutStyleProfileInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutStyleProfileInput>
  }

  export type ArticleScalarWhereInput = {
    AND?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    OR?: ArticleScalarWhereInput[]
    NOT?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    structuredContent?: JsonNullableFilter<"Article">
    status?: StringFilter<"Article"> | string
    writingPurpose?: StringNullableListFilter<"Article">
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    outlineId?: StringFilter<"Article"> | string
    styleProfileId?: StringFilter<"Article"> | string
    targetAudienceIds?: StringNullableListFilter<"Article">
  }

  export type OutlineAudienceCreateWithoutAudienceInput = {
    assignedAt?: Date | string
    outline: OutlineCreateNestedOneWithoutOutlineAudiencesInput
  }

  export type OutlineAudienceUncheckedCreateWithoutAudienceInput = {
    outlineId: string
    assignedAt?: Date | string
  }

  export type OutlineAudienceCreateOrConnectWithoutAudienceInput = {
    where: OutlineAudienceWhereUniqueInput
    create: XOR<OutlineAudienceCreateWithoutAudienceInput, OutlineAudienceUncheckedCreateWithoutAudienceInput>
  }

  export type OutlineAudienceCreateManyAudienceInputEnvelope = {
    data: OutlineAudienceCreateManyAudienceInput | OutlineAudienceCreateManyAudienceInput[]
    skipDuplicates?: boolean
  }

  export type OutlineAudienceUpsertWithWhereUniqueWithoutAudienceInput = {
    where: OutlineAudienceWhereUniqueInput
    update: XOR<OutlineAudienceUpdateWithoutAudienceInput, OutlineAudienceUncheckedUpdateWithoutAudienceInput>
    create: XOR<OutlineAudienceCreateWithoutAudienceInput, OutlineAudienceUncheckedCreateWithoutAudienceInput>
  }

  export type OutlineAudienceUpdateWithWhereUniqueWithoutAudienceInput = {
    where: OutlineAudienceWhereUniqueInput
    data: XOR<OutlineAudienceUpdateWithoutAudienceInput, OutlineAudienceUncheckedUpdateWithoutAudienceInput>
  }

  export type OutlineAudienceUpdateManyWithWhereWithoutAudienceInput = {
    where: OutlineAudienceScalarWhereInput
    data: XOR<OutlineAudienceUpdateManyMutationInput, OutlineAudienceUncheckedUpdateManyWithoutAudienceInput>
  }

  export type OutlineAudienceScalarWhereInput = {
    AND?: OutlineAudienceScalarWhereInput | OutlineAudienceScalarWhereInput[]
    OR?: OutlineAudienceScalarWhereInput[]
    NOT?: OutlineAudienceScalarWhereInput | OutlineAudienceScalarWhereInput[]
    outlineId?: StringFilter<"OutlineAudience"> | string
    audienceId?: StringFilter<"OutlineAudience"> | string
    assignedAt?: DateTimeFilter<"OutlineAudience"> | Date | string
  }

  export type StyleProfileCreateWithoutOutlinesInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    articles?: ArticleCreateNestedManyWithoutStyleProfileInput
  }

  export type StyleProfileUncheckedCreateWithoutOutlinesInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    articles?: ArticleUncheckedCreateNestedManyWithoutStyleProfileInput
  }

  export type StyleProfileCreateOrConnectWithoutOutlinesInput = {
    where: StyleProfileWhereUniqueInput
    create: XOR<StyleProfileCreateWithoutOutlinesInput, StyleProfileUncheckedCreateWithoutOutlinesInput>
  }

  export type OutlineAudienceCreateWithoutOutlineInput = {
    assignedAt?: Date | string
    audience: AudienceCreateNestedOneWithoutOutlineAudiencesInput
  }

  export type OutlineAudienceUncheckedCreateWithoutOutlineInput = {
    audienceId: string
    assignedAt?: Date | string
  }

  export type OutlineAudienceCreateOrConnectWithoutOutlineInput = {
    where: OutlineAudienceWhereUniqueInput
    create: XOR<OutlineAudienceCreateWithoutOutlineInput, OutlineAudienceUncheckedCreateWithoutOutlineInput>
  }

  export type OutlineAudienceCreateManyOutlineInputEnvelope = {
    data: OutlineAudienceCreateManyOutlineInput | OutlineAudienceCreateManyOutlineInput[]
    skipDuplicates?: boolean
  }

  export type ArticleCreateWithoutOutlineInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
    styleProfile: StyleProfileCreateNestedOneWithoutArticlesInput
  }

  export type ArticleUncheckedCreateWithoutOutlineInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfileId: string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
  }

  export type ArticleCreateOrConnectWithoutOutlineInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutOutlineInput, ArticleUncheckedCreateWithoutOutlineInput>
  }

  export type ArticleCreateManyOutlineInputEnvelope = {
    data: ArticleCreateManyOutlineInput | ArticleCreateManyOutlineInput[]
    skipDuplicates?: boolean
  }

  export type StyleProfileUpsertWithoutOutlinesInput = {
    update: XOR<StyleProfileUpdateWithoutOutlinesInput, StyleProfileUncheckedUpdateWithoutOutlinesInput>
    create: XOR<StyleProfileCreateWithoutOutlinesInput, StyleProfileUncheckedCreateWithoutOutlinesInput>
    where?: StyleProfileWhereInput
  }

  export type StyleProfileUpdateToOneWithWhereWithoutOutlinesInput = {
    where?: StyleProfileWhereInput
    data: XOR<StyleProfileUpdateWithoutOutlinesInput, StyleProfileUncheckedUpdateWithoutOutlinesInput>
  }

  export type StyleProfileUpdateWithoutOutlinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    articles?: ArticleUpdateManyWithoutStyleProfileNestedInput
  }

  export type StyleProfileUncheckedUpdateWithoutOutlinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    articles?: ArticleUncheckedUpdateManyWithoutStyleProfileNestedInput
  }

  export type OutlineAudienceUpsertWithWhereUniqueWithoutOutlineInput = {
    where: OutlineAudienceWhereUniqueInput
    update: XOR<OutlineAudienceUpdateWithoutOutlineInput, OutlineAudienceUncheckedUpdateWithoutOutlineInput>
    create: XOR<OutlineAudienceCreateWithoutOutlineInput, OutlineAudienceUncheckedCreateWithoutOutlineInput>
  }

  export type OutlineAudienceUpdateWithWhereUniqueWithoutOutlineInput = {
    where: OutlineAudienceWhereUniqueInput
    data: XOR<OutlineAudienceUpdateWithoutOutlineInput, OutlineAudienceUncheckedUpdateWithoutOutlineInput>
  }

  export type OutlineAudienceUpdateManyWithWhereWithoutOutlineInput = {
    where: OutlineAudienceScalarWhereInput
    data: XOR<OutlineAudienceUpdateManyMutationInput, OutlineAudienceUncheckedUpdateManyWithoutOutlineInput>
  }

  export type ArticleUpsertWithWhereUniqueWithoutOutlineInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutOutlineInput, ArticleUncheckedUpdateWithoutOutlineInput>
    create: XOR<ArticleCreateWithoutOutlineInput, ArticleUncheckedCreateWithoutOutlineInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutOutlineInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutOutlineInput, ArticleUncheckedUpdateWithoutOutlineInput>
  }

  export type ArticleUpdateManyWithWhereWithoutOutlineInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutOutlineInput>
  }

  export type OutlineCreateWithoutOutlineAudiencesInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfile?: StyleProfileCreateNestedOneWithoutOutlinesInput
    articles?: ArticleCreateNestedManyWithoutOutlineInput
  }

  export type OutlineUncheckedCreateWithoutOutlineAudiencesInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfileId?: string | null
    articles?: ArticleUncheckedCreateNestedManyWithoutOutlineInput
  }

  export type OutlineCreateOrConnectWithoutOutlineAudiencesInput = {
    where: OutlineWhereUniqueInput
    create: XOR<OutlineCreateWithoutOutlineAudiencesInput, OutlineUncheckedCreateWithoutOutlineAudiencesInput>
  }

  export type AudienceCreateWithoutOutlineAudiencesInput = {
    id?: string
    name: string
    description?: string | null
    type?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AudienceUncheckedCreateWithoutOutlineAudiencesInput = {
    id?: string
    name: string
    description?: string | null
    type?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AudienceCreateOrConnectWithoutOutlineAudiencesInput = {
    where: AudienceWhereUniqueInput
    create: XOR<AudienceCreateWithoutOutlineAudiencesInput, AudienceUncheckedCreateWithoutOutlineAudiencesInput>
  }

  export type OutlineUpsertWithoutOutlineAudiencesInput = {
    update: XOR<OutlineUpdateWithoutOutlineAudiencesInput, OutlineUncheckedUpdateWithoutOutlineAudiencesInput>
    create: XOR<OutlineCreateWithoutOutlineAudiencesInput, OutlineUncheckedCreateWithoutOutlineAudiencesInput>
    where?: OutlineWhereInput
  }

  export type OutlineUpdateToOneWithWhereWithoutOutlineAudiencesInput = {
    where?: OutlineWhereInput
    data: XOR<OutlineUpdateWithoutOutlineAudiencesInput, OutlineUncheckedUpdateWithoutOutlineAudiencesInput>
  }

  export type OutlineUpdateWithoutOutlineAudiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfile?: StyleProfileUpdateOneWithoutOutlinesNestedInput
    articles?: ArticleUpdateManyWithoutOutlineNestedInput
  }

  export type OutlineUncheckedUpdateWithoutOutlineAudiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    articles?: ArticleUncheckedUpdateManyWithoutOutlineNestedInput
  }

  export type AudienceUpsertWithoutOutlineAudiencesInput = {
    update: XOR<AudienceUpdateWithoutOutlineAudiencesInput, AudienceUncheckedUpdateWithoutOutlineAudiencesInput>
    create: XOR<AudienceCreateWithoutOutlineAudiencesInput, AudienceUncheckedCreateWithoutOutlineAudiencesInput>
    where?: AudienceWhereInput
  }

  export type AudienceUpdateToOneWithWhereWithoutOutlineAudiencesInput = {
    where?: AudienceWhereInput
    data: XOR<AudienceUpdateWithoutOutlineAudiencesInput, AudienceUncheckedUpdateWithoutOutlineAudiencesInput>
  }

  export type AudienceUpdateWithoutOutlineAudiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudienceUncheckedUpdateWithoutOutlineAudiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineCreateWithoutArticlesInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfile?: StyleProfileCreateNestedOneWithoutOutlinesInput
    outlineAudiences?: OutlineAudienceCreateNestedManyWithoutOutlineInput
  }

  export type OutlineUncheckedCreateWithoutArticlesInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfileId?: string | null
    outlineAudiences?: OutlineAudienceUncheckedCreateNestedManyWithoutOutlineInput
  }

  export type OutlineCreateOrConnectWithoutArticlesInput = {
    where: OutlineWhereUniqueInput
    create: XOR<OutlineCreateWithoutArticlesInput, OutlineUncheckedCreateWithoutArticlesInput>
  }

  export type StyleProfileCreateWithoutArticlesInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    outlines?: OutlineCreateNestedManyWithoutStyleProfileInput
  }

  export type StyleProfileUncheckedCreateWithoutArticlesInput = {
    id?: string
    name: string
    description?: string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    outlines?: OutlineUncheckedCreateNestedManyWithoutStyleProfileInput
  }

  export type StyleProfileCreateOrConnectWithoutArticlesInput = {
    where: StyleProfileWhereUniqueInput
    create: XOR<StyleProfileCreateWithoutArticlesInput, StyleProfileUncheckedCreateWithoutArticlesInput>
  }

  export type OutlineUpsertWithoutArticlesInput = {
    update: XOR<OutlineUpdateWithoutArticlesInput, OutlineUncheckedUpdateWithoutArticlesInput>
    create: XOR<OutlineCreateWithoutArticlesInput, OutlineUncheckedCreateWithoutArticlesInput>
    where?: OutlineWhereInput
  }

  export type OutlineUpdateToOneWithWhereWithoutArticlesInput = {
    where?: OutlineWhereInput
    data: XOR<OutlineUpdateWithoutArticlesInput, OutlineUncheckedUpdateWithoutArticlesInput>
  }

  export type OutlineUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfile?: StyleProfileUpdateOneWithoutOutlinesNestedInput
    outlineAudiences?: OutlineAudienceUpdateManyWithoutOutlineNestedInput
  }

  export type OutlineUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfileId?: NullableStringFieldUpdateOperationsInput | string | null
    outlineAudiences?: OutlineAudienceUncheckedUpdateManyWithoutOutlineNestedInput
  }

  export type StyleProfileUpsertWithoutArticlesInput = {
    update: XOR<StyleProfileUpdateWithoutArticlesInput, StyleProfileUncheckedUpdateWithoutArticlesInput>
    create: XOR<StyleProfileCreateWithoutArticlesInput, StyleProfileUncheckedCreateWithoutArticlesInput>
    where?: StyleProfileWhereInput
  }

  export type StyleProfileUpdateToOneWithWhereWithoutArticlesInput = {
    where?: StyleProfileWhereInput
    data: XOR<StyleProfileUpdateWithoutArticlesInput, StyleProfileUncheckedUpdateWithoutArticlesInput>
  }

  export type StyleProfileUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlines?: OutlineUpdateManyWithoutStyleProfileNestedInput
  }

  export type StyleProfileUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorInfo?: NullableJsonNullValueInput | InputJsonValue
    styleFeatures?: NullableJsonNullValueInput | InputJsonValue
    sampleText?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlines?: OutlineUncheckedUpdateManyWithoutStyleProfileNestedInput
  }

  export type OutlineCreateManyStyleProfileInput = {
    id?: string
    title: string
    keyPoints?: OutlineCreatekeyPointsInput | string[]
    outlineText: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleCreateManyStyleProfileInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    outlineId: string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
  }

  export type OutlineUpdateWithoutStyleProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineAudiences?: OutlineAudienceUpdateManyWithoutOutlineNestedInput
    articles?: ArticleUpdateManyWithoutOutlineNestedInput
  }

  export type OutlineUncheckedUpdateWithoutStyleProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineAudiences?: OutlineAudienceUncheckedUpdateManyWithoutOutlineNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutOutlineNestedInput
  }

  export type OutlineUncheckedUpdateManyWithoutStyleProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    keyPoints?: OutlineUpdatekeyPointsInput | string[]
    outlineText?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUpdateWithoutStyleProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
    outline?: OutlineUpdateOneRequiredWithoutArticlesNestedInput
  }

  export type ArticleUncheckedUpdateWithoutStyleProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineId?: StringFieldUpdateOperationsInput | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }

  export type ArticleUncheckedUpdateManyWithoutStyleProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outlineId?: StringFieldUpdateOperationsInput | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }

  export type OutlineAudienceCreateManyAudienceInput = {
    outlineId: string
    assignedAt?: Date | string
  }

  export type OutlineAudienceUpdateWithoutAudienceInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    outline?: OutlineUpdateOneRequiredWithoutOutlineAudiencesNestedInput
  }

  export type OutlineAudienceUncheckedUpdateWithoutAudienceInput = {
    outlineId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineAudienceUncheckedUpdateManyWithoutAudienceInput = {
    outlineId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineAudienceCreateManyOutlineInput = {
    audienceId: string
    assignedAt?: Date | string
  }

  export type ArticleCreateManyOutlineInput = {
    id?: string
    title: string
    content: string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    writingPurpose?: ArticleCreatewritingPurposeInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    styleProfileId: string
    targetAudienceIds?: ArticleCreatetargetAudienceIdsInput | string[]
  }

  export type OutlineAudienceUpdateWithoutOutlineInput = {
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: AudienceUpdateOneRequiredWithoutOutlineAudiencesNestedInput
  }

  export type OutlineAudienceUncheckedUpdateWithoutOutlineInput = {
    audienceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OutlineAudienceUncheckedUpdateManyWithoutOutlineInput = {
    audienceId?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUpdateWithoutOutlineInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
    styleProfile?: StyleProfileUpdateOneRequiredWithoutArticlesNestedInput
  }

  export type ArticleUncheckedUpdateWithoutOutlineInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfileId?: StringFieldUpdateOperationsInput | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }

  export type ArticleUncheckedUpdateManyWithoutOutlineInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    structuredContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    writingPurpose?: ArticleUpdatewritingPurposeInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    styleProfileId?: StringFieldUpdateOperationsInput | string
    targetAudienceIds?: ArticleUpdatetargetAudienceIdsInput | string[]
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}