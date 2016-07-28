'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	feed = mongoose.model('feed'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, feed;

/**
 * feed routes tests
 */
describe('feed CRUD tests', function() {
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

		// Save a user to the test db and create new feed
		user.save(function() {
			feed = {
				title: 'feed Title',
				content: 'feed Content'
			};

			done();
		});
	});

	it('should be able to save an feed if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new feed
				agent.post('/api/feeds')
					.send(feed)
					.expect(200)
					.end(function(feedSaveErr, feedSaveRes) {
						// Handle feed save error
						if (feedSaveErr) done(feedSaveErr);

						// Get a list of feeds
						agent.get('/api/feeds')
							.end(function(feedsGetErr, feedsGetRes) {
								// Handle feed save error
								if (feedsGetErr) done(feedsGetErr);

								// Get feeds list
								var feeds = feedsGetRes.body;

								// Set assertions
								(feeds[0].user._id).should.equal(userId);
								(feeds[0].title).should.match('feed Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an feed if not logged in', function(done) {
		agent.post('/api/feeds')
			.send(feed)
			.expect(403)
			.end(function(feedSaveErr, feedSaveRes) {
				// Call the assertion callback
				done(feedSaveErr);
			});
	});

	it('should not be able to save an feed if no title is provided', function(done) {
		// Invalidate title field
		feed.title = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new feed
				agent.post('/api/feeds')
					.send(feed)
					.expect(400)
					.end(function(feedSaveErr, feedSaveRes) {
						// Set message assertion
						(feedSaveRes.body.message).should.match('Title cannot be blank');

						// Handle feed save error
						done(feedSaveErr);
					});
			});
	});

	it('should be able to update an feed if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new feed
				agent.post('/api/feeds')
					.send(feed)
					.expect(200)
					.end(function(feedSaveErr, feedSaveRes) {
						// Handle feed save error
						if (feedSaveErr) done(feedSaveErr);

						// Update feed title
						feed.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing feed
						agent.put('/api/feeds/' + feedSaveRes.body._id)
							.send(feed)
							.expect(200)
							.end(function(feedUpdateErr, feedUpdateRes) {
								// Handle feed update error
								if (feedUpdateErr) done(feedUpdateErr);

								// Set assertions
								(feedUpdateRes.body._id).should.equal(feedSaveRes.body._id);
								(feedUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of feeds if not signed in', function(done) {
		// Create new feed model instance
		var feedObj = new feed(feed);

		// Save the feed
		feedObj.save(function() {
			// Request feeds
			request(app).get('/api/feeds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single feed if not signed in', function(done) {
		// Create new feed model instance
		var feedObj = new feed(feed);

		// Save the feed
		feedObj.save(function() {
			request(app).get('/api/feeds/' + feedObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', feed.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an feed if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new feed
				agent.post('/api/feeds')
					.send(feed)
					.expect(200)
					.end(function(feedSaveErr, feedSaveRes) {
						// Handle feed save error
						if (feedSaveErr) done(feedSaveErr);

						// Delete an existing feed
						agent.delete('/api/feeds/' + feedSaveRes.body._id)
							.send(feed)
							.expect(200)
							.end(function(feedDeleteErr, feedDeleteRes) {
								// Handle feed error error
								if (feedDeleteErr) done(feedDeleteErr);

								// Set assertions
								(feedDeleteRes.body._id).should.equal(feedSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an feed if not signed in', function(done) {
		// Set feed user
		feed.user = user;

		// Create new feed model instance
		var feedObj = new feed(feed);

		// Save the feed
		feedObj.save(function() {
			// Try deleting feed
			request(app).delete('/api/feeds/' + feedObj._id)
			.expect(403)
			.end(function(feedDeleteErr, feedDeleteRes) {
				// Set message assertion
				(feedDeleteRes.body.message).should.match('User is not authorized');

				// Handle feed error error
				done(feedDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function() {
			feed.remove().exec(done);
		});
	});
});
