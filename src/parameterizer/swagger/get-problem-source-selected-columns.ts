export const getProblemSourceSelectedColumnsSuccessfulResponse = {
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
                columnName: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const getProblemSourceSelectedColumnsDescription = {
  summary: 'get problem source selected columns',
};

export const getProblemSourceSelectedColumnsBadRequestResponse = {
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
