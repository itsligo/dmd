'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Food = mongoose.model('Food'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a food
 */
exports.create = function(req, res) {
	var food = new Food(req.body);
	food.user = req.user;

	food.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * Show the current food
 */
exports.read = function(req, res) {
	res.json(req.food);
};

/**
 * Update a food
 */
exports.update = function(req, res) {
	var food = req.food;

	food.title = req.body.title;

	food.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * Delete an food
 */
exports.delete = function(req, res) {
	var food = req.food;

	food.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(food);
		}
	});
};

/**
 * List of foods
 */
exports.list = function(req, res) {
	Food.find().sort('-created').populate('user', 'displayName').exec(function(err, foods) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(foods);
		}
	});
};

/**
 * food middleware
 */
exports.foodByID = function(req, res, next, id) {
	Food.findById(id).populate('user', 'displayName').exec(function(err, food) {
		if (err) return next(err);
		if (!food) return next(new Error('Failed to load food ' + id));
		req.food = food;
		next();
	});
};
