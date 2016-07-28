'use strict';

angular.module('feeds').controller('FeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Feeds',
    function ($scope, $stateParams, $location, Authentication, Feeds) {
        $scope.authentication = Authentication;

        $scope.selMix = {item: -1};        // for editing
        $scope.selAnimal = {item: -1};

        $scope.viewAllmixes = true;
        $scope.viewHerd = -1;           // for viewing
        $scope.viewAnimal = null;

        $scope.stat1 = 3;
        $scope.stat2 = 4;
        $scope.stat3 = 5;
        $scope.stat4 = 6;

        ////////////////////////////////////////////////////////////////////////////////////////
        ///////////// Query database
        ////////////////////////////////////////////////////////////////////////////////////////
        var oldestDateWeight;
        var dailyWeightGain = [];
        var mixestats;  // ADWG for each animal within herd by date
        var animalADWG = [];    // NEEDED?
        $scope.herdADWG = [];  // avg ADWG for each herd (by date)
        $scope.chartLabels = [];
        $scope.chartData = [];

        ////////////////////////////////////////////////////////////////////////////////////////
        ///////////// EDIT functions
        ////////////////////////////////////////////////////////////////////////////////////////
        $scope.addHerd = function () {
            $scope.feed.mixes.push({herdName: $scope.newHerdName, animals: [], feeds: []});
            $scope.selMix.item = $scope.feed.mixes.length - 1;
            $scope.newHerdName = '';
        };

        $scope.addFeed = function () {
            if ($scope.selMix.item < 0) return;
            // check if no feed array in place
            //if (!$scope.feed.mixes[$scope.selMix.item].feeds) { $scope.feed.mixes[$scope.selMix.item].feeds = new Array()};
            $scope.feed.mixes[$scope.selMix.item].feeds.push({
                changed: $scope.changed,
                qty: $scope.qty,
                food: $scope.food
            });
            $scope.changed = $scope.qty = $scope.food = '';
        };

        $scope.addAnimal = function () {
            if ($scope.selMix.item < 0) return;
            $scope.feed.mixes[$scope.selMix.item].animals.push({
                tagID: $scope.newTagID,
                sex: $scope.sex,
                dob: $scope.dob,
                weights: []
            });
            $scope.selAnimal.item = $scope.feed.mixes[$scope.selMix.item].length - 1;
            $scope.newTagID = $scope.sex = $scope.dob = '';
        };

        $scope.delAnimal = function (toDelete) {
            if (toDelete < 0) return;
            $scope.feed.mixes[$scope.selMix.item].animals.splice(toDelete, 1);
        };

        $scope.delFeed = function (toDelete) {
            if (toDelete < 0) return;
            $scope.feed.mixes[$scope.selMix.item].feeds.splice(toDelete, 1);
        };

        $scope.create = function () {
            var feed = new Feeds({
                title: this.title,
                firstName: this.firstName,
                lastName: this.lastName,
                address1: this.address1,
                address2: this.address2,
                town: this.town,
                mixes: []
            });
            feed.$save(function (response) {
                $location.path('feeds/' + response._id);

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

        $scope.findOne = function () {	// this retrieves the displayed Feed FIRST (in ng-init) so it's in $scope from get go
            $scope.feed = Feeds.get({
                    feedId: $stateParams.feedId
                },
                function () {
                    if ($scope.feed.mixes.length > 0) {
                        $scope.selMix.item = 0;
                        if ($scope.feed.mixes[0].animals.length > 0)
                            $scope.selAnimal.item = 0;
                    }
                }	// sets ensures first Herd is selected
            );
        };
    }
]);
