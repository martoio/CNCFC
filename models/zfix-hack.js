const gcodeFile = process.argv[2];
const cutType = process.argv[3];
const newGcode = process.argv[4];
const safetyHeight = '-25.0000';

const cutDepth = (cutType === 'full') ? '-53.0000' : '-41.5000';
const fs = require('fs');

let outStream = fs.createWriteStream(newGcode);

const lineReader = require('readline').createInterface({
    input: fs.createReadStream(gcodeFile),
});

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
    console.log('Line from file:', line);
    outStream.write(line+'\n');
});

lineReader.on('close', function () {
    console.log('CLOSE FILE');
    outStream.close();
});