require('dotenv').config
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const { autoload } = require('laravel-mix')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const session = require('express-session')
const  MongoStore = require('connect-mongo');
const flash = require('express-flash')
const passportLocal = require('passport-local')
const passport = require('passport')


//database connection
const url = 'mongodb://127.0.0.1/product';
mongoose.connect(url);
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('Database is connected for product');
})

//session  config

app.use(session( {
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    //session store
    store: new MongoStore({
        mongooseConnection: connection,
        collection: 'sessions',
        mongoUrl: url,
    }),
    cookie: {maxAge: 24*60*60 * 1000}
}));
app.use(flash());

// passport config
const passportInit = require('./app/config/passport')
app.use(passport.initialize());
app.use(passport.session());
passportInit(passport);
//Assets
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
// global middleware
app.use((req, res, next)=>{
    res.locals.user = req.user
    next()
})

// set template engine
app.use(expressLayout)
app.set('view engine','ejs')
app.set('views', path.join(__dirname, '/resources/views'))

// route setup
require('./routes/web')(app);

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}` )
})