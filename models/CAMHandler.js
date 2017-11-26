const Process = require('./Process');
const Handler = require('./Handler');
const PYCAM = process.env.PYCAM;

/**
 * Extend Handler object
 * @param name - name for the CAMHandler, suggested: 'CAM';
 * @param Manager - handle to the PrintManager;
 * @constructor
 */
let CAMHandler = function(name, Manager){
    Handler.call(this, name, Manager);
};
CAMHandler.prototype = Object.create(Handler.prototype);

/**
 * @Override
 * Implement the abstract run method;
 * @param print
 */
CAMHandler.prototype.run = function(print){
    let msg = '';
    if(print.status === 'NOT_STARTED'){
        // console.log(`${this.name} handling print.`);
        const self = this;
        this.Manager.currentProcess = Process.start({
            cmd: 'node',
            args: [
                'longRunProcess.js'
            ],
            events: {
                data: function(data){
                    console.log(`${self.name} says: ${data}`);
                },
                error: function(error){
                    console.error(`${self.name} error: ${error}`);
                },
                close: function(code){

                    console.log(`${self.name} process has ended with code ${code}`);
                    self.Manager.currentProcess = null;
                    if (code === 0){
                        msg = 'CAM success';
                        self.eventBus.emit('handlerComplete', {msg, process: self.name});
                        print.status = 'CAM_FINISHED';
                        print.gCodePath = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/cncfc/gcode/line.ngc';
                        if(self.next !== null) {
                            self.next.run(print);
                        }
                    }

                },
                childError: function(err){
                    console.err(err);
                }
            }
        });


    } else{
        // console.log(`${this.name} cannot handle print. Passing to next handler`);
        msg = 'CAM not run, passed down';
    }




    //let CAMProcess = Process.spawn();
};

module.exports = CAMHandler;