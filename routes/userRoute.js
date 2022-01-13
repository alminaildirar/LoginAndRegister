const router = require('express').Router()
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware')

//http://localhost:3000/users/....

router.route('/register').post(userController.createUser)
router.route('/login').post(userController.loginUser)

router.route('/dashboard').get(authMiddleware, userController.getDashboardPage)

module.exports = router;