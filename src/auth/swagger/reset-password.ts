export const resetPasswordSuccessfulResponse = {
  status: 200,
  description: 'User patched',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          resource: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              resetPasswordToken: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const resetPasswordDescription = { summary: 'Update password user' };

export const resetPasswordUnauthorizedResponse = {
  status: 401,
  description: 'User provided invalid credentials',
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

export const resetPasswordCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      password: { type: 'string' },
    },
  },
};
