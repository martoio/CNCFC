const pmgr = require('./PrintManager');
const camHandler = require('./CAMHandler');
const gcodeHandler = require('./StreamGCodeHandler');
const homingHandler = require('./HomingHandler');
const zFixHandler = require('./ZFixHandler');
const http = require('http');

//TODO: THIS SHOULD NOT BE HERE!!!!
let server = http.createServer();
server.listen(3003);
/**
 * Create new handlers;
 */


let PrintManager = new pmgr();
let CAMHandler = new camHandler('CAM-handler');
let HomingHandler = new homingHandler('Homing-handler');
let ZFixHandlerHalf = new zFixHandler('Z-fix-handler-half');
let ZFixHandlerFull = new zFixHandler('Z-fix-handler-full');
let gCodeHandler1 = new gcodeHandler('Gcode-stream-half');
let gCodeHandler2 = new gcodeHandler('Gcode-stream-full');
let CNC = function(PrintMngr) {

    this.PrintManager = PrintMngr;
    this.uiEventBus = null;

};

CNC.prototype = {

    printFile: function (print) {
        PrintManager.executePrint(print);
    },
    addHandlers(handler){
        this.PrintManager.use(handler);
    },
    attachUIBus(io){
        this.uiEventBus = io;
        let self = this;
        this.uiEventBus.on('connection', (socket) => {
            let self = this;
            // console.log(socket.id);


            socket.on('cancel-print', function () {
                self.PrintManager.killProcess('SIGINT');
                socket.emit('cancel-print-success', {messag: 'Print successfully canceled.'});
            });


            self.PrintManager.eventBus.on('handlerComplete', function () {
                socket.emit('update', {msg: 'Homing complete.'});
            });


        });



    }

};

/**
 * Create Socket.io server
 */
let io = require('socket.io')(server);


let cnc = new CNC(PrintManager);
// cnc.addHandlers(HomingHandler);
cnc.addHandlers(CAMHandler);
cnc.addHandlers(ZFixHandlerHalf);
cnc.addHandlers(ZFixHandlerFull);
cnc.addHandlers(gCodeHandler1);
// cnc.addHandlers(gCodeHandler2);
cnc.attachUIBus(io);
module.exports = cnc;




