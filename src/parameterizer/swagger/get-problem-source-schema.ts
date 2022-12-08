export const getProblemSourceSchemasSuccessfulResponse = {
  status: 201,
  description: 'connection created',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          resource: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                schemaName: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const getProblemSourceSchemasDescription = {
  summary: 'get all schemas in database from problem source',
};

export const getProblemSourceSchemasBadRequestResponse = {
  status: 400,
  description: 'connection refused',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              detail: { type: 'string' },
            },
          },
        },
      },
    },
  },
};
