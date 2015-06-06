'use strict';

//Articles service used for communicating with the farmers REST endpoints
angular.module('farmers').factory('Farmers', ['$resource',
	function($resource) {
		return $resource('api/farmers/:farmerId', {
			farmerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
