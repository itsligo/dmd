'use strict';

(function() {
	// Farmers Controller Spec
	describe('FarmersController', function() {
		// Initialize global variables
		var FarmersController,
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

			// Initialize the Farmers controller.
			FarmersController = $controller('FarmersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Farmer object fetched from XHR', inject(function(Farmers) {
			// Create sample Farmer using the Farmers service
			var sampleFarmer = new Farmers({
				title: 'An Farmer about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample farmers array that includes the new Farmer
			var sampleFarmers = [sampleFarmer];

			// Set GET response
			$httpBackend.expectGET('api/farmers').respond(sampleFarmers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.farmers).toEqualData(sampleFarmers);
		}));

		it('$scope.findOne() should create an array with one Farmer object fetched from XHR using a FarmerId URL parameter', inject(function(Farmers) {
			// Define a sample Farmer object
			var sampleFarmer = new Farmers({
				title: 'An Farmer about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.FarmerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/farmers\/([0-9a-fA-F]{24})$/).respond(sampleFarmer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.Farmer).toEqualData(sampleFarmer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Farmers) {
			// Create a sample Farmer object
			var sampleFarmerPostData = new Farmers({
				title: 'An Farmer about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample Farmer response
			var sampleFarmerResponse = new Farmers({
				_id: '525cf20451979dea2c000001',
				title: 'An Farmer about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Farmer about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('api/farmers', sampleFarmerPostData).respond(sampleFarmerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the Farmer was created
			expect($location.path()).toBe('/farmers/' + sampleFarmerResponse._id);
		}));

		it('$scope.update() should update a valid Farmer', inject(function(Farmers) {
			// Define a sample Farmer put data
			var sampleFarmerPutData = new Farmers({
				_id: '525cf20451979dea2c000001',
				title: 'An Farmer about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock Farmer in scope
			scope.Farmer = sampleFarmerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/farmers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/farmers/' + sampleFarmerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid FarmerId and remove the Farmer from the scope', inject(function(Farmers) {
			// Create new Farmer object
			var sampleFarmer = new Farmers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new farmers array and include the Farmer
			scope.farmers = [sampleFarmer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/farmers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFarmer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.farmers.length).toBe(0);
		}));
	});
}());
