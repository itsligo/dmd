'use strict';

angular.module('foods').controller('FoodsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Foods',
    function ($scope, $stateParams, $location, Authentication, Foods) {
        $scope.authentication = Authentication;

        $scope.selHerd = {item: -1};        // for editing
        $scope.selAnimal = {item: -1};

        $scope.viewAllHerds = true;
        $scope.viewHerd = -1;           // for viewing
        $scope.viewAnimal = null;

////////////////////////////////////////////////////////////////////////////////////////
///////////// EDIT functions
////////////////////////////////////////////////////////////////////////////////////////
        $scope.addHerd = function () {
            $scope.food.herds.push({herdName: $scope.newHerdName, animals: [], feeds: []});
            $scope.selHerd.item = $scope.food.herds.length - 1;
            $scope.newHerdName = '';
        };

        $scope.delFeed = function (toDelete) {
            if (toDelete < 0) return;
            $scope.food.herds[$scope.selHerd.item].feeds.splice(toDelete, 1);
        };

        $scope.create = function () {
            var food = new Foods({
                title: this.title,
                firstName: this.firstName,
                lastName: this.lastName,
                address1: this.address1,
                address2: this.address2,
                town: this.town,
                herds: []
            });
            food.$save(function (response) {
                $location.path('foods/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (food) {
            if (food) {
                food.$remove();

                for (var i in $scope.foods) {
                    if ($scope.foods[i] === food) {
                        $scope.foods.splice(i, 1);
                    }
                }
            } else {
                $scope.food.$remove(function () {
                    $location.path('foods');
                });
            }
        };

        $scope.update = function () {
            var food = $scope.food;

            food.$update(function () {
                $location.path('foods/' + food._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.foods = Foods.query();
        };

        $scope.findOne = function () {	// this retrieves the displayed Farmer FIRST (in ng-init) so it's in $scope from get go
            $scope.food = Foods.get({
                    foodId: $stateParams.foodId
                },
                function () {
                    console.log('Retrieved Food: ',$scope.food);
                }	// sets ensures first Herd is selected
            );
        };
    }
]);
