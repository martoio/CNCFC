module.exports = {

    uploadFile: function(req, res){

        let form = new formidable.IncomingForm();
        let user = req.session.user;
        const dir = path.join(__dirname, '../print-uploads', user.username);
        //TODO: make this async
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

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
            let fileName = form.openedFiles[0].name;

            let filePath = path.join(user.username, fileName);

            let print = new Print({
                name: fileName,
                owner: req.session.user._id,
                filename: filePath,
                settings: {}
            });


            print.save().then((p) => {
                let user = User.findByIdAndUpdate(req.session.user._id,   {$push: {"prints": p.id}}, function(err, model) {
                    console.log(err);

                    req.session.user.lastPrint = print.id;
                    res.render('print/file-upload', {
                        previewPath: filePath,
                        printId: print.id
                    });


                });
            }).catch(console.log);



        });
        form.parse(req);


    }

};