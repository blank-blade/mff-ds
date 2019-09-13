const serverless = require('serverless-http')

const app = require('./src/app')

/**
 * Create HTTP server.
 */
module.exports.handler = serverless(app)
