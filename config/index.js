const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CNCFC');
const User = require('../models/User');

(async () => {



    try {
        let u = await User.findOneAndUpdate({username: 'cncfc-admin'}, {$set:{isTeacher: true}});
        if(u){
            console.log(u);
            return;
        }
        const newUser = new User({
            username: 'cncfc-admin',
            password: 'education'
        });
        await newUser.save();

    } catch (e) {
    }
})();