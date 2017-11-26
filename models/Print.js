const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Create a new schema
const PrintSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    filename:{
        type: String,
        required: true
    },
    gCodePath:{
        type: String,
        default: null
    },
    settings: {
        type: Schema.Types.Mixed
    },
    status:{
        type: String,
        enum: ['PRINTING', 'CAM', 'NOT_STARTED', 'ERROR'],
        default: 'NOT_STARTED'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});
//create a model and export
const Print = mongoose.model('print', PrintSchema);
module.exports = Print;