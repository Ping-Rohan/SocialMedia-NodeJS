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

// Update User Information
exports.updateUserInformation = catchAsync(async (request, response, next) => {
    if (request.body.password) delete request.body.password;

    const document = User.findById(request.user.id, request.body);
    await document.updateOne(request.body, { runValidators: true });

    response.status(200).json({
        message: 'Fields Updated Successfully',
    });
});

// Follow User
exports.followUser = catchAsync(async (request, response, next) => {
    // Searching Targeted Follow Person
    const document = await User.find({
        id: request.params.id,
        followers: request.user.id,
    });

    // If That User Was Already Followed
    if (document.length > 0) return next(new AppError('You Have Already Followed This User'));

    // Updating Own Document
    await User.findByIdAndUpdate(request.user.id, {
        $push: { following: request.params.id },
    });

    // Updating Targeted User Document
    await User.findByIdAndUpdate(request.params.id, {
        $push: { followers: request.user.id },
    });

    response.status(200).json({
        message: 'Followed Successfully',
    });
});

// Unfollow User
exports.unfollowUser = catchAsync(async (request, response, next) => {
    const document = await User.findOne({ _id: request.params.id, followers: request.user.id });

    if (!document) return next(new AppError('You Never Followed This User'));

    await User.findByIdAndUpdate(request.params.id, {
        $pull: { followers: request.user.id },
    });

    await User.findByIdAndUpdate(request.user.id, {
        $pull: { following: request.params.id },
    });

    response.status(200).json({
        message: 'Unfollowed Successfully',
    });
});

// Friends Suggestion
exports.findFriends = catchAsync(async (request, response, next) => {
    const friendsArr = [...request.user.following, request.user.id];
    const suggestionFriends = await User.aggregate([
        { $match: { _id: { $nin: friendsArr } } },
        { $sample: { size: 10 } },
    ]).project('-password -refreshToken -dob');

    response.status(200).json({
        suggestionFriends,
    });
});
