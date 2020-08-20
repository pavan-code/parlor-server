const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cart = require('../models/cart');
const cors = require('./cors');

const cartRouter = express.Router();
cartRouter.use(bodyParser.json());

cartRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Cart.find({})
    .then(dishes => {
        if(! dishes) {
            var err = new Error('No dishes in the cart to display');
            err.statusCode = 404;
            next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
    }, err => next(err))
    .catch(err => next(err));
})

.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'application/json');
    res.end('PUT operation is not supported on /cart');    
})

.post(cors.corsWithOptions, (req, res, next) => {
    console.log('added to cart : ', req.body);
    Cart.create(req.body)
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch( err => next(err));
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

.put(cors.corsWithOptions, (req, res, next) => {
    // console.log('req :', req.body);
    Cart.findByIdAndUpdate(req.body._id, { $set : req.body }, { new : true })
    .then(dish => {
        console.log('updated dish: ', dish);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err));
})

.delete(cors.corsWithOptions, (req, res, next) => {
    Cart.findByIdAndRemove(req.params.dishId)
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);s
    }, err => next(err))
    .catch(err => next(err));
})


module.exports = cartRouter;