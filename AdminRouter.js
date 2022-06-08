const Auth_check = require("../middle-ware/isAuth");
const express = require("express");
const AdminController = require("../Controller/AdminController");
const Admin_Router = express.Router();

Admin_Router.get("/addProducts", AdminController.getForm);
Admin_Router.post("/postValue", AdminController.postFormData);
Admin_Router.get("/admin/products", Auth_check, AdminController.getProducts);
Admin_Router.get("/productEdit/:pid", Auth_check, AdminController.getEditData);
Admin_Router.post("/postEditValue", AdminController.postEditData);

Admin_Router.get(
  "/deleteProductAdmin/:pid",
  AdminController.deleteProductAdmin
);

Admin_Router.post("/postdelete", AdminController.postDelete);

module.exports = Admin_Router;
