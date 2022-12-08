export const refreshTokenSuccessfulResponse = {
  status: 202,
  description: 'Token refreshed',
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

export const refreshTokenDescription = {
  summary: 'Create a new refresh and access token',
};

export const refreshTokenUnauthorizedResponse = {
  status: 401,
  description: 'User provided invalid old refresh token',
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
