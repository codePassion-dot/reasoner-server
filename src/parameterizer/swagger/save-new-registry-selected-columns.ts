export const saveNewRegistrySelectedColumnsSuccessfulResponse = {
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

export const saveNewRegistrySelectedColumnsDescription = {
  summary: 'save a new registry in selected columns',
};

export const saveNewRegistrySelectedColumnsBadRequestResponse = {
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

export const saveNewRegistrySelectedColumnsCorrectPayload = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        columnName: { type: 'string' },
        value: { type: 'string' },
      },
    },
  },
};
