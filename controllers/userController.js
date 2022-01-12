const User  = require('../models/User');
const res = require("express/lib/response");
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
       const userName = req.body.userName
       const password = req.body.password
        
       const user = await User.findOne({userName})
       
 
            if(user) {
                
                bcrypt.compare(password, user.password, (err, same) => {
                //req.session.userID = user._id
                res.status(200).redirect('/')
                })
            }
       
       
   } catch(error) {
       res.status(400).json({
       status:'fail',
       error
       }); 
   }
}
