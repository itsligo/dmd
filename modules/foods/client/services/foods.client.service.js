'use strict';

//Foods service used for communicating with the foods REST endpoints
angular.module('foods').factory('Foods', ['$resource',
	function($resource) {
		return $resource('api/foods/:foodId', {
			foodId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
