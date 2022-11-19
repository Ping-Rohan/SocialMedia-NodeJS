const User = require('../model/User');
const AppError = require('../utility/AppError');
const jwt = require('jsonwebtoken');
const Authentication = require('./AuthCtrl');
const catchAsync = require('../utility/catchAsync');
const TokenApi = require('../utility/tokenAPI');

// Renews Access Token
module.exports = catchAsync(async (request, response, next) => {
    // Check If JWT Exist In Cookies
    if (!request.cookies.jwt) return next(new AppError('No Content', 401));
    const refreshToken = request.cookies.jwt;

    // Deleting Previous Refresh Token Sent To User
    response.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });

    // Refresh Token Reuse Detection
    const foundUser = await User.findOne({ refreshToken });

    // Reused Detected
    if (!foundUser) {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const reusedUser = await User.findById(decode.id);

        // Clearing All Refresh Token From DB Of That Particular User
        reusedUser.refreshToken = [];
        reusedUser.save({ validateBeforeSave: false });
    }

    // Filtering Already Used Refresh Token
    const newRefreshTokenArray = foundUser.refreshToken.filter((token) => token !== refreshToken);

    // Decoding Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check If Document Exist With Decoded Payload And Password Was Changed Recently Or Not
    const tokenApi = new TokenApi(User, decoded, next);
    await tokenApi.changedPasswordRecently();

    // Generating New Access Token
    const accessToken = Authentication.generateAccessToken({
        id: decoded.id,
    });

    const newRefreshToken = Authentication.generateRefreshToken({
        id: foundUser.id,
    });

    // Saving Non Used Refresh Token To DB
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    foundUser.save({ validateBeforeSave: false });

    // Sending New Refresh Token As Cookie
    response.cookie('jwt', newRefreshToken);

    // Sending Renewed Access Token
    response.status(200).json({
        accessToken,
    });
});
