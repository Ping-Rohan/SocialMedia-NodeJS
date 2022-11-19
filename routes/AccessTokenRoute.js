const accessTokenController = require('../controller/RenewTokenCtrl');
const express = require('express');
const Router = express.Router();

// Routes
Router.route('/').get(accessTokenController);

// Exporting
module.exports = Router;
