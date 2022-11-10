export const getProblemSourceSelectedColumnsNewProblemSuccessfulResponse = {
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
                type: { type: 'string' },
                options: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
};

export const getProblemSourceSelectedColumnsNewProblemDescription = {
  summary: 'get problem source selected columns in a new problem',
};

export const getProblemSourceSelectedColumnsNewProblemBadRequestResponse = {
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
