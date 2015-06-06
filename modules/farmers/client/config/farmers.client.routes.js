'use strict';

// Setting up route
angular.module('farmers').config(['$stateProvider',
	function($stateProvider) {
		// Farmers state routing
		$stateProvider.
		state('farmers', {
			abstract: true,
			url: '/farmers',
			template: '<ui-view/>'
		}).
		state('farmers.list', {
			url: '',
			templateUrl: 'modules/farmers/views/list-farmers.client.view.html'
		}).
		state('farmers.create', {
			url: '/create',
			templateUrl: 'modules/farmers/views/create-farmer.client.view.html'
		}).
		state('farmers.view', {
			url: '/:farmerId',
			templateUrl: 'modules/farmers/views/view-farmer.client.view.html'
		}).
		state('farmers.edit', {
			url: '/:farmerId/edit',
			templateUrl: 'modules/farmers/views/edit-farmer.client.view.html'
		});
	}
]);
