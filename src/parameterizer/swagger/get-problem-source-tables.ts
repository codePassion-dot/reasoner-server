export const getProblemSourceTablesSuccessfulResponse = {
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
                tableName: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const getProblemSourceTablesDescription = {
  summary: 'get all tables in a schema from a problem source',
};

export const getProblemSourceTablesBadRequestResponse = {
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

export const getProblemSourceTablesCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      schema: { type: 'string' },
    },
  },
};
