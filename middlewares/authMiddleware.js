//This middleware is used to prevent a non-login user from accessing unauthorized pages via url.

const User = require('../models/User')

module.exports = (req, res, next) => {
    
    //This middleware will check our request start session
    User.findById(req.session.userID, (err, user)=>{
        if(err || !user  ) return res.redirect('/login')   // 'login' olursa eğer seni /users/logine atar oyüzden userstan cıkmak gerek
        next()
    })
}