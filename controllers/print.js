const path 		= require('path');
const fs 		= require('fs');
const formidable 	= require('formidable');

const Print = require('../models/Print');
const User = require('../models/User');
const CNC = require('../models/CNC');
const util = require('../util/index');
const lib = require('../models/Library');
module.exports = {
    //TODO: Refactor this so that it uses the PrintManager
    //TODO: Create and attach a FileUploadHandler to manage all of this mess below
    uploadFile: async function(req, res){

        let form = new formidable.IncomingForm();
        let user = req.session.user;
        //create new Print
        let print = new Print({
            name: null,
            filename: null,
            owner: user._id,
            settings: {}
        });
        const dir = path.join(__dirname, '../print-uploads', user.username, print.id);
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
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'File upload failed. Check your file and try again.'
            };
            res.redirect('/',);
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            //get filename
            let fileName = form.openedFiles[0].name;
            //get filepath
            let filePath = path.join(user.username, print.id, fileName);
            //create and save new print;
            print.name = fileName;
            print.filename = filePath;

            print.save()
                .then(savedPrint => User.findByIdAndUpdate(user._id, {$push: {'prints': savedPrint.id}}))
                .then((model)=>{
                    //add the printId to the user session
                    req.session.user.lastPrint = print.id;
                    req.session.user.prints.push(print.id);
                    res.render('print/file-upload', {
                        title: 'Print Preview',
                        previewPath: filePath,
                        printId: print.id
                    });
                })
                .catch((err)=>{
                    console.log(err);
                });
        });
        form.parse(req);

    },
    libUpload: async function(req, res) {
        const libFile = lib[parseInt(req.params.libId) - 1];
        console.log(libFile);

        let print = new Print({
            name: libFile.svg,
            owner: req.session.user._id,
            filename: libFile.svg,
            gCodePath: libFile.gcode,
            status: 'CAM_FINISHED',
        });

        const r = await print.save();
        const r2 = await User.findByIdAndUpdate(req.session.user._id, {$push: {'prints': print.id}});
        req.session.user.lastPrint = print.id;
        req.session.user.prints.push(print.id);
        res.render('print/file-upload', {
            title: 'Print Preview',
            previewPath: '/'+libFile.svg,
            printId: print.id,
            backEnabled: true
        });
    },


    printFile: async function(req, res){
        //TODO: fix 500 error when you just hit the /GET page;
        const printID = req.session.user.lastPrint;
        let print = await Print.findById(printID);

        let cutType = req.query['cut-type'];
        if (cutType === 'full'){
            print.settings = {cutType: 'full'}
        } else if (cutType === 'half'){
            print.settings = {cutType: 'half'};
        } else {
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'Incorrect file settings'
            };
            return res.redirect('/');
        }

        console.log(print);

        res.render('print/print', {
            title: 'Printing file',
            backEnabled: true
        });

        CNC.printFile(print);

    }

};