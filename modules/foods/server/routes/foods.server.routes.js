'use strict';

/**
 * Module dependencies.
 */
var foodsPolicy = require('../policies/foods.server.policy'),
	foods = require('../controllers/foods.server.controller');

module.exports = function(app) {
	// foods collection routes
	app.route('/api/foods').all(foodsPolicy.isAllowed)
		.get(foods.list)
		.post(foods.create);

	// Single food routes
	app.route('/api/foods/:foodId').all(foodsPolicy.isAllowed)
		.get(foods.read)
		.put(foods.update)
		.delete(foods.delete);

	// Finish by binding the food middleware
	app.param('foodId', foods.foodByID);
};
