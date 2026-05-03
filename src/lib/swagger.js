import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Management API',
      version: '1.0.0',
      description: 'Finance Data Processing and Access Control Backend. **Note: Deployed on Render Free Tier — Expect 1-2 mins cold start on first request.**',
    },
    servers: [
      {
        url: 'https://finance-management-backend-sa04.onrender.com',
        description: 'Production server',
      },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password', 'role'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: { type: 'string', enum: ['viewer', 'analyst', 'admin'] }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered. Returns accessToken (15min) + refreshToken (7d rolling).',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokenResponse' } } }
            },
            400: { description: 'Email already exists or validation error' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login and receive access + refresh tokens',
          description: 'Returns a short-lived **accessToken** (15 min) for API calls and a long-lived **refreshToken** (7-day rolling) to obtain new tokens without re-login.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', example: 'mypassword123' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful. Store both tokens — use accessToken for API calls, refreshToken to renew.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokenResponse' } } }
            },
            401: { description: 'Invalid email or password' },
            403: { description: 'Account is inactive' }
          }
        }
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh access token (Token Rotation)',
          description: 'Exchange a valid **refreshToken** for a new **accessToken** (15 min) and a new **refreshToken** (7 days from now). The old refresh token is deleted immediately — always store the new one. Call this automatically when the API returns `401 Access token expired`.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string', description: 'The raw refresh token received from login or last refresh call' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'New token pair issued. Old refresh token is now invalid.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokenResponse' } } }
            },
            401: { description: 'Invalid or expired refresh token — user must log in again' }
          }
        }
      },
      '/api/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout from current device',
          description: 'Deletes the provided refresh token from the database. The user will need to log in again on this device. **No Authorization header required.**',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string', description: 'The refresh token to invalidate' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Logged out successfully' }
          }
        }
      },
      '/api/auth/logout-all': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout from ALL devices',
          description: 'Deletes **every** refresh token associated with the authenticated user. All devices will be forced to re-login. **Requires a valid accessToken.**',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Logged out from all devices successfully' },
            401: { description: 'Unauthorized — valid access token required' }
          }
        }
      },
      '/api/records': {
        get: {
          tags: ['Records'],
          summary: 'List records (Dynamic filtering based on user role)',
          description: 'Get all records. **Role-based behavior:** `viewer` role only sees their own records; `analyst` and `admin` roles see all records in the system.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Records fetched successfully' } }
        }
      },
      '/api/records/create': {
        post: {
          tags: ['Records'],
          summary: 'Create a new record',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'type', 'category', 'date'],
                  properties: {
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['income', 'expense'] },
                    category: { type: 'string' },
                    date: { type: 'string', format: 'date' },
                    notes: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/api/records/{id}': {
        get: {
          tags: ['Records'],
          summary: 'Get a single record by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Record found' } }
        },
        patch: {
          tags: ['Records'],
          summary: 'Update a record',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { amount: { type: 'number' }, category: { type: 'string' }, notes: { type: 'string' } } } } }
          },
          responses: { 200: { description: 'Record updated' } }
        },
        delete: {
          tags: ['Records'],
          summary: 'Soft delete a record',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Record deleted' } }
        }
      },
      '/api/dashboard/overview': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get financial summary (Total Income, Expense, Balance)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Summary data' } }
        }
      },
      '/api/dashboard/categories': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get category-wise breadown of records',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Category data' } }
        }
      },
      '/api/dashboard/trends': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get monthly income vs expense trends (last 6 months)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Monthly trends' } }
        }
      },
      '/api/users': {
        get: {
          tags: ['Users (Admin Only)'],
          summary: 'List all users',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of users' } }
        }
      },
      '/api/users/{id}/role': {
        patch: {
          tags: ['Users (Admin Only)'],
          summary: 'Update a users role',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { role: { type: 'string', enum: ['viewer', 'analyst', 'admin'] } } } } }
          },
          responses: { 200: { description: 'Role updated' } }
        }
      },
      '/api/users/{id}/status': {
        patch: {
          tags: ['Users (Admin Only)'],
          summary: 'Activate or Deactivate a user',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['active', 'inactive'] } } } } }
          },
          responses: { 200: { description: 'Status updated' } }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        AuthTokenResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: {
                  type: 'string',
                  description: 'Short-lived JWT for API authorization. Expires in 15 minutes. Send as `Authorization: Bearer <token>`.',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                refreshToken: {
                  type: 'string',
                  description: 'Long-lived opaque token. Valid for 7 days (rolling). Send to `POST /api/auth/refresh` to get a new token pair.',
                  example: 'a3f9c2d1e4b7809c3f1d2e4b7a9c0e1f2d3a4b5c6d7e8f9a0b1c2d3e4f5a6b7'
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['viewer', 'analyst', 'admin'] },
            status: { type: 'string', enum: ['active', 'inactive'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Record: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            amount: { type: 'number', description: 'Amount in paise/cents' },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string' },
            date: { type: 'string', format: 'date' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/modules/**/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
