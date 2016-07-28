'use strict';

(function() {
	// Feeds Controller Spec
	describe('FeedsController', function() {
		// Initialize global variables
		var FeedsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Feeds controller.
			FeedsController = $controller('FeedsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Feed object fetched from XHR', inject(function(Feeds) {
			// Create sample Feed using the Feeds service
			var sampleFeed = new Feeds({
				title: 'An Feed about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample feed array that includes the new Feed
			var sampleFeeds = [sampleFeed];

			// Set GET response
			$httpBackend.expectGET('api/feeds').respond(sampleFeeds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.feeds).toEqualData(sampleFeeds);
		}));

		it('$scope.findOne() should create an array with one Feed object fetched from XHR using a FeedId URL parameter', inject(function(Feeds) {
			// Define a sample Feed object
			var sampleFeed = new Feeds({
				title: 'An Feed about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.FeedId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/farmers\/([0-9a-fA-F]{24})$/).respond(sampleFeed);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.Feed).toEqualData(sampleFeed);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Feeds) {
			// Create a sample Feed object
			var sampleFeedPostData = new Feeds({
				title: 'An Feed about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample Feed response
			var sampleFeedResponse = new Feeds({
				_id: '525cf20451979dea2c000001',
				title: 'An Feed about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Feed about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('api/feeds', sampleFeedPostData).respond(sampleFeedResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the Farmer was created
			expect($location.path()).toBe('/feeds/' + sampleFeedResponse._id);
		}));

		it('$scope.update() should update a valid Feed', inject(function(Feeds) {
			// Define a sample Feed put data
			var sampleFeedPutData = new Feeds({
				_id: '525cf20451979dea2c000001',
				title: 'An Feed about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock Feed in scope
			scope.Feed = sampleFeedPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/feeds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/feeds/' + sampleFeedPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid FarmerId and remove the Farmer from the scope', inject(function(Feeds) {
			// Create new Feed object
			var sampleFeed = new Feeds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new feeds array and include the Feed
			scope.feeds = [sampleFeed];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/feeds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFeed);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.feeds.length).toBe(0);
		}));
	});
}());
