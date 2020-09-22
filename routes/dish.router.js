const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Dishes = require('../models/dish.model');
const cors = require('./cors');
const authenticate = require('../authenticate');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then(dishes => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes);
    }, err => next(err))
    .catch(err => next(err));
})

.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'application/json');
    res.end('PUT operation is not supported on /dishes')
})

.post(cors.corsWithOptions, (req, res, next) => {
    Dishes.create(req.body)
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        console.log('dish created: ', dish);                            // dish inserted
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err));
})

.delete(cors.corsWithOptions, (req, res, next) => {
    Dishes.deleteMany({})
    .then(dishes => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        console.log('delete dish: ', dish);                             // dish deleted
        res.json(dishes);
    }, err => next(err))
    .catch(err => next(err));
})

// =====================================================================================================================================================

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(! dish) {
            res.statusCode = 404;
            res.end('Dish not found');
        }
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        console.log('dish retrieved: ', dish);                          // dish retrieved
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err));
})

.put(cors.corsWithOptions, (req, res, next) => {
    console.log(req.body);
    Dishes.findByIdAndUpdate(req.params.dishId, { $set : req.body }, { new : true })
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        console.log('dish updated: ', dish);                          // dish updates
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err))
})

.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'application/json');
    res.end('POST operation is not supported on /dishes/'+req.params.dishId);
})

.delete(cors.corsWithOptions, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(dish => {        
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        console.log('deleted dish: ', dish);                            // deleted dish
        res.json(dish)
    }, err => next(err))
    .catch(err => next(err));
})

module.exports = dishRouter;