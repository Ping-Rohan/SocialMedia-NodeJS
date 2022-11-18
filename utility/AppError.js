class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Error' : 'Failed';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// exports
module.exports = AppError;
