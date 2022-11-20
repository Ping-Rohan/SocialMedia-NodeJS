const Post = require('../model/Post');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/AppError');
const LikesAPI = require('../utility/likesAPI');
const { findByIdAndDelete } = require('../model/Post');

// Create New Post
exports.createPost = catchAsync(async (request, response, next) => {
    request.body.user = request.user.id;
    const post = await Post.create(request.body);

    response.status(200).json({
        post,
    });
});

// Get All Post Of Particular User
exports.getAllPostOfUser = catchAsync(async (request, response, next) => {
    const posts = await Post.find({ user: request.params.id })
        .select('-user -reportedBy')
        .sort('-createdAt');
    response.status(200).json({
        posts,
    });
});

// Delete Post
exports.deletePost = catchAsync(async (request, response, next) => {
    await findByIdAndDelete({ _id: request.params.id, user: request.user.id });
    response.status(200).json({
        message: 'Post Deleted Successfully',
    });
});

// Toggles Likes
exports.toggleLike = catchAsync(async (request, response, next) => {
    // Likes Counter Constructor
    const likesApi = new LikesAPI(Post, request);
    // Toggle Like And Count Numbers
    const totalLikes = await likesApi.countLikes();
    response.status(200).json({
        totalLikes,
    });
});

// Report Post
exports.reportPost = catchAsync(async (request, response, next) => {
    await Post.findByIdAndUpdate(
        { _id: request.params.id },
        {
            $addToSet: { reportedBy: request.user.id },
        }
    );

    response.status(200).json({
        message: 'Successfully Reported',
    });
});
