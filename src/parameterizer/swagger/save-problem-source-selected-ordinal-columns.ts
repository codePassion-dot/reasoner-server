export const saveProblemSourceSelectedOrdinalColumnsSuccessfulResponse = {
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
              target: { type: 'string' },
              type: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const saveProblemSourceSelectedOrdinalColumnsDescription = {
  summary: 'save problem source selected ordinal columns',
};

export const saveProblemSourceSelectedOrdinalColumnsBadRequestResponse = {
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

export const saveProblemSourceSelectedOrdinalColumnsCorrectPayload = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        columnName: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ordinalValue: { type: 'string' },
              mappedValue: { type: 'number' },
            },
          },
        },
      },
    },
  },
};
