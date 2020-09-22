const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cart = require('../models/cart.model');
const cors = require('./cors');
var authenticate = require('../authenticate')

const cartRouter = express.Router();
cartRouter.use(bodyParser.json());

cartRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // console.log(req.user._id);
    Cart.findOne( { user : req.user._id })
    .populate('dishes')
    .then(user => {
        // console.log(user);
        if(user) {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(user.dishes);
        }
        else {

        }
    }, err => next(err))
    .catch(err => next(err))
    // Cart.findOne({ user: req.user._id }, (err, dishes) => {
    //     if(err) {
    //         return next(err)
    //     }
    //     else {
    //         if(dishes) {
    //             console.log('dishes: ', dishes);
    //             res.statusCode = 200;
    //             res.setHeader('Content-type','application/json');
    //             res.json(dishes)
    //         }
    //         else {
    //             console.log('no dishes in cart');
    //             res.send('no dishes to display')
    //         }
    //     }
            
    // })
    // .populate('user')
    // .populate('dishes')
    
})

.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'application/json');
    res.end('PUT operation is not supported on /cart');    
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // console.log('added to cart : ', req.body); 
    // console.log('user', req.user._id);
    Cart.findOne({ user : req.user._id })
    .then(cart  => {
        // console.log('cart', cart);

        if(!cart) {
            var obj = {
                user : req.user._id,
                dishes : []
            }
            // req.body.quantity = 1;
            // console.log(req.body);
            obj.dishes.push(req.body)
            Cart.create(obj)
            .then(cart => {
                // console.log('add to cart', cart);
                res.statusCode = 200;
                res.setHeader('Content-type', 'aplication/json')
                res.json(cart)
            }, err => next(err))
            .catch(err => next(err))
        }
        else {
            // console.log('one dish is there');
            console.log(req.body);
            var dishes = cart.dishes;
            // console.log('exsiting dishes: ', dishes);
            // console.log('adding dish: ', req.body._id);
            if(dishes.includes(req.body.dishId)) {
                // console.log('in the cart');
                var err = new Error('Item is already present in the cart!!')
                err.statusCode = 401;                               
                return next(err)
            }
            else {
                // console.log('not in the cart',req.body._id);                
                // console.log(req.body);

                cart.dishes.push(req.body.dishId)
                cart.save()
                .then(dishes => {
                    console.log('updated cart: ', dishes);
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(dishes)
                }, err => next(err))
                .catch(err => next(err))
            }
        }
    })
    .catch(err => console.log('err', err))    
})

.delete(cors.corsWithOptions, (req,res, next) => {
    Cart.deleteMany({})
    .then(dishes => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
    }, err => next(err))
    .catch(err => next(err));
})

// =============================================================================================================================================

cartRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('req :', req.body);
    Cart.findOne( { user : req.user._id } )
    // .populate('user')
    .populate('dishes')
    .then(user => {
        // console.log('user', user);
        for(var i=0; i<user.dishes.length; i++) {
            console.log('id: ', user.dishes[i]);
            // console.log(user.dishes[i]._id.toString() == req.params.dishId);
            if(user.dishes[i]._id == req.params.dishId) {
                // console.log('match found');
                user.dishes[i].quantity = req.body.quantity;
                // console.log(user.dishes[i]);
                // console.log(user);
                user.save()
                .then(dishes => {
                    console.log('after saved: ', dishes);
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(dishes)
                }, err => next(err))
                .catch(err => next(err))
                break
            }
        }
    }, err => next(err))
    .catch(err => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Cart.findOne( { user : req.user._id }, (err, user) => {
        if(err) return next(err)
        else {
            if(user) {
                // console.log(user.dishes);
                // let index = user.dishes.indexOf(req.params.dishId);
                user.dishes.remove(req.params.dishId);
                // console.log(user.dishes);
                user.save()
                .then(dishes => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(dishes)

                }, err => next(err))
                .catch(err => next(err))
            }
            else {

            }
        }
    })

    // Cart.findByIdAndRemove(req.params.dishId)
    // .then(dish => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-type', 'application/json');
    //     res.json(dish);
    // }, err => next(err))
    // .catch(err => next(err));
})


module.exports = cartRouter;