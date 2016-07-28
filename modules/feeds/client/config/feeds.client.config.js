'use strict';

// Configuring the Articles module
angular.module('feeds').run(['Menus',
	function(Menus) {

		// Add the farmers dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Feeds',
			state: 'feeds',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'feeds', {
			title: 'List Feeds',
			state: 'feeds.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'feeds', {
			title: 'Create Feeds',
			state: 'feeds.create'
		});
	}
]);
