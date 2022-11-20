const express = require('express');
const Router = express.Router();
const Authenticaion = require('../controller/AuthCtrl');
const PostController = require('../controller/PostCtrl');
const commentRouter = require('./CommentRoute');
// Routes
Router.use(Authenticaion.verifyJWT);

Router.route('/').post(PostController.createPost).get(PostController.discoverPost);
Router.route('/user/:id').get(PostController.getAllPostOfUser);
Router.route('/:id/like').post(PostController.toggleLike);
Router.route('/:id/report').post(PostController.reportPost);
Router.route('/:id/delete').delete(PostController.deletePost);
Router.route('/:id/update').patch(PostController.updatePost);

Router.use('/:id/comment', commentRouter);

// exports
module.exports = Router;
