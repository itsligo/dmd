'use strict';

//Articles service used for communicating with the feeds REST endpoints
angular.module('feeds').factory('Feeds', ['$resource',
	function($resource) {
		return $resource('api/feeds/:feedId', {
			feedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
