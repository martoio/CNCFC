const path 		= require('path');
const fs 		= require('fs');
const formidable 	= require('formidable');

const Print = require('../models/Print');
const User = require('../models/User');
const CNC = require('../models/CNC');
const util = require('../util/index');
module.exports = {
    //TODO: Refactor this so that it uses the PrintManager
    //TODO: Create and attach a FileUploadHandler to manage all of this mess below
    uploadFile: async function(req, res){

        let form = new formidable.IncomingForm();
        let user = req.session.user;
        const dir = path.join(__dirname, '../print-uploads', user.username);
        //check if dir exists or create one;
        await util.dirExits(dir, fs);

        form.uploadDir = dir;

        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });

        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            //get filename
            let fileName = form.openedFiles[0].name;
            //get filepath
            let filePath = path.join(user.username, fileName);
            //create and save new print;
            let newPrint = new Print({
                name: fileName,
                owner: user._id,
                filename: filePath,
                settings: {}
            });

            newPrint.save()
                .then(savedPrint => User.findByIdAndUpdate(user._id, {$push: {'prints': savedPrint.id}}))
                .then((model)=>{
                    //add the printId to the user session
                    req.session.user.lastPrint = newPrint.id;
                    req.session.user.prints.push(newPrint.id);
                    res.render('print/file-upload', {
                        previewPath: filePath,
                        printId: newPrint.id
                    });
                })
                .catch((err)=>{
                    console.log(err);
                });
        });
        form.parse(req);

    },

    printFile: async function(req, res){
        //TODO: fix 500 error when you just hit the /GET page;
        res.render('print/print');
        const printID = req.session.user.lastPrint;
        let print = await Print.findById(printID);
        console.log(print);
        CNC.printFile(print);

    }

};