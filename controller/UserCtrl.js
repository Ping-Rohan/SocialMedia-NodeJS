const Authentication = require('../controller/AuthCtrl');
const catchAsync = require('../utility/catchAsync');
const User = require('../model/User');
const AppError = require('../utility/AppError');

// Create New Account
exports.createNewAccount = catchAsync(async (request, response, next) => {
    const document = await User.create(request.body);

    // generate access and refresh token
    const accessToken = Authentication.generateAccessToken({
        id: document._id,
    });
    const refreshToken = Authentication.generateRefreshToken({
        id: document._id,
    });

    // Saving Refresh Token To DB
    document.refreshToken.push(refreshToken);
    document.save({ validateBeforeSave: false });

    response.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 60 * 60 * 1000, // 30 days
    });

    response.status(200).json({
        message: 'Account Created Successfully',
        accessToken,
    });
});

// Change Password
exports.changePassword = catchAsync(async (request, response, next) => {
    const { currentPassword, password, confirmPassword } = request.body;
    const document = await User.findById(request.user.id);

    if (!(await document.checkPassword(currentPassword, document.password)))
        return next(new AppError('Incorrect Password'));

    // Updating Password
    document.password = password;
    document.confirmPassword = confirmPassword;
    await document.save();

    // Sending Response
    response.status(200).json({
        message: 'Password Changed Successfully',
    });
});

// Login
exports.login = catchAsync(async (request, response, next) => {
    const { email, password } = request.body;

    // If Email Or Password Doesnot Exist
    if (!email || !password) return next(new AppError('Email And Password Required'));

    const foundUser = await User.findOne({ email });

    //If No Document Found Or Password Is Incorrect
    if (!foundUser || !(await foundUser.checkPassword(password, foundUser.password)))
        return next(new AppError('Email Or Password Incorrect'));

    // Check if User Has Maxmimum Login Device Limit Reached
    if (foundUser.refreshToken.length === 2)
        return next(
            new AppError(
                'You Have Reached Your Maximum Device Login Limit . Logout From Other Devices  To Login This Device'
            )
        );

    // Generating New Tokens
    const refreshToken = Authentication.generateRefreshToken({ id: foundUser._id });
    const accessToken = Authentication.generateAccessToken({ id: foundUser._id });

    // Saving Refresh Token In DB
    foundUser.refreshToken.push(refreshToken);
    foundUser.save({ validateBeforeSave: false });

    // Sending Refresh Token As Cookie
    response.cookie('jwt', refreshToken);

    response.status(200).json({
        message: 'Logged In Successfully',
        accessToken,
    });
});
