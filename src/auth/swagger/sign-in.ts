export const signInSuccessfulResponse = {
  status: 201,
  description: 'User created',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          resource: {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const signInDescription = { summary: 'Log in a registered user' };

export const signInUnauthorizedResponse = {
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

export const signInCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};
