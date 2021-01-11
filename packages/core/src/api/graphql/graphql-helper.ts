import { GraphQLApiOptions, isNotEmpty } from '@gauzy/common';
import { GqlModuleOptions, GraphQLTypesLoader } from '@nestjs/graphql';
import { buildSchema, extendSchema, printSchema } from 'graphql';
import * as path from 'path';
import { getPluginExtensions } from '@gauzy/plugin';
import { ConfigService } from '../../config';

export async function createGraphqlModuleOptions(
  configService: ConfigService,
  typesLoader: GraphQLTypesLoader,
  options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {
  return {
    path: `/${options.path}`,
    typeDefs: await createTypeDefs(configService, options, typesLoader),
    playground: options.playground || false,
    debug: options.debug || false,
    include: [options.resolverModule],
  } as GqlModuleOptions;
}

async function createTypeDefs(
  configService: ConfigService,
  options: GraphQLApiOptions,
  typesLoader: GraphQLTypesLoader,
): Promise<string> {
  const normalizedPaths = options.typePaths.map((p) => p.split(path.sep).join('/'));
  const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);
  let schema = buildSchema(typeDefs);

  getPluginExtensions(configService.plugins)
    .map((e) => (typeof e.schema === 'function' ? e.schema() : e.schema))
    .filter(isNotEmpty)
    .forEach((documentNode) => (schema = extendSchema(schema, documentNode)));

  return printSchema(schema);
}
