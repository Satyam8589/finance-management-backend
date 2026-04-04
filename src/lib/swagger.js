import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zorvyn Finance API',
      version: '1.0.0',
      description: 'Finance Data Processing and Access Control Backend. **Note: Deployed on Render Free Tier — Expect 1-2 mins cold start on first request.**',
    },
    servers: [
      {
        url: 'https://zorvyn-finance-backend-sa04.onrender.com',
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
          responses: { 201: { description: 'Created' } }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login to receive JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Login successful' } }
        }
      },
      '/api/records': {
        get: {
          tags: ['Records'],
          summary: 'Get all records',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of records' } }
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
