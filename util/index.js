const Joi = require('joi');
const debug = require('debug')('cncfc:server');
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
    serverUtil: {
        onListening: function(server){
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        },
        onError: function (error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        },
        normalizePort: function (val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }
    }

};