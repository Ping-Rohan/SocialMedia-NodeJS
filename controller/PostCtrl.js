const Post = require('../model/Post');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/AppError');
const LikesAPI = require('../utility/likesAPI');

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

exports.toggleLike = catchAsync(async (request, response, next) => {
    // Likes Counter Constructor
    const likesApi = new LikesAPI(Post, request);
    // Toggle Like And Count Numbers
    const totalLikes = await likesApi.countLikes();
    response.status(200).json({
        totalLikes,
    });
});
