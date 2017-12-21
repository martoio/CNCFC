const Handler = require('./Handler');
const fs = require('fs');
const path = require('path');
const safetyHeight = process.env.CNC_PYCAM_SAFETY_HEIGHT;
const readline = require('readline');
const concat = require('concat-files');
const Process = require('./Process');
/**
 * Extend Handler object
 * @param name - name for the CAMHandler, suggested: 'CAM';
 * @constructor
 */
let ZFixHandler = function(name, cutType){
    Handler.call(this, name);
    this.cutType = cutType;
};
ZFixHandler.prototype = Object.create(Handler.prototype);

/**
 * @Override
 * Implement the abstract run method;
 * @param print
 */
ZFixHandler.prototype.run = function(print){
    let msg = '';
    const self = this;
    console.log('\n\n'+print+'\n\n');
    if(print.status === 'CAM_FINISHED'){
        // print.intermediateGcode = 'C:\\Users\\Martin\\Desktop\\Tufts\\Year 4\\Sem 1\\ME 43\\CNCFC\\cncfc\\std-lib\\gcode\\old\\006-dog.ngc';
        if(print.gCodePath === null){
            const self = this;
            const tmpGcode = print.intermediateGcode.replace('.ngc', '-tmp-half.ngc');
            this.Manager.currentProcess = Process.start({
                cmd: 'node', //argv0
                args: [
                    'C:\\Users\\Martin\\Desktop\\Tufts\\Year 4\\Sem 1\\ME 43\\CNCFC\\cncfc\\models\\zfix-hack.js', //argv1
                    print.intermediateGcode, //argv2
                    'half',//argv3
                    tmpGcode, //argv4
                    process.env.CNC_CUT_SAFE //argv5
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
                        console.log(self.Manager.currentProcess.spawnargs);
                        self.Manager.currentProcess = null;
                        if (code === 0){
                            msg = 'Z-fix-half success';
                            self.eventBus.emit('handlerComplete', {msg, process: self.name});
                            // print.status = 'CAM_FINISHED';
                            // print.intermediateGcode = intermediateGcodeName;
                            print.tmpGcode.push(tmpGcode);
                            print.gCodePath = '-';
                            if(print.settings.cutType === 'half'){
                                print.status = 'GCODE_FINISHED';
                            }
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
        } else if (print.gCodePath !== null && print.settings.cutType === 'full'){

            const self = this;
            const tmpGcode = print.intermediateGcode.replace('.ngc', '-tmp-full.ngc');
            this.Manager.currentProcess = Process.start({
                cmd: 'node', //argv0
                args: [
                    'C:\\Users\\Martin\\Desktop\\Tufts\\Year 4\\Sem 1\\ME 43\\CNCFC\\cncfc\\models\\zfix-hack.js', //argv1
                    print.intermediateGcode, //argv2
                    'full',//argv3
                    tmpGcode, //argv4
                    process.env.CNC_CUT_SAFE //argv5
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
                        console.log(self.Manager.currentProcess.spawnargs);
                        self.Manager.currentProcess = null;
                        if (code === 0){
                            msg = 'Z-fix-full success';
                            self.eventBus.emit('handlerComplete', {msg, process: self.name});
                            // print.status = 'CAM_FINISHED';
                            // print.intermediateGcode = intermediateGcodeName;
                            print.tmpGcode.push(tmpGcode);
                            print.status = 'GCODE_FINISHED';
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
            //continue;
        }


    } else{
        console.log(`${this.name} cannot handle print. Passing to next handler`);
        msg = 'CAM not run, passed down';
        if(this.next !== null){
            this.next.run(print);
        }

    }




    //let CAMProcess = Process.spawn();
};

module.exports = ZFixHandler;