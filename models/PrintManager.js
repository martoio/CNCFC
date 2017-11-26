const {spawn} = require('child_process');
const Print = require('./Print');
const fs = require('fs');
const path = require('path');
const streamPy = 'C:/Users/Martin/Desktop/Tufts/Year 4/Sem 1/ME 43/CNCFC/Tests/streampy/stream.py';
const CAMController = require('./CAMController');
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





























