const Comment = require('../model/Comment');
const catchAsync = require('../utility/catchAsync');
const LikeAPI = require('../utility/likesAPI');

// Post Comment
exports.comment = catchAsync(async (request, response, next) => {
    if (!request.body.user) request.body.user = request.user.id;
    if (!request.body.post) request.body.post = request.params.id;
    await Comment.create(request.body);
    response.status(200).json({
        message: 'Commented Successfully',
    });
});

// Delete Comment
exports.deleteComment = catchAsync(async (request, response, next) => {
    await Comment.findOneAndDelete({ _id: request.params.id, user: request.user.id });
    response.status(200).json({
        message: 'Comment Deleted Successfully',
    });
});

// Update Comment
exports.updateComment = catchAsync(async (request, response, next) => {
    await Comment.findOneAndUpdate(
        { _id: request.params.id, user: request.user.id },
        {
            text: request.body.text,
        }
    );

    response.status(200).json({
        message: 'Comment Updated Successfully',
    });
});

// Toggle Like
exports.toggleCommentLike = catchAsync(async (request, response, next) => {
    const likeAPI = new LikeAPI(Comment, request);
    const totalLikes = await likeAPI.countLikes();
    response.status(200).json({
        totalLikes,
    });
});
