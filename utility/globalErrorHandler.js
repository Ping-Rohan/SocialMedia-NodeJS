const AppError = require('./AppError');

// error handler on development environment
function sendErrorDevelopment(error, response) {
    response.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error,
        stack: error.stack,
    });
}

// error handler on production environment
function sendErrorProduction(error, response) {
    response.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
}

// error handler for non operational error
function sendNonOperationalError(error, response) {
    response.status(error.statusCode).json({
        status: error.status,
        message: 'Something Went Very Wrong',
    });
}

// handling validation error
function handleValidationError(error) {
    const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(' , ');
    return new AppError(messages, 403);
}

// handle duplicate error
function handleDuplicateError(error) {
    const messages = Object.values(error.keyValue).join('');
    return new AppError(`User Already Exist With : ${messages}`, 403);
}

// handle jwt expiration error
function handleJwtExpirationError() {
    return new AppError('JWT Expired Please Renew New Token', 401);
}

module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Internal Server Error';

    if (process.env.NODE_ENV === 'production') {
        // handling mongoose errors
        if (error.name === 'ValidationError')
            error = handleValidationError(error);
        if (error.code === 11000) error = handleDuplicateError(error);

        // handling jwt error
        if (error.name === 'TokenExpiredError')
            error = handleJwtExpirationError();

        // if only error is operational
        if (error.isOperational) {
            sendErrorProduction(error, response);
        } else {
            sendNonOperationalError(error, response);
        }
    } else if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(error, response);
    }
};
