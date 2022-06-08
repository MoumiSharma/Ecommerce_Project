const ProductModel = require("../Model/product");
const path = require("path");

exports.getForm = (req, res) => {
  res.render("Admin/AdProduct", {
    titlePage: "My Products",
    path: "/addProducts",
  });
};

exports.postFormData = (req, res) => {
  console.log("collected value:", req.body);
  let title = req.body.p_title;
  let price = req.body.p_price;
  let description = req.body.p_desc;
  const product_img = req.file;
  const pImage_url = product_img.path;
  let ProductData = new ProductModel({
    pTitle: title,
    pPrice: price,
    pDescription: description,
    pimage: pImage_url,
  });
  ProductData.save()
    .then((res) => {
      console.log("data added");
    })
    .catch((err) => {
      console.log("error to add data", er);
    }); //to store value
  res.redirect("/admin/products");
};

exports.getProducts = (req, res) => {
  ProductModel.find()
    .then((products) => {
      //find is predefined function here for fetching
      res.render("Admin/ViewProduct", {
        titlePage: "all products",
        data: products,
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("Error to fetch data", err);
    });
};

exports.getEditData = (req, res) => {
  let prod_id = req.params.pid;
  console.log("product id", prod_id);
  ProductModel.findById(prod_id)
    .then((product) => {
      console.log(product);
      res.render("Admin/productEdit", {
        titlePage: "all products",
        data: product,
        path: "/productEdit/:pid",
      });
    })
    .catch((err) => {
      console.log("Error to fetch data", err);
    });
};

exports.postEditData = (req, res) => {
  console.log("collected value:", req.body);
  let editedtitle = req.body.p_title;
  let editedprice = req.body.p_price;
  let editeddescription = req.body.p_desc;
  let editedId = req.body.prod_id;
  let editedPimage = " ";
  const oldurl = req.body.oldurl;

  if (req.file === undefined) {
    editedPimage = oldurl;
  } else {
    editedPimage = req.file.path;
  }
  console.log("url value: ", editedPimage, oldurl);
  ProductModel.findById(editedId).then((updateData) => {
    updateData.pTitle = editedtitle;
    updateData.pPrice = editedprice;
    updateData.pDescription = editeddescription;
    updateData.p_img = editedPimage;
    return updateData
      .save()
      .then((result) => {
        console.log("Product is saved");
        res.redirect("/admin/products");
      })
      .catch((err) => {
        console.log("error to add data", err);
      }); //to store value
  });
};

//   const UpdatedData = new ProductModel(editedtitle, editedprice, editeddescription,editedId);
//   UpdatedData.saveData().then(res=>{
//     console.log("Product is saved");
//   }).catch(err=>{
//     console.log("error to add data",er);
//   });//to store value
//   res.redirect("/admin/products");
// };

exports.deleteProductAdmin = (req, res) => {
  let prod_id = req.params.pid;
  console.log(prod_id);
  ProductModel.deleteOne({ _id: prod_id })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postDelete = (req, res) => {
  const delete_id = req.body.delete_id;

  ProductModel.deleteOne({ _id: delete_id })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
