

const User = require('../models/User')


//This is used to prevent a non-login user from accessing unauthorized pages via url.
exports.hasAuthForDashboard = (req, res, next) => {
    
    User.findById(req.session.userID, (err, user)=>{
        if(err || !user  ) return res.redirect('/login')   
        next()
    })
}

//If the user is logged in, if he wants to go to the login page from the url again?
exports.alreadyLogin = (req, res, next) => {
    if(req.session.userID){
        return res.redirect('/')
    }
    next()
}