/** @format */

var express = require("express");
var UserRouter = express.Router();
var User = require("../models/user.model");
var bodyParser = require("body-parser");
var passport = require('passport');
const cors = require('./cors');

var authenticate = require('../authenticate')

UserRouter.use(bodyParser.json())

/* GET users listing. */
UserRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    User.find({})
    .then(users => {
        res.status(200)
        res.json(users);
    })
    .catch(err => next(err));
})
UserRouter.route("/register")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.post(cors.corsWithOptions, (req, res) => {
    console.log(req.body)
    User.register(
        new User({ username: req.body.username }), req.body.password, (err, user) => {            
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-type", "application/json");
            // res.send('error1')
            res.json({ err: err });
          } else {
            user.mailid = req.body.mailid;            
            user.save((err, user) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader("Content-type", "application/json");
                // res.send('error2')
                res.json({ err: err });
                return;
              }
              passport.authenticate("local")(req, res, () => {
                res.statusCode = 200;
                res.setHeader("Content-type", "application/json");
                res.json({ success: true, status: "Registration Successful!", user: user });
              });
            });
          }
        }
      );    
});

UserRouter.route("/login")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .post(cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {
  console.log('got post request on the route /login');
  var token = authenticate.getToken( { _id: req.user._id } );
  console.log(req.user);
  res.statusCode = 200;
  res.setHeader("Content-type", "application/json");
  res.json({ success: true, status: "Login Successful!", token: token, expiresIn: 86400 });
  // passport.authenticate("local", (err, user, info) => {
  //   console.log('err', err);
  //   console.log('user', user);
  //   console.log('info', info);
  //   if (err) {
  //     return next(err);
  //   }
  //   if (!user) {
  //     res.statusCode = 401;
  //     res.setHeader("Content-type", "application/json");
  //     res.json({
  //       success: true,
  //       status: "Login Unsuccessful!",
  //       err: info,
  //     });
  //   }
  //   req.logIn(user, (err) => {
  //     if (err) {
  //       res.statusCode = 401;
  //       res.setHeader("Content-type", "application/json");
  //       res.json({
  //         success: false, status: "Login Unsuccessful!", err: "Could not log in the user!" });
  //     }    
  //     var token = authenticate.getToken({ _id: req.user._id });
  //     res.statusCode = 200;
  //     res.setHeader("Content-type", "application/json");
  //     res.json({success: true, status: "You are successfully logged in!", token: token });})
  // });
    // (req, res, next);
})

module.exports = UserRouter;
