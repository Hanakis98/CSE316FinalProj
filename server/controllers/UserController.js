var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
 
var mail = require('nodemailer')
var myAccount = mail.createTransport({
service:"gmail",
auth:{
//Email to use is cse316teddy@gmail.com password is MyCSE316password
user:"cse316teddy@gmail.com",
pass:"MyCSE316password"

}
    
})

var userController = {};



/**

RESPONSE FOR WHEN USER ATTEMPTS TO LOGIN OR LOGOUT 

{loggedIn: <true|false>}


RESPOSNE FOR WHEN USER ATTEMPTS TO CREATE ACCOUNT

{}


 */



 userController.logout = function(req, res, next){

var email = req.body.email; 
if(!email) return res.status(404).json({success: false, message: "required args not provided for logout"});
req.logout();

res.status(200).json({success: true, message: "User has been logged out"});

 }




// resets user's password (args: email and password in JSON format )
 // {success: <BOOLEAN>}
userController.resetPassword = function(req, res, next){

    var MIN_PASSWORD_LENGTH = 5; 

    var targetEmail = req.body.email,
    newPassword = req.body.password;

    if(!targetEmail || !newPassword) return res.status(200).json({success: false, message: "REQUIRED ARGS NOT PROVIDED"});

    if(newPassword.length < MIN_PASSWORD_LENGTH) return res.status(200).json({success: false, message: "PASSWORD MUST BE AT LEAST 5 CHARACTERS LONG"});

    // here is where you can implement some kind of validation (is email address valid, is password length valid, etc)


    User.findOneAndUpdate({email: targetEmail}, {password: newPassword}, function(err, user){

        if(err){
            console.log("COULD NOT CHANGE PASSWORD");
            console.error(err);
            return res.status(200).json({success: false, message: "SEE CONSOLE"});
        }


        if(!user) return res.status(404).json({success: false, message: "Check that an account exist for this user: " + targetEmail });

        if(user){
            return res.status(200).json({success: true, message: "Password was successfully reset"});
        }

    });
}




// sends email to user , but returns error message if email cannot be sent or if email does not belong to valid account
userController.forgotPassword = function(req, res, next){
    var email = req.body.email;
    if(!email) return res.json({success: false, message: "NO EMAIL PROVIDED"});
    User.findOne({email: email}, function(err, user){
        console.log(err);
        console.log(user);
        if(err || !user){
        console.log("COUILD NOT FIND USER FOR EMAIL PROVIDED -> userController.forgotPassword");
        console.log(err);
        return res.json({success: false, message: "Could not find account."})
        }


        if(user){

            var mail = {
                from :'cse316teddy@gmail.com',
                to: 'tedhanakis@aol.com',
                subject: "GoLogolo change password",
                html: `<html><a href="http://localhost:3001/changepassword?email=${email}"><h1>Click Here to Reset Your Password</h1></a></html>`
            }

        
        myAccount.sendMail(mail,function(error,info)
        {

            if (error){
                console.log("eror while sending email");
                    console.log(error);
                    console.log(info);
                    return res.json({success:false,message: "Email could not be sent"})
            }
            if (info){
                console.log(info);
                return res.json({success:true,message: "Email was sent"})
             }




        })
        

 // TO DO: SEND EMAIL TO USER TO RESET PASSWORD 
 // IF EMAIL IS SUCCESSFULLY SENT, REturn json where  "success" key is true 
 

        

    } 

    })
}

 

    userController.createUser = function(req, res, next){
      //  var args =  {email: req.body.email, password: req.body.password};
        var newUser =  new User({
            username: req.body.email,
            email: req.body.email, 
            password: req.body.password
        });
        newUser.save(function(err){

        if(err){
 
            if(err.code == 11000){
                return res.status(200).json({message: "DUPLICATE USER", loggedIn: false});
            }

            return res.status(200).json({message: "Could not create account", loggedIn: false});
        }


 
        req.logIn(newUser, function(err){
            if(err)  { return  res.json({loggedIn: false, message: "An error occurred while logging in."});
                 }
                 
            return  res.json({loggedIn: true, message:  "You have successfully created an account", user: req.session.passport.user});
         
        })
 

     })
    
   
 
        


    };




 
userController.performLogin = function(req, res, next){
 
    
    //return res.json({loggedIn: false, message: "YOOOl"});
 

    passport.authenticate('local', function(err, user, info){

        if(err) { 
            return  res.json({loggedIn: false, message: "An error occurred while logging in."})}
        if(!user) {
             return res.json({loggedIn: false, message: info.message});
        }

        req.logIn(user, function(err){
            if(err)  { return  res.json({loggedIn: false, message: "An error occurred while logging in."});
                 }
                 
            return  res.json({loggedIn: true, message:  "", user: req.session.passport.user});
         
        })

    })(req, res, next)
    };
 

/*
userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

*/
module.exports = userController;
