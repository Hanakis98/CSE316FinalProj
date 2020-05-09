var express = require('express');
var router = express.Router();
var userController = require("../controllers/UserController");

 

router.post('/logout', userController.logout);
 

// all ajax requests to log in 
router.post('/login', userController.performLogin);



//create new user
router.post('/register', userController.createUser);


//actually resets user's password
router.post('/reset', userController.resetPassword);

// sends the email to reover user's password
router.post('/forgot', userController.forgotPassword);


  function isAuthenticated(req,res,next){
   try{
   if(req.session.passport && req.session.passport.user)
      return next();
   else
     // return res.status(401).json({loggedIn: false, message: req.session});
     return res.status(200).json({loggedIn: false, message: ""});
   } catch(exception){
        console.log(exception);
        return res.status(200).json({loggedIn: false, message: "An internal server error occurred. Check your logs"});
   }
}






//really no reason to make this a post request
router.get('/checkauth', isAuthenticated, function(req, res){

console.log(req.session);
       
    res.status(200).json({
      loggedIn: true, 
      userEmail: req.session.passport.user.email
    });
});

module.exports = router;

