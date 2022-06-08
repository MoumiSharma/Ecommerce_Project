const Product = require("../Model/product"); 

const ITEMS_PER_PAGE = 3;
exports.userValueDisplay = (req, res) => {
  const page = +req.query.page || 1;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })

    .then((products) => {
      res.render("User/ViewProduct", {
        titlePage: "User Products",
        path: "/user/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        data: products,
      });
    })
    .catch((err) => {
      console.log("error in fetching", err);
    });
};



exports.viewSingleProduct = (req, res, next) => {
  const product_id = req.params.pid;
  console.log("Collected product id:", product_id);
  Product.findById(product_id)
    .then((product) => {
      console.log("Product found by id:", product);
      res.render("User/productDetails", {
        titlePage: "Product Details",
        data: product,
        path:'/productDetails/:pid'
      });
    })
    .catch((err) => {
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
      console.log("Product not found", err);
    });    
};


exports.addToCartProduct = (req, res) => {
  const product_id = req.params.pid;
  console.log("Collected product id:", product_id);
  Product.findById(product_id)
    .then((product) => {
      console.log("Product found by id:", product);
      res.render("User/addToCart", {
        titlePage: "Cart Section",
        path: "/addToCart/:pid",
        data: product,
      });
    })
    .catch((err) => {
      console.log("Product not found", err);
    });
};

exports.viewsearchdata=(req,res) => {
  const search=req.body.search;
  console.log("search data",search);

  Product.find({pTitle:search}).then(result=>{
    console.log("Product found by id:", result);
    res.render("User/ViewProduct", {
      titlePage: "Search Details",
      
      data: result
    });
  })
  .catch((err) => {
    console.log("Product not found", err);
  });
}


