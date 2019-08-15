const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
//Create a new schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    prints: [{
        type: Schema.Types.ObjectId,
        ref: 'print'
    }],
    isTeacher: {
        type: Boolean,
        default: false
    }
});
//hash password before saving
UserSchema.pre('save', async function(next){
    try {
        //generate salt
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error){
        next(error);
    }
});
//validate password method;
UserSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    }catch (error){
        throw new Error(error);
    }
};

UserSchema.methods.createPassword = async function(newPassword){
    return bcrypt.hash(newPassword, await bcrypt.genSalt(10));
};

//create a model and export
const User = mongoose.model('user', UserSchema);
module.exports = User;