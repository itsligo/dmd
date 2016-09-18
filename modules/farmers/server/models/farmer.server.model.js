'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Farmer Nested Schema
 */

var WeightSchema = new Schema({
    taken: {
        type: Date
    },
    weight: {
        type: Number
    }
});

// var FeedSchema = new Schema({
//     changed: {
//         type: Date
//     },
//     qty: {
//         type: Number
//     },
//     food: {
//         type: String
//     }
// });

var FeedChgSchema = new Schema({
    changed: {
        type: Date
    },
    qty: {
        type: Number
    },
    feedMix: {
        type: Schema.ObjectId,
        ref: 'Feed'
    },
});

var AnimalSchema = new Schema({
    tagID: {
        type: String,
        trim: true
    },
    dob: {
        type: Date
    },
    sex: {
        type: String,
        enum: ['M', 'F']
    },
    weights: [WeightSchema]
});

var HerdSchema = new Schema({
    herdName: {
        type: String,
        trim: true
    },
    animals: [AnimalSchema],
    feedChgs: [FeedChgSchema]
});

/**
 * Farmer Schema
 */
var FarmerSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
        //required: 'Title cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    firstName: {
        type: String,
        default: '',
        trim: true
        //required: 'First name cannot be blank'
    },
    lastName: {
        type: String,
        default: '',
        trim: true
        //required: 'Last name cannot be blank'
    },
    address1: {
        type: String,
        default: '',
        trim: true
        //required: 'Address line 1 cannot be blank'
    },
    address2: {
        type: String,
        default: '',
        trim: true
        //required: 'Address line 2 cannot be blank'
    },
    town: {
        type: String,
        default: '',
        trim: true
        //required: 'Town cannot be blank'
    },
    country: {
        type: String,
        default: 'Ireland',
        trim: true
        //required: 'Country cannot be blank'
    },
    herds: [HerdSchema]
});

mongoose.model('Farmer', FarmerSchema);
