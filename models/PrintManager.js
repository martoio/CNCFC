const {spawn} = require('child_process');
const Print = require('./Print');
const fs = require('fs');
const path = require('path');
const streamPy = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/Tests/streampy/stream.py';
const CAMController = require('./CAMHandler');

const events = require('events');
module.exports = function(print){
    const module = {};


    module.printFile = (fileName) => {
        //TODO: fix the path to Python;
        //TODO: fix the path to stream.py;
        //TODO: fix the hardcoded COM3;
        const child = spawn('C:/Python27/python.exe', [streamPy, fileName, 'COM3']);

        child.stdout.setEncoding('utf8');
        // use child.stdout.setEncoding('utf8'); if you want text chunks
        child.stdout.on('data', (chunk) => {
            // data from standard output is here as buffers
            console.log(chunk);
        });

        // since these are streams, you can pipe them elsewhere
        // child.stderr.pipe(console);
        child.stderr.on('error', (e) => {
            console.log(e);
        });


        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        child.on('error', (err) =>{
            console.log(err);
            throw err;
        });

        //child.kill();

    };

    return module;
};
















/*
class PrintManager{

    constructor(){
        this.printProcessStack = [];
    }



    async runCAM(print){
        //Get settings;
        //Run CAM;

        const printID = print.id;

        let camProcess = CAMController.run({
            source: path.join(__dirname, '../print-uploads', print.filename),
            target: path.join(__dirname, '../print-uploads', `${printID}.ngc`),
        });



        //Update Print status;
        //on CAM completed, send to next event in chain;
    }

    checkCNCstatus(){

        //check different elements on the CNC are correctly set;

        //currently the settings aren't known, so just return true until resolved;
        //TODO: CNC checklist before printing;
        return true;

    }

    streamGCode(gCodeFilePath){

        const child = spawn(process.env.PYTHON, [streamPy, fileName, 'COM3']);

        child.stdout.setEncoding('utf8');
        // use child.stdout.setEncoding('utf8'); if you want text chunks
        child.stdout.on('data', (chunk) => {
            // data from standard output is here as buffers
            console.log(chunk);
        });

        // since these are streams, you can pipe them elsewhere
        // child.stderr.pipe(console);
        child.stderr.on('error', (e) => {
            console.log(e);
        });


        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        child.on('error', (err) =>{
            console.log(err);
            throw err;
        });

    }


}

*/




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

        if(this.stack.length > 0){
            this.stack[this.stack.length-1].setNext(fn);
        }
        this.stack.push(fn);
    },
    killProcess: function(n){
        this.currentProcess.kill(n);
    }

};
module.exports.pm = PrintManager;


























