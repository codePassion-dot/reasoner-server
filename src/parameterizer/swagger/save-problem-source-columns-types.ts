export const saveProblemSourceColumnsTypesSuccessfulResponse = {
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

export const saveProblemSourceColumnsTypesDescription = {
  summary: 'save problem source columns',
};

export const saveProblemSourceColumnsTypesBadRequestResponse = {
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

export const saveProblemSourceColumnsTypesCorrectPayload = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        sectionTitle: { type: 'string' },
        ordinalColumns: { type: 'string' },
        booleanColumns: { type: 'string' },
        numericColumns: { type: 'string' },
        droppableId: { type: 'string' },
        options: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
};
