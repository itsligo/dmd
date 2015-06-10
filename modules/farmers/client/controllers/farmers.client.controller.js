'use strict';

angular.module('farmers').controller('FarmersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Farmers',
    function ($scope, $stateParams, $location, Authentication, Farmers) {
        $scope.authentication = Authentication;

        $scope.selHerd = {item: -1};
        $scope.selAnimal = {item: -1};


        // Chart.js Options
        $scope.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fillColor: 'rgba(220,220,220,0.2)',
                    strokeColor: 'rgba(220,220,220,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    fillColor: 'rgba(151,187,205,0.2)',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        $scope.options = {
            // Sets the chart to be responsive
            responsive: true,
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: 'rgba(0,0,0,.05)',
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - Whether the line is curved between points
            bezierCurve: true,
            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.4,
            //Boolean - Whether to show a dot for each point
            pointDot: true,
            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,
            // Function - on animation progress
            onAnimationProgress: function () {
            },
            // Function - on animation complete
            onAnimationComplete: function () {
            },
            //String - A legend template
            legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><small><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li></small><%}%></ul>'
        };

        // Sparklines Setup
        $scope.sparkOptions = {
            scaleLineColor : 'rgba(0,0,0,0)',
            scaleShowLabels : false,
            showTooltips: false,
            scaleShowGridLines : false,
            pointDot : false,
            datasetFill : false,
            scaleFontSize : 1,
            bezierCurve: false,
            animationSteps: 1,
            scaleFontColor : 'rgba(0,0,0,0)'
        };

        $scope.sparkData = {
            datasets: [
                {data : [28,48,40,19,96,27,100]}]
        };

        $scope.addHerd = function () {
            $scope.farmer.herds.push({herdName: $scope.newHerdName, animals: []});
            $scope.selHerd.item = $scope.farmer.herds.length - 1;
            $scope.newHerdName = '';
        };

        $scope.addAnimal = function () {
            if ($scope.selHerd.item < 0) return;
            $scope.farmer.herds[$scope.selHerd.item].animals.push({tagID: $scope.newTagID, dob: $scope.dob, weights: [], feeds: []});
            $scope.newTagID = '';
        };

        $scope.delAnimal = function (toDelete) {
            if (toDelete < 0) return;
            $scope.farmer.herds[$scope.selHerd.item].animals.splice(toDelete, 1);
        };

        $scope.genDataPts = function () {
            if ($scope.selAnimal.item < 0) return;	// no Animal selected
            $scope.farmer.herds[$scope.selHerd.item].animals[$scope.selAnimal.item].weights = [];
            $scope.farmer.herds[$scope.selHerd.item].animals[$scope.selAnimal.item].feeds = [];
            var e = new Date();
            var s = new Date(new Date() - 24 * 3600 * 1000 * 417 - 1);
            while (s < e) {
                $scope.farmer.herds[$scope.selHerd.item].animals[$scope.selAnimal.item].weights.push({
                    taken: s,
                    weight: Math.floor(Math.random() * (1700 - 15 + 1)) + 15
                });
                $scope.farmer.herds[$scope.selHerd.item].animals[$scope.selAnimal.item].feeds.push({
                    taken: s,
                    qty: Math.floor(Math.random() * (15.0 - 5.0) + 5)
                });
                s = new Date(s.setDate(s.getDate() + 1));
            }
        };

        $scope.create = function () {
            var farmer = new Farmers({
                title: this.title,
                firstName: this.firstName,
                lastName: this.lastName,
                herds: []
            });
            farmer.$save(function (response) {
                $location.path('farmers/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (farmer) {
            if (farmer) {
                farmer.$remove();

                for (var i in $scope.farmers) {
                    if ($scope.farmers[i] === farmer) {
                        $scope.farmers.splice(i, 1);
                    }
                }
            } else {
                $scope.farmer.$remove(function () {
                    $location.path('farmers');
                });
            }
        };

        $scope.update = function () {
            var farmer = $scope.farmer;

            farmer.$update(function () {
                $location.path('farmers/' + farmer._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.farmers = Farmers.query();
        };

        $scope.findOne = function () {	// this retrieves the displayed Farmer FIRST so it's in $scope from get go
            $scope.farmer = Farmers.get({
                    farmerId: $stateParams.farmerId
                },
                function () {
                    if ($scope.farmer.herds.length > 0) {
                        $scope.selHerd.item = 0;
                        if ($scope.farmer.herds[0].animals.length > 0)
                            $scope.selAnimal.item = 0;
                    }
                }	// sets ensures first Herd is selected
            );
        };
    }
]);
