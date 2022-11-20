const express = require('express');
const Router = express.Router({ mergeParams: true });
const commentController = require('../controller/CommentCtrl');

// Routes
Router.route('/').post(commentController.comment);
Router.route('/:id/like').post(commentController.toggleCommentLike);
Router.route('/:id').patch(commentController.updateComment).delete(commentController.deleteComment);

// Exports
module.exports = Router;
