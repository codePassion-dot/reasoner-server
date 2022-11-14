export const solveSuccessfulResponse = {
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
              initialProblem: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    value: { type: 'string' },
                  },
                },
              },
              umbral: {
                type: 'object',
                properties: {
                  acceptanceUmbral: { type: 'number' },
                  similitude: { type: 'number' },
                },
              },
              result: {
                type: 'object',
                properties: {
                  globalSimilitude: { type: 'number' },
                },
                additionalProperties: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const solveDescription = {
  summary: 'get the solution for a given problem',
};

export const solveBadRequestResponse = {
  status: 400,
  description: 'It is not possible to solve the problem',
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
