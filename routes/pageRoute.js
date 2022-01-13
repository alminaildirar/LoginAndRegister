const router = require('express').Router()
const pageController = require('../controllers/pageController');
const checkMiddleware = require('../middlewares/checkMiddleware');

//http://localhost:3000...

router.route('/').get(pageController.getIndexPage)

//First check, if the user is already logged in, user can not open login or register pages.
router.route('/login').get(checkMiddleware.alreadyLogin ,pageController.getLoginPage)
router.route('/register').get(checkMiddleware.alreadyLogin,pageController.getRegisterPage)


module.exports = router;


