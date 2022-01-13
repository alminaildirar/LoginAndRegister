const User  = require('../models/User');
const res = require("express/lib/response");
const session = require('express-session')
const bcrypt = require('bcrypt');



exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
            res.status(201).redirect('/login')           
        } catch(error) {
            res.status(400).json({
            status:'fail',
            error
            }); 
        }
}


exports.loginUser =  async(req, res) => {
    try {
       //Get userName and password from register form
       const {userName, password} = req.body
       
       //Check is there a user with this userName
       const user = await User.findOne({userName})
       
            //İf user is exist in db then check password and redirect to homepage
            if(user) {
                
                bcrypt.compare(password, user.password, (err, same) => {
                req.session.userID = user._id
                req.session.userAgent = req.get('user-agent')
                console.log(req.session)
                res.status(200).redirect('/users/dashboard')
                })
            }
       
       
   } catch(error) {
       res.status(400).json({
       status:'fail',
       error
       }); 
   }
}


exports.logoutUser = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
}

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID})
    const users = await User.find()
    console.log(users)
    res.status(200).render('dashboard', {
        user,
        users
    })
}