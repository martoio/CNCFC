const events = require('events');

let PrintManager = function () {
    this.stack = [];
    this.eventBus = new events.EventEmitter();
    this.currentProcess = null;
    this.eventBus.on('handlerComplete', function (msg) {
        console.log(`Message from ${msg.process}: ${msg.msg}`);
    });
};

/**
 * Define the functions available to the PrintManager;
 * */
PrintManager.prototype = {
    /**
     * Starts the print handler chain. print is a print object that gets passed as a request down the chain.
     *
     * @param print - print object;
     * */
    executePrint: function (print) {
        if(this.stack.length < 1){
            throw new Error("Print handling stack is empty, cannot handle print file.");
        }

        this.stack[0].run(print);
    },
    /**
     * Adds a handler to the middleware chain;
     *
     * @param fn - print handler; (check Handler.js);
     */
    use: function (fn) {

        if(typeof fn !== 'object' || typeof fn === 'undefined'){
            throw new Error('use() needs a middleware function to be provided.');
        }

        fn.attachManager(this);

        if(this.stack.length > 0){
            this.stack[this.stack.length-1].setNext(fn);
        }
        this.stack.push(fn);
    },
    killProcess: function(n){
        this.currentProcess.kill(n);
    }

};
module.exports = PrintManager;