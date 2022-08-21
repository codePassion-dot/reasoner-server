export const signUpSuccessfulResponse = {
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
              id: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              resetPasswordToken: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const signUpDescription = { summary: 'Create a new user' };

export const signUpBadRequestResponse = {
  status: 400,
  description: 'User already exists',
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

export const signUpCorrectPayload = {
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
};
