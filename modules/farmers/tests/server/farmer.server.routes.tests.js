'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Farmer = mongoose.model('Farmer'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, farmer;

/**
 * Farmer routes tests
 */
describe('Farmer CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new farmer
		user.save(function() {
			farmer = {
				title: 'Farmer Title',
				content: 'Farmer Content'
			};

			done();
		});
	});

	it('should be able to save an farmer if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new farmer
				agent.post('/api/farmers')
					.send(farmer)
					.expect(200)
					.end(function(farmerSaveErr, farmerSaveRes) {
						// Handle farmer save error
						if (farmerSaveErr) done(farmerSaveErr);

						// Get a list of farmers
						agent.get('/api/farmers')
							.end(function(farmersGetErr, farmersGetRes) {
								// Handle farmer save error
								if (farmersGetErr) done(farmersGetErr);

								// Get farmers list
								var farmers = farmersGetRes.body;

								// Set assertions
								(farmers[0].user._id).should.equal(userId);
								(farmers[0].title).should.match('Farmer Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an farmer if not logged in', function(done) {
		agent.post('/api/farmers')
			.send(farmer)
			.expect(403)
			.end(function(farmerSaveErr, farmerSaveRes) {
				// Call the assertion callback
				done(farmerSaveErr);
			});
	});

	it('should not be able to save an farmer if no title is provided', function(done) {
		// Invalidate title field
		farmer.title = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new farmer
				agent.post('/api/farmers')
					.send(farmer)
					.expect(400)
					.end(function(farmerSaveErr, farmerSaveRes) {
						// Set message assertion
						(farmerSaveRes.body.message).should.match('Title cannot be blank');

						// Handle farmer save error
						done(farmerSaveErr);
					});
			});
	});

	it('should be able to update an farmer if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new farmer
				agent.post('/api/farmers')
					.send(farmer)
					.expect(200)
					.end(function(farmerSaveErr, farmerSaveRes) {
						// Handle farmer save error
						if (farmerSaveErr) done(farmerSaveErr);

						// Update farmer title
						farmer.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing farmer
						agent.put('/api/farmers/' + farmerSaveRes.body._id)
							.send(farmer)
							.expect(200)
							.end(function(farmerUpdateErr, farmerUpdateRes) {
								// Handle farmer update error
								if (farmerUpdateErr) done(farmerUpdateErr);

								// Set assertions
								(farmerUpdateRes.body._id).should.equal(farmerSaveRes.body._id);
								(farmerUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of farmers if not signed in', function(done) {
		// Create new farmer model instance
		var farmerObj = new Farmer(farmer);

		// Save the farmer
		farmerObj.save(function() {
			// Request farmers
			request(app).get('/api/farmers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single farmer if not signed in', function(done) {
		// Create new farmer model instance
		var farmerObj = new Farmer(farmer);

		// Save the farmer
		farmerObj.save(function() {
			request(app).get('/api/farmers/' + farmerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', farmer.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an farmer if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new farmer
				agent.post('/api/farmers')
					.send(farmer)
					.expect(200)
					.end(function(farmerSaveErr, farmerSaveRes) {
						// Handle farmer save error
						if (farmerSaveErr) done(farmerSaveErr);

						// Delete an existing farmer
						agent.delete('/api/farmers/' + farmerSaveRes.body._id)
							.send(farmer)
							.expect(200)
							.end(function(farmerDeleteErr, farmerDeleteRes) {
								// Handle farmer error error
								if (farmerDeleteErr) done(farmerDeleteErr);

								// Set assertions
								(farmerDeleteRes.body._id).should.equal(farmerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an farmer if not signed in', function(done) {
		// Set farmer user
		farmer.user = user;

		// Create new farmer model instance
		var farmerObj = new Farmer(farmer);

		// Save the farmer
		farmerObj.save(function() {
			// Try deleting farmer
			request(app).delete('/api/farmers/' + farmerObj._id)
			.expect(403)
			.end(function(farmerDeleteErr, farmerDeleteRes) {
				// Set message assertion
				(farmerDeleteRes.body.message).should.match('User is not authorized');

				// Handle farmer error error
				done(farmerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function() {
			Farmer.remove().exec(done);
		});
	});
});
