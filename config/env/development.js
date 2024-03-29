'use strict';

module.exports = {
	db: 'mongodb://localhost/mean-dev',
  //  db: 'mongodb://dmd1:wzTCwvm3SR@ds055862.mongolab.com:55862/dmd',    // using davemullark mongolab account (see docs)
	app: {
		title: 'DMD Manufacturing Prototype 2.0 DEV'
	},
	facebook: {
        clientID: process.env.FACEBOOK_ID || 'APP_ID',
        clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/api/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/github/callback'
    },
	mailer: {
		from: process.env.MAILER_FROM || 'DMD Manufacturing Ltd.',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'SendGrid',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'jkelleher',
                pass: process.env.MAILER_PASSWORD || '*lFKWQq8Gz24dC'
			}
		}
	}
};
