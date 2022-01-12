const router = require('express').Router()
const userController = require('../controllers/userController');

//http://localhost:3000/users/....

router.route('/register').post(userController.createUser)
router.route('/login').post(userController.loginUser)

module.exports = router;