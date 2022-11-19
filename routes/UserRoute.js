const UserController = require('../controller/UserCtrl');
const Authentication = require('../controller/AuthCtrl');
const express = require('express');
const Router = express.Router();

// routes
Router.route('/signup').post(UserController.createNewAccount);
Router.route('/login').post(UserController.login);
Router.route('/clear-devices').post(Authentication.clearDevices);
Router.use(Authentication.verifyJWT);
Router.route('/change-password').patch(UserController.changePassword);

// exports
module.exports = Router;
