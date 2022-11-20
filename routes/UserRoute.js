const UserController = require('../controller/UserCtrl');
const Authentication = require('../controller/AuthCtrl');
const express = require('express');
const Router = express.Router();
const upload = require('../utility/Multer');

// routes
Router.route('/signup').post(upload.single('profile'), UserController.createNewAccount);
Router.route('/login').post(Authentication.login);
Router.route('/clear-devices').post(Authentication.clearDevices);
Router.use(Authentication.verifyJWT);
Router.route('/change-password').patch(Authentication.login);
Router.route('/user/:id/follow').post(UserController.followUser);
Router.route('/user/:id/unfollow').post(UserController.unfollowUser);
Router.route('/find-friends').get(UserController.findFriends);
Router.route('/search-friends').get(UserController.searchFriends);
Router.route('/update-user-information').post(UserController.updateUserInformation);

// exports
module.exports = Router;
