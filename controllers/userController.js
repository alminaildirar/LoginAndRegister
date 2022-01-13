const User = require('../models/User');
const res = require("express/lib/response");
const session = require('express-session');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


//Function that compares information from session and jwt
const verify = (session, token) => {

    //userID info which i received from express-session
    const sessionID = String(session.userID)
    //userID info which i received from jwt
    const tokenID = jwt.decode(token)._id
    //userAgent info which i received from express-session
    const sessionUserAgent = session.userAgent
    //userAgent info which i received from jwt
    const tokenUserAgent = jwt.decode(token).userAgent


    //Check if the userID and userAgent information in both session and jwt MATCH?? then return true
    if ((sessionID === tokenID) && (sessionUserAgent === tokenUserAgent)) {
        return true;
    } else {
        return false;
    }
}



exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).redirect('/login')
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        });
    }
}

exports.loginUser = async (req, res) => {
    try {
        //Get userName and password from register form
        const { userName, password } = req.body

        //Check is there a user with this userName
        const user = await User.findOne({ userName })

        //İf user is exist in db then check password and redirect to homepage
        if (user) {

            bcrypt.compare(password, user.password, (err, same) => {
                req.session.userID = user._id
                req.session.userAgent = req.get('user-agent')
                
                //create and assign a token with userID and userAgent information
                const token = jwt.sign(
                {
                    _id: user._id,
                    userAgent: req.headers['user-agent']
                }, 
                process.env.TOKEN_SECRET, 
                {
                    expiresIn: '1h'
                })
                
                //Sets a cookie
                res.cookie('jwt', token, {
                    httpOnly:true,
                    maxAge: 7200000 // 2hours
                })

                if (verify(req.session, token)) {
                    res.status(200).redirect('/users/dashboard')
                }

            })
        }


    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        });
    }
}


exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID })
    const users = await User.find()

    res.status(200).render('dashboard', {
        user,
        users
    })
}