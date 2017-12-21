const Process = require('./Process');
const Handler = require('./Handler');
const path = require('path');
const concat = require('concat-files');
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

        let concatFiles = print.tmpGcode;
        const finalGcodePath = print.intermediateGcode.replace('.ngc', '-final.ngc');
        concatFiles.unshift(process.env.CNC_HOMING_GCODE);
        let self = this;
        concat(concatFiles, print.intermediateGcode.replace('.ngc', '-final.ngc'), function(err) {
            if (err) throw err;
            console.log('done');
            print.gCodePath = finalGcodePath;
            self.Manager.currentProcess = Process.start({
                cmd: process.env.CNC_PYTHON,
                /**
                 * args: path to stream.py, gcode filename, serial port
                 */
                args: [
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
                        console.log(self.Manager.currentProcess.spawnargs);
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
        });



    } else if(print.status === 'STD-LIB') {
        print.gCodePath = path.join(__dirname, '../std-lib/', (print.settings.cutType === 'full') ? print.tmpGcode[1] : print.tmpGcode[0]);
        self.Manager.currentProcess = Process.start({
            cmd: process.env.CNC_PYTHON,
            /**
             * args: path to stream.py, gcode filename, serial port
             */
            args: [
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
                    console.log(self.Manager.currentProcess.spawnargs);
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
    }else {
        console.log(`${this.name} cannot handle print. Passing to next handler`);
        msg = 'Stream gcode not run, passed down';
        if(this.next !== null){
            this.next.run(print);
        }
    }

};

module.exports = StreamGCodeHandler;