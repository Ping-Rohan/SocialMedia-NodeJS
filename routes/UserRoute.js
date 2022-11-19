const UserController = require('../controller/UserCtrl');
const Authentication = require('../controller/AuthCtrl');
const express = require('express');
const Router = express.Router();

// routes
Router.route('/signup').post(UserController.createNewAccount);
Router.route('/login').post(UserController.login);
Router.route('/change-password').patch(Authentication.verifyJWT, UserController.changePassword);
Router.route('/users').get(Authentication.verifyJWT, UserController.getAllAccounts);

// exports
module.exports = Router;
