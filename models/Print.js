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
    settings: {
        type: Schema.Types.Mixed
    }
});
//create a model and export
const Print = mongoose.model('print', PrintSchema);
module.exports = Print;