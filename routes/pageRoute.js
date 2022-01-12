const router = require('express').Router()
const pageController = require('../controllers/pageController');

//http://localhost:3000...

router.route('/').get(pageController.getIndexPage)
router.route('/login').get(pageController.getLoginPage)
router.route('/register').get(pageController.getRegisterPage)


module.exports = router;


