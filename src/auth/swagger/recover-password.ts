export const recoverPasswordSuccessfulResponse = {
  status: 202,
  description: 'Email sent',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          resource: {
            type: 'object',
            properties: {
              to: { type: 'string' },
              from: { type: 'string' },
              subject: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const recovePasswordDescription = {
  summary: 'Send email with link to reset password',
};

export const recoverPasswordBadRequest = {
  status: 400,
  description: 'User does not exist',
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
