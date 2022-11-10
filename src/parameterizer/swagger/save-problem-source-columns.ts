export const saveProblemSourceColumnsSuccessfulResponse = {
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

export const saveProblemSourceColumnsDescription = {
  summary: 'save problem source columns',
};

export const saveProblemSourceColumnsBadRequestResponse = {
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

export const saveProblemSourceColumnsCorrectPayload = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        sectionTitle: { type: 'string' },
        predictingFactors: { type: 'string' },
        goalFactor: { type: 'string' },
        droppableId: { type: 'string' },
        options: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
};
