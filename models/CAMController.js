const {spawn} = require('child_process');
const PYCAM = process.env.PYCAM;
class CAMController{



    run(params){

        let child = spawn(PYTHON,
            [
                PYCAM,
                params.source,
                `--export-gcode=${params.target}`,
                `--progress=${params.progress}`,
                `--tool-shape=${params.tool}`,
                `--process-path-strategy=${params.strategy}`
            ]);

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (chunk)=> {
           console.log(chunk);
        });
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

        return child;
    }
}