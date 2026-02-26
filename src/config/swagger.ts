import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HiredWithAndi API',
      version: '1.0.0',
      description: 'API Documentation for HiredWithAndi Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Job: {
          type: 'object',
          required: ['company', 'position', 'status'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            company: { type: 'string' },
            position: { type: 'string' },
            url: { type: 'string', nullable: true },
            status: { type: 'string' },
            workType: { type: 'string', enum: ['REMOTE', 'ONSITE', 'HYBRID'] },
            jobFitPercentage: { type: 'number', minimum: 0, maximum: 100 },
            dateApplied: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['SUPERADMIN', 'ADMIN', 'STUDENT'] },
            orgId: { type: 'string', nullable: true },
          },
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            bio: { type: 'string', nullable: true },
            location: { type: 'string', nullable: true },
            linkedIn: { type: 'string', format: 'url', nullable: true },
            avatarUrl: { type: 'string', description: 'Base64 encoded photo', nullable: true },
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
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
