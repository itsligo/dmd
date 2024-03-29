'use strict';

angular.module('farmers').controller('FarmersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Farmers', 'Feeds',
    function ($scope, $stateParams, $location, Authentication, Farmers, Feeds) {
        $scope.authentication = Authentication;

        $scope.selHerd = {item: -1};        // for editing
        $scope.selAnimal = {item: -1};

        $scope.viewAllHerds = false;
        $scope.viewHerd = 0;           // for viewing
        $scope.viewAnimal = null;

        $scope.stat1 = 3;
        $scope.stat2 = 4;
        $scope.stat3 = 5;
        $scope.stat4 = 6;
        $scope.feedMixSub = null;

        ////////////////////////////////////////////////////////////////////////////////////////
        ///////////// Date Range Picker
        ////////////////////////////////////////////////////////////////////////////////////////
        // DatePicker for Feeds
        $scope.openFeed = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedFeed = true;
        };
        $scope.openDOB = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedDOB = true;
        };

        $scope.date = {
            startDate: moment().subtract(1, 'days'),
            endDate: moment()
        };
        $scope.date2 = {
            startDate: moment().subtract(1, 'days'),
            endDate: moment()
        };
        $scope.drpOpts = {
            locale: {
                applyClass: 'btn-info btn',
                cancelLabel: 'Cancel',
                customRangeLabel: 'Last 6 Month',
                firstDay: 1
            },
            ranges: {
                'Last 6 Months': [moment().subtract(6, 'months'), moment()],
                'Last 9 Months': [moment().subtract(9, 'months'), moment()],
                'Last Year': [moment().subtract(11, 'years'), moment()]
            },
            format: 'MMM D, YYYY',
            opens: 'left'
        };

        ////////////////////////////////////////////////////////////////////////////////////////
        ///////////// Query database
        ////////////////////////////////////////////////////////////////////////////////////////
        var oldestDateWeight;
        var dailyWeightGain = [];
        var herdStats;  // ADWG for each animal within herd by date
        var animalADWG = [];    // NEEDED?
        $scope.herdADWG = [];  // avg ADWG for each herd (by date)
        $scope.chartLabels = [];
        $scope.chartData = [];


        var calcADWGPerHead = function () {
            var index, hIndex, aIndex, wIndex;
            var prevDate;
            var peakADWG=0;
            herdStats = new Array($scope.farmer.herds.length);  // array of herds
            for (hIndex = 0; hIndex < $scope.farmer.herds.length; hIndex++) {   // for each Herd
                herdStats[hIndex] = new Array($scope.farmer.herds[hIndex].animals.length);  // create array of animals
                for (aIndex = 0; aIndex < $scope.farmer.herds[hIndex].animals.length; aIndex++) { // examine each animal
                    var animal = $scope.farmer.herds[hIndex].animals[aIndex];   // grab animal
                    herdStats[hIndex][aIndex] = [];    // space for weight points
                    for (wIndex = 0; wIndex < animal.weights.length; wIndex++) {    // examine weigh pts
                        var n = animal.weights[wIndex];
                        if (prevDate) {     // 2nd and subsequent dates
                            var periodDelta = n.weight - prevDate.weight; // weight delta (gain) over period
                            var deltaDays = moment.utc(n.taken).diff(prevDate.dte, 'days');  // days in period
                            var adwg = Math.round((periodDelta / deltaDays)*100)/100;
                            // Push animal date & adwg to animal array in herd array
                            herdStats[hIndex][aIndex].push({dte: n.taken, adwg: adwg}); // record adwg intervals
                            if (adwg>peakADWG) peakADWG = adwg;
                            //for (index = 0; index < deltaDays; index++) {   // build daily points array
                            //    animalADWG.push({dte: (prevDate.dte).add(1, 'days').toISOString(), adwg: adwg});
                            //};
                        }
                        prevDate = {dte: moment.utc(n.taken), weight: n.weight};
                    }   // end weights loop
                    prevDate=false;
                }   // end animal loop
                $scope.stat3 = peakADWG;
                // now loop each animal in herd
                calcADWGAvgPerHerd(hIndex);
            }   // end herd loop
            $scope.genChart(0, 0);
        };

        var calcADWGAvgPerHerd = function (herdIdx) {       // avg ADWG per date pt per herd
            var aIndex, dteIdx;
            var numAnimalsInHerd = herdStats[herdIdx].length;
            var currAnimal, cumulADWG=0;
            $scope.herdADWG.push([]);
            var startingDate = new Date(8640000000000000); // latest possible date
            // find starting date
            for (aIndex = 0; aIndex < numAnimalsInHerd; aIndex++) {     // find earliest first adwg reading from all animals
                //if (herdStats[herdIdx][aIndex][0] && new Date(herdStats[herdIdx][aIndex][0].dte) < startingDate)
                //    startingDate = new Date(herdStats[herdIdx][aIndex][0].dte);
                if (herdStats[herdIdx][aIndex][0] && new Date(herdStats[herdIdx][aIndex][0].dte) < new Date(startingDate))
                    startingDate = herdStats[herdIdx][aIndex][0].dte;
            }
            // next find adwg at startingDate (or next latest) for each animal, then average all readings
            // do following until no date > startingDate
            do  {
                cumulADWG = 0;
                for (aIndex = 0; aIndex < numAnimalsInHerd; aIndex++) {     // for each animal data collection
                    currAnimal = herdStats[herdIdx][aIndex];
                    dteIdx = 0;
                    while (currAnimal[dteIdx] && new Date(currAnimal[dteIdx].dte) < new Date(startingDate)) {
                        dteIdx++;
                    }
                    if (currAnimal[dteIdx]) cumulADWG += currAnimal[dteIdx].adwg;    // add date reading adwg to running total
                }
                $scope.herdADWG[herdIdx].push({dte: startingDate, adwg: Math.round((cumulADWG / numAnimalsInHerd) *100)/100});
            } while ((startingDate = nextDate(herdIdx, startingDate)));
            // iterate over herdADWG
            //    iterate thru feedChgs until changed > herdADWG[current].dte or end of feedChgs
            //    add herdADWG[current].adwg to feedChgs[prev] (cumulative)
            //    incr counter in feedChgs[prev] to facilitate averaging of adwg values later
            if ($scope.farmer.herds[herdIdx].feedChgs.length>0)
              for (var wgh = 0; wgh < $scope.herdADWG[herdIdx].length; wgh++) {
                var currFeedChgIdx = 0;
                var currFeedChg = 0;
                var currWeighDate = new Date($scope.herdADWG[herdIdx][wgh].dte);  // get weigh date

                while (currFeedChgIdx < $scope.farmer.herds[herdIdx].feedChgs.length && new Date($scope.farmer.herds[herdIdx].feedChgs[currFeedChgIdx].changed) <= currWeighDate) {
                  currFeedChgIdx++;
                } // advance to most recent feedChg && so long as there's a feedChg point
                if (currFeedChgIdx>0) currFeedChgIdx--;
                // current weigh date adwg owes itself to no specified feedmix
                if (new Date($scope.farmer.herds[herdIdx].feedChgs[currFeedChgIdx].changed) > currWeighDate) continue;
                // now arrived at most recent feedChg prior to weigh date (most influential feedChg)
                currFeedChg = $scope.farmer.herds[herdIdx].feedChgs[currFeedChgIdx];  // handle to current FeedChg
                if (currFeedChg.cntr) {
                  currFeedChg.cntr++; // incr counter of weightDates for averaging later
                  currFeedChg.adwg+=$scope.herdADWG[herdIdx][wgh].adwg; // running total of adwg to average later
                }
                else {
                   currFeedChg.cntr=1;
                   currFeedChg.adwg=$scope.herdADWG[herdIdx][wgh].adwg;
                }
              }
        };

        var nextDate = function(herdIdx, fromDate)
        {
            var aIndex, currAnimal, dteIdx= 0, candidateDate = new Date(8640000000000000), newCandidate = false;
            var numAnimalsInHerd = herdStats[herdIdx].length;
           /* for (aIndex = 0; aIndex < numAnimalsInHerd; aIndex++) {     // find earliest first adwg reading from all animals
                currAnimal = herdStats[herdIdx][aIndex];
                while (currAnimal[dteIdx] && new Date(currAnimal[dteIdx].dte) <= candidateDate) {
                    dteIdx++; newCandidate = true;
                }
                if ((dteIdx<currAnimal.length-1) && newCandidate && (new Date(currAnimal[dteIdx].dte)<new Date(candidateDate)))
                    candidateDate = currAnimal[dteIdx].dte; // if in range, accept as next highest date
                newCandidate = false;
            };
            if (candidateDate==fromDate) return false;*/
            var nextReadingDate = new Date(8640000000000000), readingIdx=0;
            for (aIndex=0; aIndex< numAnimalsInHerd; aIndex++)
            {
                currAnimal = herdStats[herdIdx][aIndex];
                while (currAnimal[readingIdx] && new Date(currAnimal[readingIdx].dte) <= new Date(fromDate))
                {
                    readingIdx++;
                }
                if (currAnimal[readingIdx] && new Date(currAnimal[readingIdx].dte) < new Date(nextReadingDate))
                    nextReadingDate = currAnimal[readingIdx].dte;
                readingIdx=0;
            }
            if (new Date(nextReadingDate).getTime() === new Date(8640000000000000).getTime())
                return false;
            return nextReadingDate;
            //return false;
        };

        $scope.genChart = function (hIndex, aIndex) {
            $scope.graphData.labels = [];
            $scope.graphData.datasets[0].data = [];
            $scope.graphData.datasets[1].data = [];
            $scope.viewAnimal = aIndex;
            var totalHerdADWG= 0, totalAllADWG= 0, totalFeedPerDay=0;
            var index;
            if (herdStats.length===0) return ($scope.graphData = false);
            for (index = 0; index < herdStats[hIndex][aIndex].length; index++) {
                $scope.graphData.labels.push(moment.utc(herdStats[hIndex][aIndex][index].dte).format('D/M/YY'));
                $scope.graphData.datasets[0].data.push(Math.round(herdStats[hIndex][aIndex][index].adwg * 100) / 100);
                totalHerdADWG+=herdStats[hIndex][aIndex][index].adwg;
            }
            $scope.stat1 = Math.round(totalHerdADWG/herdStats[hIndex][aIndex].length * 100)/100;

            for (index = 0; index < $scope.herdADWG[hIndex].length; index++) {
                $scope.graphData.datasets[1].data.push(Math.round($scope.herdADWG[hIndex][index].adwg * 100) / 100);
                totalAllADWG+=$scope.herdADWG[hIndex][index].adwg;
            }
            $scope.stat2 = Math.round(totalAllADWG/$scope.herdADWG[hIndex].length * 100)/100;

            $scope.graphFeedData.labels = [];
            $scope.graphFeedData.datasets[0].data = [];
            $scope.viewAnimal = aIndex;
            var fIndex;
            for (fIndex = 0; fIndex < $scope.farmer.herds[hIndex].feedChgs.length; fIndex++) { // examine each feed/herd
                var feed = $scope.farmer.herds[hIndex].feedChgs[fIndex];   // grab feed change
                $scope.graphFeedData.labels.push(moment.utc(feed.changed).format('D/M/YY'));
                $scope.graphFeedData.datasets[0].data.push(feed.qty);
                totalFeedPerDay+=feed.qty;
            }   // end feed loop
            $scope.stat4 = Math.round(totalFeedPerDay/$scope.farmer.herds[hIndex].feedChgs.length * 100)/100;
        };

        ////////////////////////////////////////////////////////////////////////////////////////
        ///////////// Chart.js Options
        ////////////////////////////////////////////////////////////////////////////////////////
        $scope.graphFeedData = {
            labels: [],
            datasets: [
                {
                    label: 'Feed',
                    fillColor: 'rgba(120,120,22,0.2)',
                    strokeColor: 'rgba(220,220,22,1)',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 32, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,32,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ],
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || 'Other';
                  var label = data.labels[tooltipItem.index];
                  return datasetLabel + ': ' + label;
                }
              }
            }
        };

        $scope.graphData = {
            labels: [],
            datasets: [
                {
                    label: 'Animal',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                },
                {
                    label: 'Herd',
                    fillColor: 'rgba(151,187,205,0.2)',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#ffff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,0)',
                    data: []
                }
            ]
        };
        $scope.feedOptions = {
            //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero : true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,
            //String - Colour of the grid lines
            scaleGridLineColor : 'rgba(0,0,0,.05)',
            //Number - Width of the grid lines
            scaleGridLineWidth : 1,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
            //Boolean - If there is a stroke on each bar
            barShowStroke : true,
            //Number - Pixel width of the bar stroke
            barStrokeWidth : 2,
            //Number - Spacing between each of the X value sets
            barValueSpacing : 5,
            //Number - Spacing between data sets within X values
            barDatasetSpacing : 1,
            //String - A legend template
            legendTemplate: '<div></div>',
            // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
            tooltipTemplate: '<%if (label){%><%}%><%= value %> kg/day average',
            legend: {
            display: true,
              labels: {
                  fontColor: 'rgb(95, 99, 132)'
              }
            },
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
            }
        };
        $scope.options = {
            scaleOverride: true,
            scaleSteps: 7,
            scaleStepWidth: 0.5,
            scaleStartValue: -1,
            scaleBeginAtZero: false,
            // Sets the chart to be responsive
            responsive: false,
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
            // tooltipTemplate: "<%if (label){%><%= value%>%}",
            //String - A legend template
            // legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><small><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li></small><%}%></ul>',
            legend: {
            display: true,
              labels: {
                  fontColor: 'rgb(95, 99, 132)'
              }
            }
        };

////////////////////////////////////////////////////////////////////////////////////////
///////////// Sparklines Setup
////////////////////////////////////////////////////////////////////////////////////////
        $scope.sparkOptions = {
            scaleLineColor: 'rgba(0,0,0,0)',
            scaleShowLabels: false,
            showTooltips: false,
            scaleShowGridLines: false,
            pointDot: false,
            datasetFill: false,
            scaleFontSize: 1,
            bezierCurve: false,
            animationSteps: 1,
            scaleFontColor: 'rgba(0,0,0,0)'
        };
        $scope.sparkData = {
            datasets: [
                {data: [28, 48, 40, 19, 96, 27, 100]}]
        };

////////////////////////////////////////////////////////////////////////////////////////
///////////// EDIT functions
////////////////////////////////////////////////////////////////////////////////////////
        $scope.addHerd = function () {
            $scope.farmer.herds.push({herdName: $scope.newHerdName, animals: [], feeds: []});
            $scope.selHerd.item = $scope.farmer.herds.length - 1;
            $scope.newHerdName = '';
        };

        // add a single new Feed change for this herd
        $scope.addFeed = function (feed) {
            if ($scope.selHerd.item < 0) return;
            // check if no feed array in place
            //if (!$scope.farmer.herds[$scope.selHerd.item].feeds) { $scope.farmer.herds[$scope.selHerd.item].feeds = new Array()};
            $scope.farmer.herds[$scope.selHerd.item].feedChgs.push({
                changed: $scope.changed,
                qty: $scope.qty,
                feedMix: feed
            });
            $scope.changed = $scope.qty = $scope.feedMix = '';
        };

        $scope.addAnimal = function () {
            if ($scope.selHerd.item < 0) return;
            $scope.farmer.herds[$scope.selHerd.item].animals.push({
                tagID: $scope.newTagID,
                sex: $scope.sex,
                dob: $scope.dob,
                weights: []
            });
            $scope.selAnimal.item = $scope.farmer.herds[$scope.selHerd.item].length - 1;
            $scope.newTagID = $scope.sex = $scope.dob = '';
        };

        $scope.delAnimal = function (toDelete) {
            if (toDelete < 0) return;
            $scope.farmer.herds[$scope.selHerd.item].animals.splice(toDelete, 1);
        };

        $scope.delFeed = function (toDelete) {
            if (toDelete < 0) return;
            $scope.farmer.herds[$scope.selHerd.item].feedChgs.splice(toDelete, 1);
        };

        $scope.genDataPts = function () {
            if ($scope.selAnimal.item < 0) return;	// no Animal selected
            var currAnimal = $scope.farmer.herds[$scope.selHerd.item].animals[$scope.selAnimal.item];
            currAnimal.weights = [];
            var today = moment.utc();
            var prevWeight = Math.floor(Math.random() * (40 - 20)) + 20;
            //console.log("Init: " + prevWeight);
            var nominalDailyWgGain = currAnimal.sex === 'M' ? 0.95 : 0.75;
            var mthWgtGain = 0;
            var previous = moment.utc(currAnimal.dob);
            currAnimal.weights.push({taken: previous.toISOString(), weight: prevWeight});
            previous.add(1, 'months');
            while (previous <= today) {
                mthWgtGain = (Math.random() * (nominalDailyWgGain + 0.5 - nominalDailyWgGain - 0.15) + (nominalDailyWgGain - 0.15)) * 30;    // monthly random weight gain
                if (Math.random() < 0.1) mthWgtGain = -10;
                //console.log('gain: ' + mthWgtGain + ': sex : ' + currAnimal.sex);
                currAnimal.weights.push({       // commit
                    taken: previous.toISOString(),
                    weight: Math.floor(prevWeight += mthWgtGain)
                });
                previous.add(1, 'months');
            }
        };

        $scope.create = function () {
            var farmer = new Farmers({
                title: this.title,
                firstName: this.firstName,
                lastName: this.lastName,
                address1: this.address1,
                address2: this.address2,
                town: this.town,
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

        $scope.findOne = function () {	// this retrieves the displayed Farmer FIRST (in ng-init) so it's in $scope from get go
            $scope.farmer = Farmers.get({
                    farmerId: $stateParams.farmerId
                },
                function () {
                    $scope.feeds = Feeds.query();
                    if ($scope.farmer.herds.length > 0) {
                        $scope.selHerd.item = 0;
                        if ($scope.farmer.herds[0].animals.length > 0)
                            $scope.selAnimal.item = 0;
                    }
                    calcADWGPerHead();
                }	// sets ensures first Herd is selected
            );
        };
    }
]);
