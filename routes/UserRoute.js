const UserController = require('../controller/UserCtrl');
const express = require('express');
const Router = express.Router();

// routes
Router.route('/signup').post(UserController.createNewAccount);

// exports
module.exports = Router;
