var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog'); // Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');
var session = require("express-session");
var passport = require("passport");


// Create the Express application object
var app = express();

app.use(helmet());

bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
passport.serializeUser((user, done) => {
done(null, user);
});
passport.deserializeUser((obj, done) => {
done(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://nithya:nithya@ds249418.mlab.com:49418/local_library'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//facebook login
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '216703948878762',
    clientSecret: 'eb0f2abd13bb17e7391485aa737af09b',
    callbackURL: "http://localhost:3000/catalog/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    
  	done(null, profile);
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));


//google

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: '215450226766-7ihsaasfnbqn1gr6c41c41hh235kdvgs.apps.googleusercontent.com',
    clientSecret: 'Y-_0NI25yksxvPBA_A6hzh7L',
    callbackURL: "http://localhost:3000/catalog/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile)
       // User.findOrCreate({ googleId: profile.id }, function (err, user) {
       //   return done(err, user);
       // });
  }
));


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog); // Add catalog routes to middleware chain.

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
