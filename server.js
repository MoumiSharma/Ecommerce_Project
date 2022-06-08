const express = require("express");
const appServer = express();

const path = require("path");

const csurf=require('csurf')
const cookieParser=require('cookie-parser')

const Admin_Router = require("./Router/AdminRouter");
const User_Router = require("./Router/UserRouter");
const Auth_Router=require("./Router/AuthRouter")
const UserModel=require("./Model/Auth_Model")
const Home_Router=require("./Router/HomeRouter")
const isAuth = require('./middle-ware/isAuth');
const shopController = require("./Controller/ShopController");
const Shop_Router = require("./Router/ShopRouter");

const mongoose=require('mongoose');

const session=require('express-session')
const mongodb_session=require('connect-mongodb-session')(session)

const flash=require('connect-flash')
const multer=require('multer')//Multer is a node.js middleware for handling multipart/formdata,
//which is primarily used for uploading files
const csurfProtection=csurf()
appServer.use(cookieParser())


// const { collection } = require("./Model/product");
const dbDriver="mongodb+srv://MoumiSharma:Moumi123@cluster0.n1m4w.mongodb.net/MongooseProject?retryWrites=true&w=majority"

appServer.set("view engine", "ejs");
appServer.set("views", "View");

appServer.use(express.urlencoded());
appServer.use(flash())



//to store data in mongodb session collection
const storeValue=new mongodb_session({
  uri:"mongodb+srv://MoumiSharma:Moumi123@cluster0.n1m4w.mongodb.net/MongooseProject",
  collection:'my-session'
})

appServer.use(session({secret:'secret-key',reverse:false,saveUninitialized:false,store:storeValue}))
appServer.use(express.static(path.join(__dirname, "Public")));


appServer.use('/UploadImage',express.static(path.join(__dirname,'UploadImage')))
//to store image

//to use image folder often adding it to database
const filestorage=multer.diskStorage({
  destination:(req,file,callback)=>{
    callback(null,'UploadImage')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
}
})


//file.mimetype==='image/jpg'
const fileFilter=(req,file,callback)=>{
  if(file.mimetype.includes("png")||
     file.mimetype.includes("jpg")||
     file.mimetype.includes("jpeg")||
       file.mimetype.includes("avif")||
     file.mimetype.includes("webp")) 
  {
    callback (null,true)
  }
  else
  {
    callback(null,false)
  }
}

appServer.use(multer({storage:filestorage,
   fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('p_image'))

appServer.use((req,res,next)=>{
  if(!req.session.user)
  {
    return next()
  }



  UserModel.findById(req.session.user._id)
  .then(userValue=>{
    req.user=userValue
    console.log('user details: ',req.user);
    next()
  }).catch(err=>{
     console.log("User not found",err)})
})


// Stripe deals with all security issues itself
// Therefore, that route is placed before csrf protection
// No need for csrf protection for that POST request

appServer.post("/create-order", shopController.postOrder);
appServer.use(csurfProtection)//always after cookie parser and session


appServer.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn;
  res.locals.csrf_token=req.csrfToken()
  next()
})


appServer.use(Admin_Router);
appServer.use(User_Router)
appServer.use(Auth_Router)
appServer.use(Home_Router)
appServer.use(Shop_Router);

// app.get('/500', errorController.get500);

// app.use(errorController.get404);



mongoose.connect(dbDriver,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
  console.log("Database Connected");
  appServer.listen(4010, () => {
        console.log("Server is connected at localhost:4010");
      });
    
})
.catch(err=>{
  console.log("Database not Connected",err);
})
