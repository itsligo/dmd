'use strict';

// Configuring the Articles module
angular.module('farmers').run(['Menus',
	function(Menus) {
		// Add the farmers dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Farmers',
			state: 'farmers',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'farmers', {
			title: 'List Farmers',
			state: 'farmers.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'farmers', {
			title: 'Create Farmers',
			state: 'farmers.create'
		});
	}
]);
