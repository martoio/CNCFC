const concat = require('concat-files');
const path = require('path');
const homing = __dirname + '/Stream/homing.ngc';
const gcode = path.join(__dirname, '../std-lib/gcode/001-seal-half.ngc');

concat([
    homing,
    gcode,
], __dirname+'/Stream/test-concat.ngc', function(err) {
    if (err) throw err;
    console.log('done');
});