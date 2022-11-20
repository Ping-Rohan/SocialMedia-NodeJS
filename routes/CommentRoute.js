const express = require('express');
const Router = express.Router({ mergeParams: true });
const commentController = require('../controller/CommentCtrl');

// Routes
Router.route('/').post(commentController.comment);
Router.route('/:id/delete').delete(commentController.deleteComment);
Router.route('/:id/like').post(commentController.toggleCommentLike);

// Exports
module.exports = Router;
