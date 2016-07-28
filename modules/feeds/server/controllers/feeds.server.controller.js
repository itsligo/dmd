'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Feed = mongoose.model('Feed'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a feed
 */
exports.create = function(req, res) {
	var feed = new Feed(req.body);
	feed.user = req.user;

	feed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(feed);
		}
	});
};

/**
 * Show the current feed
 */
exports.read = function(req, res) {
	res.json(req.feed);
};

/**
 * Update a feed
 */
exports.update = function(req, res) {
	var feed = req.feed;

	feed.title = req.body.title;
	feed.qty = req.body.qty;
	feed.mixes = req.body.mixes;

	feed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(feed);
		}
	});
};

/**
 * Delete an feed
 */
exports.delete = function(req, res) {
	var feed = req.feed;

	feed.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(feed);
		}
	});
};

/**
 * List of feeds
 */
exports.list = function(req, res) {
	Feed.find().sort('-created').populate('user', 'displayName').exec(function(err, feeds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(feeds);
		}
	});
};

/**
 * feed middleware
 */
exports.feedByID = function(req, res, next, id) {
	Feed.findById(id).populate('user', 'displayName').exec(function(err, feed) {
		if (err) return next(err);
		if (!feed) return next(new Error('Failed to load feed ' + id));
		req.feed = feed;
		next();
	});
};
