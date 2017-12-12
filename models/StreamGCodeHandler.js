const Process = require('./Process');
const Handler = require('./Handler');

/**
 * Extend Handler object
 * @param name - name for the GCode streaming Handler, suggested: 'GcodeStream';
 * @param Manager - handle to the PrintManager;
 * @constructor
 */
let StreamGCodeHandler = function (name, cutType, isFullHandler) {
    Handler.call(this, name);
    this.cutType = cutType;
    this.isFullHandler = isFullHandler;
};
StreamGCodeHandler.prototype = Object.create(Handler.prototype);

StreamGCodeHandler.prototype.run = function (print) {
    let msg = '';
    const self = this;
    console.log('\n\n'+print+'\n\n');

    if(print.status === 'GCODE_FINISHED'){

        this.Manager.currentProcess = Process.start({
            cmd: 'node',//process.env.CNC_PYTHON,
            /**
             * args: path to stream.py, gcode filename, serial port
             */
            args: [
                process.env.CNC_STUB,
                process.env.CNC_STREAMPY,
                print.gCodePath,
                process.env.CNC_SERIAL_PORT

            ],
            events: {
                data: function(data){
                    // console.log(`${self.name} says: ${data}`);
                },
                error: function(error){
                    console.error(`${self.name} error: ${error}`);
                },
                close: function(code){
                    console.log(`========= ${self.name} process has ended with code ${code} =========`);
                    self.Manager.currentProcess = null;
                    if (code === 0){
                        msg = 'Gcode stream success';
                        self.eventBus.emit('handlerComplete', {msg, process: self.name});
                        if(print.gCodePath.length === 0){
                            print.status = 'PRINTED';
                        }
                        // print.gCodePath = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/cncfc/gcode/line.ngc';
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

    } else {
        console.log(`${this.name} cannot handle print. Passing to next handler`);
        msg = 'Stream gcode not run, passed down';
        if(this.next !== null){
            this.next.run(print);
        }
    }

};

module.exports = StreamGCodeHandler;