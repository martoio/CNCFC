const pmgr = require('./PrintManager');
const camHandler = require('./CAMHandler');
const gcodeHandler = require('./StreamGCodeHandler');

/**
 * Create new handlers;
 */



let PrintManager = new pmgr();
let CAMHandler = new camHandler('CAM-handler');
let gCodeHandler = new gcodeHandler('Gcode-stream');
let CNC = function(PrintMngr) {

    this.PrintManager = PrintMngr;

};

CNC.prototype = {

    printFile: function (print) {
        PrintManager.executePrint(print);
    },
    addHandlers(handler){
        this.PrintManager.use(handler);
    }

};

let cnc = new CNC(PrintManager);
cnc.addHandlers(CAMHandler);
cnc.addHandlers(gCodeHandler);
module.exports = cnc;