const User  = require('../models/User');
const res = require("express/lib/response");


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

