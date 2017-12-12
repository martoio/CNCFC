const map = {
    "001": "001-seal.svg",
    "002": "002-airplane.svg",
    "003": "003-car.svg",
    "004": "004-boat.svg",
    "005": "005-owl.svg",
    "006": "006-dog.svg",
    // "007": "007-tulip.svg",
    // "008": "008-fish.svg",
    // "009": "009-turtle.svg",
    // "010": "010-chicken.svg",
    // "011": "011-ice-cream.svg",
    // "012": "012-piece-of-cake.svg",
    // "013": "013-pizza-slice.svg",
    // "014": "014-internet.svg",
    // "015": "015-abacus.svg",
    // "016": "016-blackboard.svg",
    // "017": "017-bottle.svg",
    // "018": "018-science-2.svg",
    // "019": "019-technology.svg",
    // "020": "020-medical.svg",
    // "021": "021-science-1.svg",
    // "022": "022-science.svg",
    // "023": "023-avatar.svg",
    // "024": "024-cold.svg",
    // "025": "025-nature-1.svg",
    // "026": "026-nature.svg",
    // "027": "027-present.svg",
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
