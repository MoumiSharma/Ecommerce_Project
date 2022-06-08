const RegistrationModel=require('../Model/Auth_Model')

const bcrypt=require('bcryptjs')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: 'SG.asT5R0LJSsOsGhR0VseMSw.lu2lWTKbuAllkd15qgjBs1j0SfldA16B6VFkFVXBwn0'
    }
}));

exports.regFormDisplay=(req,res)=>{
    let message=req.flash('error')
    if(message.length>0)
    {
        message=message[0]
    }
    else{
        message=null
    }
    res.render('Auth/Registration',{
        titlePage:"Registration Form",
        path:'/addUsers',
        errorMsg:message,
        error:[]
    })
}



exports.regDataController=(req,res)=>{
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;
    const password=req.body.password

    console.log(firstname,lastname,email,password);

     let error=validationResult(req)
     if(!error.isEmpty())
     {

        errorResponse=validationResult(req).array()
        console.log("errorResponse",errorResponse);
        res.render('Auth/Registration',{
            titlePage:"Registration Form",
            path:'/addUsers',
            errorMsg:'',
            error:errorResponse
     })
    }
    else
    {
        RegistrationModel.findOne({email:email})
        .then(userValue=>{
            if(userValue)
            {
                req.flash('error','Error::Invalid mail')
                console.log(userValue,"Email already exist");
                return res.redirect('/addUsers')
            }
            return bcrypt.hash(password,12)
        .then(hashPassword=>{
            const userData=new RegistrationModel({fname:firstname,lname:lastname,email:email,password:hashPassword})
            return userData.save()
        }).then(result=>{
            console.log("Registration done");
            return res.redirect('/loginForm')
        }).catch(err=>{
            console.log(err);
        }).catch(err=>{
            console.log("Error in findOne");
        })
        })
        
    }


   
}



exports.loginDisplay=(req,res)=>{
    let message=req.flash('error')
    if(message.length>0)
    {
      message=message[0]

    }
    else{
        message=null
    }
    res.render('Auth/Login',{
        titlePage:"Login Page",
        path:'/loginForm',
        errorMsg:message,
        error:[],
        cookie_value:req.cookies,
    })
}



exports.postLogin=(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    const checked=req.body.checked;

    let error=validationResult(req)
     if(!error.isEmpty())
     {

        errorResponse=validationResult(req).array()
        console.log("errorResponse",errorResponse);
        res.render('Auth/Registration',{
            titlePage:"Registration Form",
            path:'/addUsers',
            errorMsg:'',
            error:errorResponse
     })
    }
    else
    {

    RegistrationModel.findOne({email:email})
    .then(userValue=>{
        if(!userValue)
        {
            console.log("Invalid email");
            req.flash('error','Error::Invalid mail')
            
            return res.redirect('/loginForm')
        }
        bcrypt.compare(password,userValue.password)
        .then(result=>{
            if(!result)
            {
                req.flash('error','Error::Invalid password')
                     console.log("Invalid password");
            }
            else
            {
                  console.log("Logged in ",result);
                  req.session.isLoggedIn=true;
                  //isLoggedin is a user defined variable in the session to check user is logged in or not
                  req.session.user=userValue
                  return req.session.save(err=>{
                      if(err)
                      {
                          console.log(err);
                      }
                      else{
                          if(checked)
                          {
                              const cookie_data={
                                  emailCookkie:userValue.email,
                                  passwordCookie:password
                              };
                              res.cookie("cookieData",cookie_data,{
                                  expires:new DataTransfer(Data.now() + 12000000),
                                  httpOnly:true
                              })
                          }
                      }
                      console.log('logged in');
                      return res.redirect('/user/products')
                  })
                 
                     
            }
            res.redirect('/loginForm')
        }).catch(err=>{
            console.log(err);
            res.redirect('/loginForm')
        })
    }).catch(err=>{
        console.log("Error to find email: ",err);
    })
}
}



exports.logout=(req,res)=>{
    req.session.destroy()
    return res.redirect('/loginForm')
    
}

