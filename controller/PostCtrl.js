const Post = require('../model/Post');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/AppError');

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
    let likes;
    const post = await Post.findOne({ _id: request.params.id, likedBy: request.user.id });
    if (!post) {
        const updatedPost = await Post.findByIdAndUpdate(
            { _id: request.params.id },
            { $push: { likedBy: request.user.id } },
            { new: true }
        );
        likes = updatedPost.likedBy.length;
    } else {
        const updatedPost = await Post.findByIdAndUpdate(
            { _id: request.params.id },
            { $pull: { likedBy: request.user.id } },
            { new: true }
        );
        likes = updatedPost.likedBy.length;
    }

    response.status(200).json({
        likes,
    });
});
