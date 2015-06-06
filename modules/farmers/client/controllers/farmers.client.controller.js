'use strict';

angular.module('farmers').controller('FarmersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Farmers',
	function($scope, $stateParams, $location, Authentication, Farmers) {
		$scope.authentication = Authentication;

		$scope.selHerd = {item: -1};
		$scope.selAnimal = {item: -1};

		$scope.addHerd = function() {
			$scope.farmer.herds.push({herdName:$scope.newHerdName, animals:[]});
			$scope.selHerd.item = $scope.farmer.herds.length-1;
			$scope.newHerdName = '';
		};

		$scope.addAnimal = function() {
			if ($scope.selHerd.item < 0) return;
			$scope.farmer.herds[$scope.selHerd.item].animals.push({tagID:$scope.newTagID, weights:[], temps:[]});
			$scope.newTagID = '';
		};

		$scope.delAnimal = function(toDelete) {
			if (toDelete < 0) return;
			$scope.farmer.herds[$scope.selHerd.item].animals.splice(toDelete,1);
		};

		$scope.create = function() {
			var farmer = new Farmers({
				title: this.title,
				firstName: this.firstName,
				lastName: this.lastName
			});
			farmer.$save(function(response) {
				$location.path('farmers/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(farmer) {
			if (farmer) {
				farmer.$remove();

				for (var i in $scope.farmers) {
					if ($scope.farmers[i] === farmer) {
						$scope.farmers.splice(i, 1);
					}
				}
			} else {
				$scope.farmer.$remove(function() {
					$location.path('farmers');
				});
			}
		};

		$scope.update = function() {
			var farmer = $scope.farmer;

			farmer.$update(function() {
				$location.path('farmers/' + farmer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.farmers = Farmers.query();
		};

		$scope.findOne = function() {	// this retrieves the displayed Farmer FIRST so it's in $scope from get go
			$scope.farmer = Farmers.get({
				farmerId: $stateParams.farmerId},
				function() { if ($scope.farmer.herds.length>0) $scope.selHerd.item = 0;}	// sets ensures first Herd is selected
			);
		};
	}
]);
