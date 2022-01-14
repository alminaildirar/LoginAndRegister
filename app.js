const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const MongoStore = require('connect-mongo');
const pageRoute = require('./routes/pageRoute')
const userRoute = require('./routes/userRoute');
const { cookie } = require('express/lib/response');


dotenv.config();

//---Init Express App----
const app = express();

//-------Set port number------------
const port = process.env.PORT || 3000; 

//-------Template Engine------
app.set('view engine', 'ejs');

//------------Connect to db---------------------------
mongoose.connect('mongodb+srv://almina:zxc123zxc@cluster0.dlkw6.mongodb.net/auth-db?retryWrites=true&w=majority')
         .then(()=> console.log('db connected successfuly'))

//--------Middlewares-----------
app.use(express.static('public'));

app.use(session({
  //Secret: is a key that will sign a cookie.This key will sign our cookie that is saved to the browser.
  secret: 'auth_secret ',
  //Resave: this is basically just means for every request to the serverwe want to create a new session even
  //if we dont care about if its same user or browser we dont want this so we set FALSE
  resave: false,
  //saveUnitialized: basically means if we have not touched or modified the session, we dont want it to save.
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://almina:zxc123zxc@cluster0.dlkw6.mongodb.net/auth-db?retryWrites=true&w=majority' })
}))


// for parsing application/json
app.use(express.json()) 
 // for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))





//------------Routes-------------
app.use('/' , pageRoute)
app.use('/users' , userRoute)


//-------------Listen------------
app.listen(port, () => {
  console.log(`Server is running on ${port}.`);
});
