type EndpointFn = (...args: any[]) => any;

type QueryDef<T extends EndpointFn> = { type: 'query'; fn: T };
type MutationDef<T extends EndpointFn> = { type: 'mutation'; fn: T };
type EndpointDef<T extends EndpointFn> = QueryDef<T> | MutationDef<T>;

type EndpointsParams = Record<string, EndpointDef<EndpointFn>>;

type EndpointsRes<T extends EndpointsParams> = {
  [K in keyof T as T[K] extends { type: 'query' } ? `use${Capitalize<string & K>}Query` : `use${Capitalize<string & K>}Mutation`]: T[K]['fn'];
};

type BuilderType = {
  query: <T extends EndpointFn>(config: { query: T }) => QueryDef<T>;
  mutation: <T extends EndpointFn>(config: { mutation: T }) => MutationDef<T>;
};

class AppQuery {
  builder: BuilderType = {
    query: (config) => ({ type: 'query', fn: config.query }),
    mutation: (config) => ({ type: 'mutation', fn: config.mutation }),
  };

  endpoints<T extends EndpointsParams>(params: T) {
    const result = Object.entries(params).reduce((acc, [key, value]) => {
      const suffix = value.type === 'query' ? 'Query' : 'Mutation';
      const newKey = `use${this.capitalize(key)}${suffix}`;
      acc[newKey] = value.fn;
      return acc;
    }, {} as Record<string, any>);

    return result as EndpointsRes<T>;
  }

  private capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ✅ Example usage
const query = new AppQuery();
const { builder } = query;

const app = query.endpoints({
  getPost: builder.query({
    query: (id: number) => ({ message: `Post ${id}` }),
  }),
  createPost: builder.mutation({
    mutation: (data: { title: string }) => ({ success: true, ...data }),
  }),
});

const {
  useCreatePostMutation,
} = app;