const catchAsync = require('../utility/catchAsync');
const TokenApi = require('../utility/tokenAPI');
const AppError = require('../utility/AppError');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

// Generate Refresh Token
exports.generateRefreshToken = (payload) => {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REF_TOKEN_EXPIRES,
    });

    return refreshToken;
};

// Generate Access Token
exports.generateAccessToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    });

    return accessToken;
};

// Verify Json Web Token
exports.verifyJWT = catchAsync(async (request, response, next) => {
    let accessToken;

    // Extracting Access Token
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer'))
        accessToken = request.headers.authorization.split(' ')[1];

    if (!accessToken) return next(new AppError('No Content', 401));

    // Decoding Access Token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Check If Document Exist With Decoded Payload And Password Was Changed Recently Or Not
    const TokenAPI = new TokenApi(User, decoded, next);
    const document = await TokenAPI.changedPasswordRecently();

    // Storing Current User Document For Next Middleware
    request.user = document;

    next();
});

// Clear All Logged In Devices
exports.clearDevices = catchAsync(async (request, response, next) => {
    const { email, password } = request.body;
    if (!email || !password)
        return next(new AppError('Enter Email And Password To Clear Devices Login'));

    const foundUser = await User.findOne({ email });

    if (!foundUser || !(await foundUser.checkPassword(password, foundUser.password)))
        return next(new AppError('Wrong Email Or Password'));

    foundUser.refreshToken = [];
    foundUser.save({ validateBeforeSave: false });

    response.status(200).json({
        message: 'Devices Cleared Successfully .',
    });
});
