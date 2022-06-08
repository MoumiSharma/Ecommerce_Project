const express = require("express");
const UserController = require("../Controller/UserController");
const User_Router = express.Router();
const isAuth = require('../middle-ware/isAuth');


User_Router.get("/user/products", UserController.userValueDisplay);

User_Router.get('/productDetails/:pid', UserController.viewSingleProduct);

User_Router.get("/addToCart/:pid", UserController.addToCartProduct);

User_Router.post('/searchdata', UserController.viewsearchdata)




module.exports = User_Router;
