const res = require("express/lib/response");

//http://localhost:3000/...

exports.getIndexPage = (req, res) => {
    console.log(req.session)
    res.status(200).render('index')
}

exports.getLoginPage = (req, res) => {
    res.status(200).render('login')
}

exports.getRegisterPage = (req, res) => {
    res.status(200).render('register')
}