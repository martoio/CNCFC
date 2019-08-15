const {spawn} = require('child_process');

module.exports = {
    start: function(opts){
        this.opts = opts;

        this.childProcess = spawn(this.opts.cmd, this.opts.args);
        this.childProcess.stdout.setEncoding('utf8');
        //attach event handlers:
        this.childProcess.stdout.on('data', this.opts.events.data);

        this.childProcess.stderr.on('error', this.opts.events.error);

        this.childProcess.on('close', this.opts.events.close);

        this.childProcess.on('error', this.opts.events.childError);

        return this.childProcess;

    },
    kill: function(signal){
        this.childProcess.kill();
    }
};