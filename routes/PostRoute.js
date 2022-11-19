const express = require('express');
const Router = express.Router();
const Authenticaion = require('../controller/AuthCtrl');
const PostController = require('../controller/PostCtrl');

// Routes
Router.use(Authenticaion.verifyJWT);
Router.route('/').post(PostController.createPost);
Router.route('/user/:id').get(PostController.getAllPostOfUser);
Router.route('/:id/like').post(PostController.toggleLike);
// exports
module.exports = Router;
