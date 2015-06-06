'use strict';

/**
 * Module dependencies.
 */
var farmersPolicy = require('../policies/farmers.server.policy'),
	farmers = require('../controllers/farmers.server.controller');

module.exports = function(app) {
	// farmers collection routes
	app.route('/api/farmers').all(farmersPolicy.isAllowed)
		.get(farmers.list)
		.post(farmers.create);

	// Single farmer routes
	app.route('/api/farmers/:farmerId').all(farmersPolicy.isAllowed)
		.get(farmers.read)
		.put(farmers.update)
		.delete(farmers.delete);

	// Finish by binding the farmer middleware
	app.param('farmerId', farmers.farmerByID);
};
