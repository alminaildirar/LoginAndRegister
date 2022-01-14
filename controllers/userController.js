const User = require('../models/User');
const res = require("express/lib/response");
const session = require('express-session');
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const req = require('express/lib/request');


//Function that compares information from session and jwt
const verify = async(session, token) => {

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

let errors = []
//This function checks values which i get from body.
const checkforRegister = async(reqbody) => {
    
    if(await User.findOne({userName: reqbody.userName})){
        errors.push('Username already exist')
    }
    if(await User.findOne({email: reqbody.email})){
        errors.push('email already exist')
    }
    if(reqbody.password !== reqbody.password2){
        errors.push('Passwords do not match.')
    }
    if(!reqbody.firstName || !reqbody.lastName || !reqbody.password || !reqbody.password2 || !reqbody.email){
        errors.push('Please fill in all fields.')
    }
}

const checkForLogin = async(reqbody) => {
    if(!await User.findOne({userName: reqbody.userName})){
        errors.push('Username already exist')
    }
}


exports.createUser = async (req, res) => {
    try {
        errors = []
        //Before create user, wait for checking process
        await checkforRegister(req.body)
        
        //If there is no error, then create :)
        if(errors.length === 0){
            const user = await User.create(req.body);
            res.status(201).redirect('/login')
        }else{  //If there is a error go back to register page 
                res.status(200).render('register', {
                    errors
                    
                })
        }
        
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
                    httpOnly: true,
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