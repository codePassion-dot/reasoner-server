export const createConnectionSuccessfulResponse = {
  status: 201,
  description: 'connection created',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          resource: {
            type: 'object',
            properties: {
              host: { type: 'string' },
              port: { type: 'string' },
              database: { type: 'string' },
              username: { type: 'string' },
              password: { type: 'string' },
              ssl: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const createConnectionDescription = {
  summary: 'Create a new connection',
};

export const createConnectionBadRequestResponse = {
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

export const createConnectionCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      host: { type: 'string' },
      port: { type: 'string' },
      database: { type: 'string' },
      username: { type: 'string' },
      password: { type: 'string' },
      ssl: { type: 'string' },
    },
  },
};
