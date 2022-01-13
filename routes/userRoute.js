const router = require('express').Router()
const userController = require('../controllers/userController');
const checkMiddleware = require('../middlewares/checkMiddleware');


//http://localhost:3000/users/....

router.route('/register').post(userController.createUser)
router.route('/login').post(userController.loginUser)
router.route('/logout').get(userController.logoutUser)

//Before routing, check first is it has authorization for this page, then get the page 
router.route('/dashboard').get(checkMiddleware.hasAuthForDashboard, userController.getDashboardPage)

module.exports = router;