'use strict';

// Setting up route
angular.module('feeds').config(['$stateProvider',
	function($stateProvider) {
		// Feeds state routing
		$stateProvider.
		state('feeds', {
			abstract: true,
			url: '/feeds',
			template: '<ui-view/>'
		}).
		state('feeds.list', {
			url: '',
			templateUrl: 'modules/feeds/views/list-feeds.client.view.html'
		}).
		state('feeds.create', {
			url: '/create',
			templateUrl: 'modules/feeds/views/create-feed.client.view.html'
		}).
		state('feeds.view', {
			url: '/:feedId',
			templateUrl: 'modules/feeds/views/view-feed.client.view.html'
		}).
		state('feeds.edit', {
			url: '/:feedId/edit',
			templateUrl: 'modules/feeds/views/edit-feed.client.view.html'
		});
	}
]);
