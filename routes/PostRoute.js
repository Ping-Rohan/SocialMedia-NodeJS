const express = require('express');
const Router = express.Router();
const Authenticaion = require('../controller/AuthCtrl');
const PostController = require('../controller/PostCtrl');

// Routes
Router.use(Authenticaion.verifyJWT);
Router.route('/').post(PostController.createPost);
Router.route('/user/:id').get(PostController.getAllPostOfUser);
Router.route('/:id/like').post(PostController.toggleLike);
Router.route('/:id/report').post(PostController.reportPost);
Router.route('/:id/delete').delete(PostController.deletePost);

// exports
module.exports = Router;
