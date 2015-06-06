'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Farmer = mongoose.model('Farmer');

/**
 * Globals
 */
var user, farmer;

/**
 * Unit tests
 */
describe('Farmer Model Unit Tests:', function() {
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
			farmer = new Farmer({
				title: 'Farmer Title',
				content: 'Farmer Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return farmer.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			Farmer.title = '';

			return farmer.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Farmer.remove().exec(function() {
			User.remove().exec(done);
		});
	});
});
