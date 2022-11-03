export const saveProblemAlgorithmSuccessfulResponse = {
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
              id: { type: 'string' },
              name: { type: 'string' },
              isBeingCreated: { type: 'string' },
              schema: { type: 'string' },
              table: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const saveProblemAlgorithmDescription = {
  summary: 'save selected algorithm',
};

export const saveProblemAlgorithmBadRequestResponse = {
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

export const saveProblemAlgorithmCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      algorithm: { type: 'string' },
    },
  },
};
