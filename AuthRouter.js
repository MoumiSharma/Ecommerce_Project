const express = require("express");

const {check,body}=require('express-validator')

const AuthController = require("../Controller/authController");
const RegRouter = express.Router();



RegRouter.get("/addUsers",AuthController.regFormDisplay)
RegRouter.post("/postRegValue",
[
    body('fname','Valid firstname here').isLength({min:3,max:12}),
    body('lname','Valid lastname here').isLength({min:3,max:12}),
    check('email').isEmail().withMessage("input valid email"),
    body('password','enter valid password').matches('^(?=.*[A-Za-z0-9])(?=.*[!@#$&*]).{4,12}$')
],
AuthController.regDataController)
RegRouter.get("/loginForm",AuthController.loginDisplay)
RegRouter.post("/postLoginValue",
[
   
    check('email').isEmail().withMessage("input valid email"),
    body('password','enter valid password').matches('^(?=.*[A-Za-z0-9])(?=.*[!@#$&*]).{4,12}$')
],
AuthController.postLogin)
RegRouter.get('/LogOut',AuthController.logout)


module.exports=RegRouter
