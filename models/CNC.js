const pmgr = require('./PrintManager');
const camHandler = require('./CAMHandler');
const gcodeHandler = require('./StreamGCodeHandler');
const http = require('http');

//TODO: THIS SHOULD NOT BE HERE!!!!
let server = http.createServer();
server.listen(3003);
/**
 * Create new handlers;
 */


let PrintManager = new pmgr();
let CAMHandler = new camHandler('CAM-handler');
let gCodeHandler = new gcodeHandler('Gcode-stream');
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
            console.log(socket.id);


            socket.on('cancel-print', function () {
                self.PrintManager.killProcess('SIGINT');
                socket.emit('cancel-print-success', {messag: 'Print successfully canceled.'});
            });


            // self.PrintManager.eventBus.on('');


        });



    }

};

/**
 * Create Socket.io server
 */
let io = require('socket.io')(server);


let cnc = new CNC(PrintManager);
cnc.addHandlers(CAMHandler);
cnc.addHandlers(gCodeHandler);
cnc.attachUIBus(io);
module.exports = cnc;




