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
        enum: [
            'NOT_STARTED',
            'CAM_FINISHED',
            'GCODE_FINISHED',
            'PRINTING',
            'ERROR',
            'STD-LIB'
        ],
        default: 'NOT_STARTED'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    intermediateGcode: {
        type: String
    },
    tmpGcode:{
        type: [String]
    }
});
//create a model and export
const Print = mongoose.model('print', PrintSchema);
module.exports = Print;