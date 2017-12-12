const Process = require('./Process');
const Handler = require('./Handler');
const PYCAM = process.env.CNC_PYCAM;
const CAM_STUB = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/cncfc/models/longRunProcess.js';

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
    console.log('\n\n'+print+'\n\n');
    if(print.status === 'CAM_FINISHED'){

        if(print.gCodePath === null){
            //concatenate homing.ngc file and half-cut;
            print.gCodePath = print.intermediateGcode.replace('.ngc', '-half.ngc');

            if (print.settings.cutType === 'half'){
                print.status = 'GCODE_FINISHED';
            }
        } else if (print.settings.cutType === 'full') {
            //concatenate current gcode with full gcode;
            print.gCodePath = print.gCodePath.replace('-half.ngc', '-full.ngc');
            print.status = 'GCODE_FINISHED';
        }

        console.log(`========= ${this.name} process has ended =========`);

        if(this.next !== null){
            this.next.run(print);
        }

        // console.log(`${this.name} handling print.`);
        // const self = this;
        // this.Manager.currentProcess = Process.start({
        //     cmd: 'node',
        //     args: [
        //         process.env.CNC_STUB
        //     ],
        //     events: {
        //         data: function(data){
        //             console.log(`${self.name} says: ${data}`);
        //         },
        //         error: function(error){
        //             console.error(`${self.name} error: ${error}`);
        //         },
        //         close: function(code){
        //             console.log(`========= ${self.name} process has ended with code ${code} =========`);
        //             self.Manager.currentProcess = null;
        //             if (code === 0){
        //                 msg = 'CAM success';
        //                 self.eventBus.emit('handlerComplete', {msg, process: self.name});
        //                 print.status = 'CAM_FINISHED';
        //                 // print.gCodePath = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/cncfc/gcode/line.ngc';
        //                 if(self.next !== null) {
        //                     self.next.run(print);
        //                 }
        //             }
        //
        //         },
        //         childError: function(err){
        //             console.error(err);
        //         }
        //     }
        // });


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