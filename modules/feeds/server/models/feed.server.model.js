'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Food Schema
 */
var FoodSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Food requires a name'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/**
 * Mix Schema
 */
var MixSchema = new Schema({
	food: {   // a core food in this mix
		type: String
	},
	shareOfFeed: {    // the % of this food in the mix
		type: Number
	}
});

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    mixes: [MixSchema]    // array of constituent foods in the feed
});

mongoose.model('Food', FoodSchema);
// mongoose.model('Mix', MixSchema);
mongoose.model('Feed', FeedSchema);
