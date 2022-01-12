const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const pageRoute = require('./routes/pageRoute')
const userRoute = require('./routes/userRoute')


const app = express();
global.userIN = null;

//Template Engine
app.set('view engine', 'ejs');

//Connect to db
mongoose.connect('mongodb://localhost/loginregister-db')
         .then(()=> console.log('db connected successfuly'))

//Middlewares
app.use(express.static('public'));
app.use(session({
  secret: 'my_keyboad_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/loginregister-db' })
}))
app.use('*', (req, res, next)=>{
  userIN =req.session.userID
  next()
})


// for parsing application/json
app.use(express.json()) 
 // for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/' , pageRoute)
app.use('/users' , userRoute)


const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server is running on ${port}.`);
});
