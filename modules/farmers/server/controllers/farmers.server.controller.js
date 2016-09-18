'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Farmer = mongoose.model('Farmer'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a farmer
 */
exports.create = function(req, res) {
	var farmer = new Farmer(req.body);
	farmer.user = req.user;

	farmer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(farmer);
		}
	});
};

/**
 * Show the current farmer
 */
exports.read = function(req, res) {
	res.json(req.farmer);
};

/**
 * Update a farmer
 */
exports.update = function(req, res) {
	var farmer = req.farmer;

	farmer.title = req.body.title;
	farmer.firstName = req.body.firstName;
	farmer.lastName = req.body.lastName;
	farmer.address1 = req.body.address1;
	farmer.address2 = req.body.address2;
	farmer.town = req.body.town;
	farmer.herds = req.body.herds;

	farmer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(farmer);
		}
	});
};

/**
 * Delete an farmer
 */
exports.delete = function(req, res) {
	var farmer = req.farmer;

	farmer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(farmer);
		}
	});
};

/**
 * List of farmers
 */
exports.list = function(req, res) {
	Farmer.find().sort('-created').populate('user', 'displayName').exec(function(err, farmers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(farmers);
		}
	});
};

/**
 * farmer middleware
 */
exports.farmerByID = function(req, res, next, id) {
	// Farmer.findById(id).populate('user', 'displayName').exec(function(err, farmer) {
	Farmer.findById(id).populate('herds.feedChgs.feedMix').populate('user', 'displayName').exec(function(err, farmer) {
		if (err) return next(err);
		if (!farmer) return next(new Error('Failed to load farmer ' + id));
		req.farmer = farmer;
		next();
	});
};
