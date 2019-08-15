const Process = require('./Process');
const Handler = require('./Handler');
const path = require('path');
const PYCAM = process.env.CNC_PYCAM;
const CAM_STUB = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/cncfc/models/longRunProcess.js';
const env = process.env;

const PYCAM_ARGS = [
    './pycam',
    '--export-gcode={FILE_PATH_TO_EXPORT}',
    '--safety-height='+env.CNC_PYCAM_SAFETY_HEIGHT,
    '--tool-shape='+env.CNC_PYCAM_TOOL_SHAPE,
    '--tool-size='+env.CNC_PYCAM_TOOL_SIZE,
    '--tool-feedrate='+env.CNC_PYCAM_TOOL_FEEDRATE,
    '--process-path-strategy='+env.CNC_PYCAM_PROCESS,
    '{FILE TO PROCESS}'

];

/**
 * Extend Handler object
 * @param name - name for the CAMHandler, suggested: 'CAM';
 * @constructor
 */
let CAMHandler = function(name, cutType){
    Handler.call(this, name);
    this.cutType = cutType;
};
CAMHandler.prototype = Object.create(Handler.prototype);

/**
 * @Override
 * Implement the abstract run method;
 * @param print
 */
CAMHandler.prototype.run = function(print){
    let msg = '';
    console.log('\n\n'+print+'\n\n');
    //replace svg with ngc extension;
    const intermediateGcodeName = path.join(__dirname, '../print-uploads', print.filename.replace('svg', 'ngc'));
    const pathToSVGFile = path.join(__dirname, '../print-uploads', print.filename);

    if(print.status === 'NOT_STARTED'){
        // console.log(`${this.name} handling print.`);
        const self = this;
        this.Manager.currentProcess = Process.start({
            cmd: env.CNC_PYTHON,
            args: [
                env.CNC_PYCAM,
                `--export-gcode=${intermediateGcodeName}`,
                '--safety-height='+env.CNC_PYCAM_SAFETY_HEIGHT,
                '--tool-shape='+env.CNC_PYCAM_TOOL_SHAPE,
                '--tool-size='+env.CNC_PYCAM_TOOL_SIZE,
                '--tool-feedrate='+env.CNC_PYCAM_TOOL_FEEDRATE,
                '--process-path-strategy='+env.CNC_PYCAM_PROCESS,
                pathToSVGFile,
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
                        msg = 'CAM success';
                        self.eventBus.emit('handlerComplete', {msg, process: self.name});
                        print.status = 'CAM_FINISHED';
                        print.intermediateGcode = intermediateGcodeName;
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


    } else{
        console.log(`${this.name} cannot handle print. Passing to next handler`);
        msg = 'CAM not run, passed down';
        if(this.next !== null || typeof this.next !== 'undefined'){
            this.next.run(print);
        }

    }




    //let CAMProcess = Process.spawn();
};

module.exports = CAMHandler;