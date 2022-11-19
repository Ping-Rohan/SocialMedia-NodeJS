const globalErrHandler = require('./utility/globalErrorHandler');
const accessTokenRouter = require('./routes/AccessTokenRoute');
const sanitize = require('express-mongo-sanitize');
const rateLimiter = require('express-rate-limit');
const UserRouter = require('./routes/UserRoute');
const AppError = require('./utility/AppError');
const cookieParser = require('cookie-parser');
const express = require('express');
const xss = require('xss-clean');
const helmet = require('helmet');
const app = express();

// Global Middlewares
app.use(express.json({ limit: '30kb' }));
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(sanitize());

// Route Forwarding
app.use('/api/v1', UserRouter);
app.use('/api/v1/refresh', accessTokenRouter);

// unhandled routes
app.use('*', (request, response, next) => {
    return next(new AppError('Couldnot Find This Route On Server', 404));
});

// global error handler
app.use(globalErrHandler);

// exports
module.exports = app;
