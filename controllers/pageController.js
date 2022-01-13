const res = require("express/lib/response");

const User = require('../models/User')

//http://localhost:3000/...

exports.getIndexPage = async (req, res) => {

    if(req.session.userID)
    {
        const user = await User.findOne({ _id: req.session.userID})
        res.status(200).render('index', {
            user
        })
    }else {
        const user = null;
        res.status(200).render('index', {
            user
        })
    }

}

exports.getLoginPage = (req, res) => {
    res.status(200).render('login')
}

exports.getRegisterPage = (req, res) => {
    res.status(200).render('register')
}