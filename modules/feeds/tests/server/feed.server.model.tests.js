'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed');

/**
 * Globals
 */
var user, feed;

/**
 * Unit tests
 */
describe('feed Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			feed = new feed({
				title: 'feed Title',
				content: 'feed Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return feed.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			feed.title = '';

			return feed.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		feed.remove().exec(function() {
			User.remove().exec(done);
		});
	});
});
