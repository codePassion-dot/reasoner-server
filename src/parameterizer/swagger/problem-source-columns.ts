export const problemSourceColumnsSuccessfulResponse = {
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

export const problemSourceColumnsDescription = {
  summary: 'get problem source columns',
};

export const problemSourceColumnsBadRequestResponse = {
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
