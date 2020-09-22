var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt =  require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken')
var user = require('./models/user.model');

var config = require('./config');


exports.local = passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn : 86400
    })
}
var opts = {}
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    
    new jwtStrategy(opts, (payload, done) => {
        // console.log("payload: ",payload);
        user.findOne({ _id: payload._id}, (err, user) => {
            if(err)
                return done(err, false)
            else if (user)
                return done(null, user)
            else
                return done(null, false)
        })
    })
)

exports.verifyUser = passport.authenticate("jwt", {session: false})

