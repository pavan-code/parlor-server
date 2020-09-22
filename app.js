var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport')
// var authenticate = require('./authenticate');

// router links
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.router');
var dishRouter = require('./routes/dish.router');
var cartRouter = require('./routes/cart.router');

// data base connection
const mongoose = require('mongoose');
const url1 = 'mongodb://localhost:27017/parlor';
const url2 = 'mongodb+srv://pavan:mongodb@101@mflix.naobe.mongodb.net/mflix?retryWrites=true&w=majority'
mongoose.connect(url2, { useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify: false })
.then(db => console.log('Connected to database successfully!!\n\n'))
.catch(err => console.log(err))


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize())

// api end points
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter)
app.use('/cart', cartRouter)

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
