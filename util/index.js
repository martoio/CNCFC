const Joi = require('joi');

module.exports = {

    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json(result.error); //TODO: Make better error
}

            if (!req.value) {
                req.value = {};
            }
            req.value['body'] = result.value;
            next();
        }
    },
    schemas: {
        authSchema: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    },

    dirExits: async (dir, fs) => {
        return new Promise((resolve, reject) => {
            fs.stat(dir, (err, status) => {
               if(err){
                console.log('User directory doesn\'t exist. Creating one...');
                return fs.mkdir(dir, () => {
                    return resolve(true);
                });
               }

               if(!status.isDirectory()){
                   return reject(new Error(dir+' is not a directory'));
               } else {
                   return resolve(true);
               }
            });
        });
    },
};