'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Feed Nested Schema
 */

var FoodSchema = new Schema({
    foodID: {
        type: String,
        trim: true
    }
});

var MixSchema = new Schema({
    food: {   // a core food in this mix
      type: Schema.ObjectId,
      ref: 'Food'
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
    qty: {  // typically kg of this feed to be fed
        type: Number
    },
    mixes: [MixSchema]    // array of constituent foods in the feed
});

mongoose.model('Feed', FeedSchema);
