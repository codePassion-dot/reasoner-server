export const saveProblemSourceSuccessfulResponse = {
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
              schema: { type: 'string' },
              table: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const saveProblemSourceDescription = {
  summary: 'save problem source',
};

export const saveProblemSourceBadRequestResponse = {
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

export const saveProblemSourceCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      schema: { type: 'string' },
      table: { type: 'string' },
    },
  },
};
