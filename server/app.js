var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/logoSchemas');

const passport = require('./passport');
var LocalStrategy = require('passport-local').Strategy;
var userController = require("./controllers/UserController");

var cors = require("cors");
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);



mongoose.connect('mongodb://localhost/node-graphql', { useUnifiedTopology: true , promiseLibrary: require('bluebird'), useNewUrlParser: true})
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));


  var db = mongoose.connection; 


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true
}

 
 //ALLOW CROSS ORIGIN ACCESS
 app.use(cors(corsOptions));


var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

  app.use(cookieParser("randomSecret"));
  app.use(bodyParser());


/* Snippet below enables Session Management */
 
var MemoryStore = require('memorystore')(session)
app.use(session({
secret: "randomSecret",
name: "gologo-session",
saveUninitialized: false,
resave: false,
cookie: {secure: false, httpOnly: true, maxAge: 8640000},
store: new MemoryStore({checkPeriod: 8640000})
})); 


app.use(passport.initialize());
app.use(passport.session());

 

//var UserModel = require("./models/User");
/*
passport.use(new LocalStrategy(UserModel.authenticate()))
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());
*/

/* End of Session Management */



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
 
 
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));


 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

 



module.exports = app;
