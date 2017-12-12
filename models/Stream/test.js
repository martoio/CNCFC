const {spawn} = require('child_process');
const fs = require('fs');

const child = spawn('C:/Python27/python.exe', [
    'C:\\Users\\Martin\\Desktop\\Tufts\\Year 4\\Sem 1\\ME 43\\CNCFC\\cncfc\\models\\Stream\\pipeTest.py'
], {stdio: 'pipe'});


fs.readFile('homing.ngc', 'utf-8', function(err, contents) {
	child.stdin.write(contents + '\n');
});

child.stdin.setEncoding('utf-8');
child.stdout.setEncoding('utf-8');
// child.stdin.write("console.log('Hello from PhantomJS') \n");
//child.stdin.end();
child.stdout.on('data', function (data) {
    console.log(data);
});