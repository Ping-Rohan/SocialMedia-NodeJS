const catchAsync = require('../utility/catchAsync');
const User = require('../model/User');

// --------------------------> Create New Account <-----------------------------

exports.createNewAccount = catchAsync(async (request, response, next) => {
    await User.create(request.body);

    // implement email verification later
    // ------------------------------------
    response.status(200).json({
        message: 'Account Created Successfully',
    });
});
