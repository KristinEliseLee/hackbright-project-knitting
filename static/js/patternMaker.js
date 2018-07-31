
// const knitPath = `m 11.54812,9.8925219 c 0.246719,0.3879001 1.078215,0.5111701 1.446711,0.4863701 M 12.253614,5.2874319 c 0.693748,0 0.693748,0 0.693748,0 M 10.776596,0.84803187 c 0.03165,-0.14497 -0.02918,-0.51911 0.05778,-0.72619 M 7.8002003,6.2832319 c -0.622141,-0.67715 -1.436823,-2.36512 -1.275599,-6.26771003 m 4.2519887,0.61505 C 13.214953,4.0398219 12.129452,8.2350419 10.78039,11.949322 M 6.5022273,11.760162 C 6.7536253,6.4890919 9.5655053,2.6643819 10.843737,0.63057187 M 1.4563483,9.8925219 C 1.2096294,10.280422 0.37813231,10.403692 0.00963581,10.378892 m 0.7412179,-5.0914601 c -0.6937479,0 -0.6937479,0 -0.6937479,0 M 2.2278708,0.84803187 c -0.03164,-0.14497 0.029177,-0.51911 -0.057786,-0.72619 M 5.2042623,6.2832319 c 0.62214,-0.67715 1.436823,-2.36512 1.275599,-6.26771003 m -4.2519902,0.61505 C -0.21049169,4.0398219 0.87500921,8.2350419 2.2240811,11.949322 m 4.2781642,-0.18916 C 6.2508473,6.4890919 3.4389664,2.6643819 2.1607341,0.63057187`
// const purlPath = `m 2.1627455,11.962793 c -0.2177086,-0.94397 -0.3797,-1.27124 -0.5974085,-1.86605 M 5.1863263,6.2530434 c 0.8490512,1.71264 1.2237511,3.7435301 1.2480343,5.5191496 M 0.01316897,10.380263 C 2.1205661,10.186523 3.8569613,9.5378634 5.7788291,5.2862534 M 2.1646889,0.04417335 2.344803,0.79072335 M 0.69099302,5.5289234 C 1.3280434,-0.42420665 3.2753642,0.26723335 6.5077477,0.23830335 M 0.06044278,5.2495634 c 2.68670182,0.45121 4.98446762,0.0428 6.44270112,0.0367 m 4.3403991,6.6765396 c 0.217708,-0.94397 0.3797,-1.27124 0.597408,-1.86605 M 7.8199616,6.2530534 C 6.9709104,7.9656834 6.5962104,9.9965735 6.5719272,11.772203 M 12.99312,10.380273 C 10.885722,10.186533 9.1493265,9.5378734 7.2274588,5.2862634 M 10.8416,0.04418335 l -0.180114,0.74655 m 1.65381,4.73819005 C 11.678245,-0.42420665 9.7309238,0.26723335 6.4985401,0.23831335 M 12.945846,5.2495734 c -2.686703,0.45121 -4.9844685,0.0428 -6.4427021,0.0367`

// const g = s.g()
// g.transform('translate(0')
// knit1 = s.path(d=knitPath);
// knit1.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });

// knit2 = s.path(d=purlPath)
// knit2.transform('translate(13,0)')
// knit2.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });
// knit3 = s.path(d=knitPath)
// knit3.transform('translate(26,0)')
// knit3.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });
// knit4 = s.path(d=knitPath)
// knit4.transform('translate(0,11.9)')
// knit4.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });
// knit5 = s.path(d=purlPath)
// knit5.transform('translate(13,11.9)')
// knit5.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });
// knit6 = s.path(d=knitPath)
// knit6.transform('translate(26,11.9)')
// knit6.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });
// purl1 = s.path(d=purlPath)
// purl1.transform('translate(39,0)')
// purl1.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });
// purl2 = s.path(d=purlPath)
// purl2.transform('translate(39,11.9)')
// purl2.attr({
//     stroke:'black',
//     strokeWidth:.5,
//     'fill-opacity':0
// });


const s =Snap('#svg');

class Knit {
    constructor(){
    this.path = `m 11.54812,9.8925219 c 0.246719,0.3879001 1.078215,0.5111701 1.446711,0.4863701 M 12.253614,5.2874319 c 0.693748,0 0.693748,0 0.693748,0 M 10.776596,0.84803187 c 0.03165,-0.14497 -0.02918,-0.51911 0.05778,-0.72619 M 7.8002003,6.2832319 c -0.622141,-0.67715 -1.436823,-2.36512 -1.275599,-6.26771003 m 4.2519887,0.61505 C 13.214953,4.0398219 12.129452,8.2350419 10.78039,11.949322 M 6.5022273,11.760162 C 6.7536253,6.4890919 9.5655053,2.6643819 10.843737,0.63057187 M 1.4563483,9.8925219 C 1.2096294,10.280422 0.37813231,10.403692 0.00963581,10.378892 m 0.7412179,-5.0914601 c -0.6937479,0 -0.6937479,0 -0.6937479,0 M 2.2278708,0.84803187 c -0.03164,-0.14497 0.029177,-0.51911 -0.057786,-0.72619 M 5.2042623,6.2832319 c 0.62214,-0.67715 1.436823,-2.36512 1.275599,-6.26771003 m -4.2519902,0.61505 C -0.21049169,4.0398219 0.87500921,8.2350419 2.2240811,11.949322 m 4.2781642,-0.18916 C 6.2508473,6.4890919 3.4389664,2.6643819 2.1607341,0.63057187`
    this.width = 12.9;
    this.height = 11.9;
    this.abbr = "K"
    }
};

class Purl {
    constructor(){
    this.path = `m 2.1627455,11.962793 c -0.2177086,-0.94397 -0.3797,-1.27124 -0.5974085,-1.86605 M 5.1863263,6.2530434 c 0.8490512,1.71264 1.2237511,3.7435301 1.2480343,5.5191496 M 0.01316897,10.380263 C 2.1205661,10.186523 3.8569613,9.5378634 5.7788291,5.2862534 M 2.1646889,0.04417335 2.344803,0.79072335 M 0.69099302,5.5289234 C 1.3280434,-0.42420665 3.2753642,0.26723335 6.5077477,0.23830335 M 0.06044278,5.2495634 c 2.68670182,0.45121 4.98446762,0.0428 6.44270112,0.0367 m 4.3403991,6.6765396 c 0.217708,-0.94397 0.3797,-1.27124 0.597408,-1.86605 M 7.8199616,6.2530534 C 6.9709104,7.9656834 6.5962104,9.9965735 6.5719272,11.772203 M 12.99312,10.380273 C 10.885722,10.186533 9.1493265,9.5378734 7.2274588,5.2862634 M 10.8416,0.04418335 l -0.180114,0.74655 m 1.65381,4.73819005 C 11.678245,-0.42420665 9.7309238,0.26723335 6.4985401,0.23831335 M 12.945846,5.2495734 c -2.686703,0.45121 -4.9844685,0.0428 -6.4427021,0.0367`
    this.width = 12.9;
    this.height = 11.8;
    this.abbr = "P"
    }
};

letterToStitch = {
    'k': Knit, 'p': Purl
};

const row1 = ['k','p', 'k', 'p', 'k', 'p', 'k'];
const row2 = ['p', 'k', 'p', 'k','p', 'k', 'p'];

function translateRows(rows){
    const translatedRows = []
    for (let row of rows){
        let translatedRow = []
        for(let stitch of row){
            let current = new letterToStitch[stitch]();
            translatedRow.push(current);
        }
        translatedRows.push(translatedRow);
    }
    return translatedRows
}

function loadRow(row, down){
    let moveToSide = 0;
    for(let stitch of row){
        let current = s.path(d=stitch.path);
        current.transform(`translate(${moveToSide},${down})`);
        moveToSide += stitch.width;
        current.attr({
        stroke:'black',
        strokeWidth:.5,
        'fill-opacity':0
        });
    }
}

function loadRows(rows){
    let moveDown = 0;
    for (let i= rows.length-1; i>=0; i -= 1){
        let row = rows[i]
        loadRow(row, moveDown);
        moveDown += row[1].height;
    }
}

function makeStitchGroups(row){
    const rowOfGroups = [];
    let currentGroup = [];
    for (let stitch in row){
        if (currentGroup.length === 0 || 
            currentGroup[currentGroup.length-1].abbr === stitch.abbr){
            currentGroup.push(stitch)
        }else{
            rowOfGroups.push(currentGroup)
            currentGroup = []
        
        }
        rowOfGroups.push(currentGroup)
    }
    return rowOfGroups
}


// function loadText(rows){
//     for (let row of rows){

//     }
// }

const translatedRows = translateRows([row1, row2, row1, row2])
loadRows(translatedRows);

