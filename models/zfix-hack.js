const OLD_GCODE = process.argv[2];
const cutType = process.argv[3];
const TMP_GCODE = process.argv[4];
const safetyHeight = process.argv[5];
const readline = require('readline');

const cutDepth = (cutType === 'full') ? '-53.0000' : '-41.5000';
const fs = require('fs');

let outStream = fs.createWriteStream(TMP_GCODE);

const lineReader = readline.createInterface({
    input: fs.createReadStream(OLD_GCODE),
});
let buff = '';
lineReader.on('line', function (line) {

    if (line.includes('Z')){
        //G0 = go to safety;
        if(line.includes('G0')){
            let oldSafety = line.substr(line.indexOf('Z')+1);
            line = line.replace(oldSafety, safetyHeight);
        }

        //G1 = plunge down;
        if(line.includes('G1')){
            let oldPlunge = line.substr(line.indexOf('Z')+1);
            line = line.replace(oldPlunge, cutDepth);
        }
    }
    buff += line+'\n';
    // console.log('Line from file:', line);
});

lineReader.on('close', function () {
    console.log('CLOSE FILE');
    outStream.write(buff, function () {
        console.log('done-writing');
        outStream.close();
    });

});