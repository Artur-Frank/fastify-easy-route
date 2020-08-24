'use strict'

const fp = require('fastify-plugin')
const routes = require('./dist/EasyRoute');

const FastifyEasyRoute = (fastify, options, next) => {
    let transporter = null

    try {
        transporter = routes(fastify, options);
    } catch (err) {
        return next(err)
    }

    fastify
        .decorate('EasyRoute', transporter)
        .addHook('onClose', close)

    next()
}

const close = (fastify, done) => {
    fastify.mysql.close(done)
}

module.exports = fp(FastifyEasyRoute, {
    fastify: '>=2.0.0',
    name: 'fastify-easy-route'
})
