'use strict';

angular.module('feeds').controller('FeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Feeds','Foods',
    function ($scope, $stateParams, $location, Authentication, Feeds, Foods) {
        $scope.authentication = Authentication;

        $scope.selFood = {item: -1};
        $scope.selMix = {item: -1};        // for editing
        $scope.types = ['success','danger','warning','info'];

        ////////////////////////////////////////////////////////////////////////////////////////
        ///////////// EDIT functions
        ////////////////////////////////////////////////////////////////////////////////////////
        $scope.foods = Foods.query();
        // $scope.firstFood = Foods.find()[0];


        $scope.addFood = function () {    // Permit farmer to add a new Food ingredient (globally for this user)
          var food = new Foods({
              title: this.foodID
          });
          food.$save(function (response) {
              $scope.foodID = '';
              $scope.foods = Foods.query();
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
        };

        $scope.delFood = function(food) {   // Removes a Food from use by this farmer - careful as breaks mixes that have this Food
          food.$delete(function (response) {
            $scope.foods = Foods.query();
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
            console.log(errorResponse.data.message);
          });
        };

        $scope.addToMix = function () {
            if ($scope.selFood.item < 0) return;
            // should check if this Food is already in Mix else return;
            $scope.feed.mixes.push(
              {
                food: $scope.foods[$scope.selFood.item].title,
                shareOfFeed: 25
              });
            for (var i = 0; i < $scope.feed.mixes.length; i++) {
              $scope.feed.mixes[i].shareOfFeed = 100/$scope.feed.mixes.length;
            }
            $scope.selMix.item = $scope.feed.mixes.length - 1;
        };

        $scope.selectMix = function(idx) {
          $scope.selMix.item = idx;
        };

        $scope.delMix = function (toDelete) { // remove a Food from the Mix
            if (toDelete < 0) return;
            $scope.feed.mixes.splice(toDelete, 1);
        };

        $scope.create = function () {
            var feed = new Feeds({
                title: this.title,
                mixes: []
            });
            feed.$save(function (response) {
                $location.path('feeds/' + response._id + '/edit');

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (feed) {
            if (feed) {
                feed.$remove();

                for (var i in $scope.feeds) {
                    if ($scope.feeds[i] === feed) {
                        $scope.feeds.splice(i, 1);
                    }
                }
            } else {
                $scope.feed.$remove(function () {
                    $location.path('feeds');
                });
            }
        };

        $scope.update = function () {
            var feed = $scope.feed;

            feed.$update(function () {
                $location.path('feeds/' + feed._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.feeds = Feeds.query();
        };

        $scope.findOne = function () {	// this retrieves the displayed Farmer FIRST (in ng-init) so it's in $scope from get go
            $scope.feed = Feeds.get({
                    feedId: $stateParams.feedId
                },
                function () {
                    if ($scope.feed.mixes.length > 0) {
                        $scope.selMix.item = 0;
                    }
                }
            );
        };
    }
]);
