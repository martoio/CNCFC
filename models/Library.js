const map = {
    "001": "001-mushroom.svg",
    "002": "002-ufo.svg",
    "003": "003-beer.svg",
    "004": "004-saturn.svg",
    "005": "005-pear.svg",
    "006": "006-leaves.svg",
    "007": "007-like.svg",
    "008": "008-flower.svg",
    "009": "009-transport.svg",
    "010": "010-animal.svg",
    "011": "011-food.svg",
    "012": "012-animals-3.svg",
    "013": "013-animals.svg",
    "014": "014-animals-2.svg",
    "015": "015-animals-1.svg",
    "016": "016-alien-1.svg",
    "017": "017-alien.svg",
    "018": "018-pyramid-chart.svg",
    "019": "019-house.svg",
    "020": "020-jug.svg"
};


const lib = [];

for(let key in map){
    let fileNameBase = map[key].replace('.svg', '');
    let gcode = [
        'gcode/'+fileNameBase+'-half.ngc',
        'gcode/'+fileNameBase+'-full.ngc',
    ];
    let newEntry = {
        name: key,
        svg: map[key],
        gcode: gcode
    };
    lib.push(newEntry);
}
module.exports = lib;
