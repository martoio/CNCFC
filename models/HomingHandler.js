const Process = require('./Process');
const Handler = require('./Handler');
const path = require('path');
const PYPATH = "C:/Python27/simple_stream.py";
/**
 * Extend Handler object
 * @param name - name for the CAMHandler, suggested: 'CAM';
 * @constructor
 */
let HomingHandler = function(name, cutType){
    Handler.call(this, name);
    this.cutType = cutType;
};
HomingHandler.prototype = Object.create(Handler.prototype);

/**
 * @Override
 * Implement the abstract run method;
 * @param print
 */
HomingHandler.prototype.run = function(print){
    let msg = '';

    console.log(`${this.name} handling print.`);
    const self = this;
    console.log('\n\n'+print+'\n\n');
    this.Manager.currentProcess = Process.start({
        cmd: 'node',//process.env.CNC_PYTHON,
        args: [
            process.env.CNC_STUB,
            PYPATH,
            process.env.CNC_SERIAL_PORT
        ],
        events: {
            data: function(data){
                console.log(`${self.name} says: ${data}`);
            },
            error: function(error){
                console.error(`${self.name} error: ${error}`);
            },
            close: function(code){
                console.log(`========= ${self.name} process has ended with code ${code} =========`);
                self.Manager.currentProcess = null;
                if (code === 0){
                    msg = 'Homing success';
                    self.eventBus.emit('handlerComplete', {msg, process: self.name});
                    if(self.next !== null) {
                        self.next.run(print);
                    }
                }

            },
            childError: function(err){
                console.error(err);
            }
        }
    });
};

module.exports = HomingHandler;