/* global React ReactDOM $:true*/

class Knit {
  constructor() {
    this.outline = `m 17.760231,15.226523 c 0.379437,0.596564 1.658223,0.786145 2.224945,0.748005 M 18.845234,8.1442028 c 1.066938,0 1.066938,0 1.066938,0 M 16.57368,1.3167025 C 16.62235,1.0937484 16.5288,0.51834607 16.66254,0.19987087 M 11.996185,9.6756766 C 11.039374,8.6342652 9.7864483,6.0382802 10.0344,0.03635787 m 6.53927,0.9459057 C 20.323709,6.225462 18.654281,12.67743 16.57947,18.389744 M 9.9999906,18.098828 C 10.386624,9.9922755 14.711104,4.1101274 16.676938,0.98226357 M 2.2397662,15.226523 C 1.860329,15.823087 0.58154197,16.012668 0.01481897,15.974528 M 1.1547627,8.1442028 c -1.06693803,0 -1.06693803,0 -1.06693803,0 M 3.4263162,1.3167025 C 3.3776562,1.0937484 3.4711882,0.51834607 3.3374452,0.19987087 M 8.0038071,9.6756766 C 8.9606166,8.6342652 10.213545,6.0382802 9.9655926,0.03635787 m -6.539276,0.9459057 C -0.32372243,6.225462 1.3457055,12.67743 3.4204878,18.389744 M 10.000018,18.098828 C 9.6133847,9.9922755 5.2889001,4.1101274 3.3230644,0.98226357`;
    this.width = 19.8;
    this.height = 18;
    this.abbr = 'K';
    this.colorPath = `m 6.6472803,0.14838827 c -2.8504919,0 -3.0803603,0.00379 -3.0653469,0.042917 0.033412,0.087068 0.065296,0.3895331 0.065964,0.6254674 L 3.6486909,1.0607606 4.1779937,1.882531 C 6.0707923,4.8225615 7.0608632,6.5957705 7.9395412,8.6188233 L 8.1541226,9.1123617 8.2367768,8.9899703 C 8.96918,7.9024128 9.4761647,6.074619 9.6712983,3.8225127 9.7533953,2.8749901 9.7904511,1.2090191 9.7460053,0.43767697 l -0.016692,-0.2892887 z m 3.6113397,0 -0.0159,0.7264006 c -0.0186,0.81028933 0.01326,2.03427423 0.07312,2.79354263 0.179929,2.2821433 0.643249,4.025837 1.391605,5.2342164 0.06344,0.1024402 0.12382,0.1867663 0.133517,0.1867663 0.0097,0 0.06256,-0.1069309 0.117623,-0.2376302 0.35378,-0.8397893 0.991449,-2.1456995 1.509229,-3.089984 0.609767,-1.1120442 1.15221,-2.0080323 2.239602,-3.6987615 l 0.64454,-1.0021784 0.01589,-0.37273723 c 0.0086,-0.2048791 0.02413,-0.40947 0.03497,-0.4553912 l 0.01987,-0.084243 H 13.340654 Z M 0.11046987,8.3684767 l -0.01669,0.9314459 c -0.00891,0.5125305 -0.02215,1.9151944 -0.029406,3.1162104 -0.00726,1.201015 -0.019467,2.440216 -0.027816,2.7546 l -0.015895,0.572219 h 0.1986872 c 0.6473078,0 1.43473323,-0.244092 1.73493713,-0.538045 L 2.0790631,15.082516 1.9630299,14.674015 C 1.3515041,12.510477 1.0007983,10.396405 0.96959357,8.6911447 l -0.00556,-0.3083628 -0.4267802,-0.00715 z m 18.93409413,8.137e-4 -0.01749,0.4824127 c -0.0641,1.7421169 -0.36216,3.5244819 -0.944957,5.6562279 l -0.157359,0.576988 0.144642,0.135108 c 0.158947,0.147947 0.415888,0.282005 0.69779,0.363995 0.186839,0.05434 0.524576,0.124003 0.680304,0.140675 0.04946,0.0052 0.187219,0.012 0.30598,0.0143 l 0.21617,0.004 -0.01669,-1.291468 c -0.0092,-0.710012 -0.02404,-2.368461 -0.03337,-3.686046 l -0.01749,-2.3961771 h -0.42837 z`;
    this.prevColorPath = `M 3.562728,18.351402 3.644043,18.316032 3.547102,18.050553 C 2.4024304,14.915774 1.7365185,12.256679 1.4990883,9.8724966 1.4324193,9.2030345 1.4321283,7.4314953 1.498587,6.8282117 1.6722442,5.2518351 2.057911,3.9142104 2.7096379,2.6278699 2.9625247,2.1287367 3.3245351,1.5103477 3.3638453,1.5103477 c 0.020201,0 0.8634283,1.3043786 1.4199534,2.1965092 1.8412679,2.9516239 3.1051592,5.6328124 3.914952,8.3050831 0.558309,1.84239 0.9194482,3.800568 1.0410259,5.644676 l 0.030486,0.462424 h 0.226331 0.2263324 l 0.01276,-0.128448 c 0.007,-0.07065 0.03127,-0.377003 0.05388,-0.680789 0.242708,-3.260207 1.233593,-6.669792 2.919204,-10.0448581 0.783035,-1.5678552 1.496329,-2.7848007 3.014823,-5.1435606 l 0.408752,-0.6349364 0.04744,0.069753 c 0.138428,0.2035243 0.473883,0.787144 0.618428,1.0759453 1.604393,3.2056181 1.686657,6.9869201 0.261521,12.0210548 -0.260463,0.920068 -0.74782,2.417293 -1.10197,3.38541 -0.05101,0.139444 -0.09275,0.262053 -0.09275,0.272452 0,0.01046 0.03757,0.03096 0.08349,0.04569 0.05843,0.01875 -1.875548,0.02727 -6.441805,0.02841 -5.5622886,0.0014 -6.5133018,-0.0037 -6.4439878,-0.03376 z`;
    this.stitchBelow = null;
    this.offset = 0;
    this.row = null;
    this.column = null;
    this.colorClass = null;
  }
}

class Purl {
  constructor() {
    this.outline = `M 3.3256919,18.393282 C 2.9909176,16.941722 2.7418205,16.438474 2.4070463,15.523824 M 7.9751055,9.6132993 c 1.305601,2.6335567 1.8817836,5.7564927 1.9191243,8.4868937 M 0.02025016,15.959798 C 3.2608319,15.66188 5.9309174,14.664425 8.8862075,8.1266492 M 3.3286803,0.0658103 3.6056449,1.2137934 M 1.0625522,8.4998072 C 2.0421558,-0.6544259 5.0365853,0.4088136 10.007078,0.3643274 M 0.09294393,8.0702304 C 4.2243327,8.764064 7.7576477,8.1360447 9.9999991,8.1266646 M 16.674307,18.393297 c 0.334774,-1.451559 0.583872,-1.954808 0.918645,-2.869458 M 12.024893,9.6133147 C 10.719292,12.246856 10.143109,15.369792 10.105768,18.100208 M 19.97975,15.959813 C 16.739167,15.661896 14.069081,14.66444 11.113791,8.1266646 m 5.557529,-8.060839 -0.276965,1.1479831 m 2.543093,7.2859985 C 17.957843,-0.6544259 14.963413,0.4088136 9.9929198,0.3643428 m 9.9141362,7.705903 c -4.131391,0.6938335 -7.664705,0.065814 -9.9070569,0.056434`;
    this.width = 19.8;
    this.height = 18;
    this.abbr = 'P';
    this.colorPath = `m 9.9917734,0.0137769 -6.438154,0.00397 0.1080707,0.4473809 0.1080707,0.447381 0.092178,-0.058803 C 4.0165641,0.7548548 4.3786091,0.5809724 4.5945947,0.5016813 5.082279,0.3226465 5.6355168,0.2134583 6.3698151,0.1520408 c 0.3187908,-0.026664 6.3731829,-0.038434 6.9387759,-0.013509 1.209316,0.053294 2.100455,0.2726374 2.776463,0.684183 0.06845,0.041672 0.129729,0.076285 0.136678,0.076285 0.01461,0 0.227089,-0.8703046 0.215347,-0.8820478 -0.0043,-0.0043 -2.904403,-0.00569 -6.4453056,-0.00318 z m 9.9258186,8.2968114 c -0.0057,-0.00672 -0.60811,0.078292 -0.710407,0.100124 -0.02436,0.0052 -0.04132,0.021457 -0.04132,0.041321 0,0.029127 -0.02547,0.036629 -0.205016,0.05483 -0.258012,0.026157 -0.248722,0.025876 -0.248721,-0.00954 0,-0.025176 -0.01465,-0.027621 -0.09536,-0.018276 -0.224809,0.026026 -0.708953,0.067658 -1.139511,0.097741 -0.580229,0.040539 -2.778953,0.046067 -3.424093,0.00874 -1.042182,-0.060294 -2.19806,-0.1355782 -2.438743,-0.1589276 l -0.113633,-0.011123 0.08105,0.1740259 c 0.04434,0.095541 0.180735,0.3731185 0.302757,0.6174334 0.18767,0.3757582 0.229227,0.4473776 0.273355,0.4656575 0.06676,0.027654 0.07644,0.044269 0.05165,0.090589 -0.02291,0.042799 0.05736,0.2047552 0.374274,0.7557005 1.352837,2.351838 2.744993,3.782525 4.38481,4.507184 0.753492,0.332979 1.567355,0.538723 2.63343,0.665112 0.114881,0.01362 0.248619,0.02596 0.297194,0.02702 l 0.0882,0.0016 -0.01112,-0.440229 c -0.0061,-0.242253 -0.0203,-1.907472 -0.03178,-3.700628 -0.01148,-1.793157 -0.02348,-3.2642032 -0.02702,-3.2683449 z m -19.83336042,0.00317 c -0.008389,0.00839 -0.02967291,2.2341427 -0.06595492,6.7893837 l -0.0055625,0.627772 0.22726636,-0.02384 C 1.0438414,15.622967 1.7871147,15.475314 2.3640469,15.285123 3.1291837,15.032887 3.8887315,14.624112 4.5063899,14.132103 5.4733617,13.36184 6.3594671,12.289416 7.220872,10.847866 7.485233,10.405461 7.8021372,9.8376676 7.8009573,9.8084799 7.8005505,9.7983248 7.7950457,9.7686773 7.7882431,9.7433197 7.77749,9.7032283 7.7844594,9.6934259 7.8414841,9.6662399 7.9027047,9.6370441 7.926227,9.5957833 8.1966868,9.0456278 8.3559813,8.7216 8.485935,8.4483492 8.485935,8.4377303 c 0,-0.012409 -0.034119,-0.016482 -0.095356,-0.01033 C 7.9968106,8.4669709 6.2029632,8.5738898 5.4710801,8.6014257 4.8368009,8.6252878 3.0849815,8.6143271 2.6191255,8.5831498 2.2941911,8.5614035 1.5429171,8.4975643 1.3890265,8.4790525 1.3081081,8.4693205 1.29367,8.4720627 1.29367,8.4973284 c 0,0.035445 0.00931,0.035697 -0.2487215,0.00954 -0.17954495,-0.018204 -0.20581119,-0.025705 -0.20581119,-0.054831 0,-0.019859 -0.0161672,-0.036121 -0.0405264,-0.041321 -0.12544174,-0.026779 -0.70576369,-0.105567 -0.71437916,-0.09695 z`;
    this.prevColorPath = `M 9.2297158,0.5978355 C 7.8053855,0.603896 6.5301055,0.6164902 6.396038,0.6264423 4.8049527,0.7445506 3.8314683,1.2126936 3.0935242,2.2133338 2.3213338,3.2604113 1.7730159,4.9847606 1.4414726,7.4102637 c -0.089512,0.6548542 -0.086594,0.5854172 -0.027018,0.5975675 0.1178766,0.02404 0.6738459,0.065517 1.7044977,0.127142 0.059938,0.00358 0.6523974,0.00362 1.3167146,8.137e-4 1.362012,-0.00575 1.4750053,-0.010367 4.014509,-0.1819717 0.8373716,-0.056585 1.7838121,-0.075546 2.3243151,-0.046089 0.21478,0.011705 0.881027,0.053658 1.48041,0.092973 1.961449,0.1286535 2.359297,0.1447149 3.505941,0.1446242 0.78095,-5.82e-5 1.321353,-0.015151 1.870577,-0.054036 0.354973,-0.025131 0.855554,-0.069497 0.933699,-0.082642 l 0.06119,-0.01033 -0.01112,-0.1327042 c -0.01565,-0.1851 -0.09301,-0.7289814 -0.16767,-1.1816457 C 18.132895,4.7765249 17.673742,3.3718273 17.059286,2.4366274 16.865281,2.1413513 16.685858,1.9250805 16.438674,1.6888734 15.823339,1.100863 15.068945,0.7898314 13.92603,0.6534606 13.506154,0.6033616 12.01628,0.5859786 9.2297218,0.5978356 Z m 2.7136872,9.7327215 c -0.0024,0.0024 -0.05713,0.131228 -0.121579,0.286069 -0.761576,1.829734 -1.24703,3.912448 -1.419223,6.084541 -0.03294,0.415459 -0.06516,1.029072 -0.06516,1.252348 v 0.157338 H 10.002103 9.6659716 V 18.009934 C 9.6657479,17.820546 9.6295582,17.110251 9.601606,16.746461 9.4462035,14.723812 9.0029051,12.721717 8.3278021,10.989312 8.185148,10.623241 8.0658391,10.34421 8.052063,10.344861 c -0.00655,3.15e-4 -0.060213,0.0884 -0.1191957,0.19548 -0.204234,0.370758 -0.5617167,0.956143 -0.8168877,1.337375 -1.2545792,1.874375 -2.5938342,3.059844 -4.152776,3.677583 -0.1348613,0.05344 -0.2475414,0.100211 -0.2511055,0.103303 -0.00356,0.0031 0.074798,0.224853 0.1748203,0.492675 0.2115824,0.56654 0.3490872,0.981662 0.4664523,1.410482 0.080645,0.294654 0.1915077,0.742413 0.1915077,0.773977 0,0.0084 -0.030877,0.02343 -0.068339,0.03337 -0.045571,0.0121 2.1143116,0.01748 6.5255636,0.01748 4.411253,0 6.570341,-0.0054 6.52477,-0.01748 -0.03883,-0.01031 -0.06834,-0.02958 -0.06834,-0.0445 0,-0.03418 0.148308,-0.624351 0.22965,-0.914628 0.09982,-0.356203 0.232454,-0.75038 0.427515,-1.269831 0.09897,-0.263568 0.177628,-0.481371 0.174821,-0.483934 -0.0028,-0.0026 -0.09513,-0.03869 -0.205017,-0.08105 -0.238868,-0.09208 -0.690576,-0.306619 -0.922573,-0.43784 -0.226482,-0.128103 -0.637752,-0.400213 -0.851057,-0.563399 -0.848137,-0.648851 -1.707612,-1.606362 -2.458609,-2.73991 -0.228902,-0.345502 -0.636599,-1.0177 -0.808146,-1.331018 -0.0533,-0.09734 -0.09931,-0.174878 -0.101714,-0.172436 z`;
    this.stitchBelow = null;
    this.offset = 0;
    this.row = null;
    this.column = null;
    this.colorClass = null;
  }
}

const letterToStitch = {
  K: Knit, P: Purl
};

const colorAbbrs = { C: 'yes', COLOR: 'also yes' };

function isAlpha(char) {
  return /^[A-Za-z]$/.test(char);
}

function isNum(char) {
  return /^[0-9]$/.test(char);
}

function isParen(char) {
  return /^[()]$/.test(char);
}

const is_type = {
  num: isNum,
  letter: isAlpha,
  // paren is currently unused, but highly likely necessary
  paren: isParen
};

function createTextOfPattern(rowStringsArray) {
  // Used to save the text of the pattern with row#'s.
  let answer = '';
  for (let i = 0; i < rowStringsArray.length; i += 1) {
    answer += `Row${i + 1}: ${rowStringsArray[i].rowText}\n`;
  }
  return answer;
}

function findIndexRange(start, str, typeToKeep) {
  // returns starting and ending index range (end not inclusive)
  const indexRange = [];
  for (let i = start; i < str.length; i += 1) {
    if (is_type[typeToKeep](str[i])) {
      indexRange.push(i);
      break;
    }
  }
  for (let i = indexRange[0]; i < str.length; i += 1) {
    if (!is_type[typeToKeep](str[i])) {
      indexRange.push(i);
      break;
    }
  }
  if (indexRange.length === 1) {
    indexRange.push(str.length);
  }
  return indexRange;
}

function makeColorGroup(str) {
  // return a colorgroup object with colornum, and list groups which contain
  // stitch group objects
  const colorGroup = {};
  colorGroup.groups = [];
  const [colorStart, colorEnd] = findIndexRange(0, str, 'num');
  const colorNum = str.slice(colorStart, colorEnd);
  colorGroup.colorNum = colorNum - 1;
  let currentAbbr = '';
  let currentNum = '';
  let i = colorEnd;
  while (i < str.length) {
    // these are purposely not if/else
    if (isAlpha(str[i])) {
      let [abbrStart, abbrEnd] = findIndexRange(i, str, 'letter');
      currentAbbr = str.slice(abbrStart, abbrEnd);
      i = abbrEnd;
    }

    if (isNum(str[i])) {
      let [numStart, numEnd] = findIndexRange(i, str, 'num');
      currentNum = str.slice(numStart, numEnd);
      i = numEnd;
    }

    if (currentNum.length > 0 && currentAbbr.length > 0) {
      colorGroup.groups.push({ stitchAbbr: currentAbbr,
        numStitches: currentNum });
      currentNum = '';
      currentAbbr = '';
    }

    if (!isNum(str[i]) && !isAlpha(str[i])) {
      i += 1;
    }
  }
  return colorGroup;
}

function findColorGroupIndecies(rowText) {
  const colorGroupIndecies = [];
  let index = 0;
  while (index < rowText.length) {
    if (isAlpha(rowText[index])) {
      let [wordStart, wordEnd] = findIndexRange(index, rowText, 'letter');
      if (rowText.slice(wordStart, wordEnd) in colorAbbrs) {

        colorGroupIndecies.push(wordEnd);
      }
      index = wordEnd;
      continue;
    }
    index += 1;
  }
  colorGroupIndecies.push(rowText.length);
  return colorGroupIndecies;
}

function makeColorGroups(rowText) {
  let text = rowText
  const indecies = findColorGroupIndecies(rowText);
  const colorGroups = [];
  if (indecies.length === 1) {
    text = '1' + rowText;
    indecies[0] = 0
    indecies.push(text.length)
  }
  for (let i = 0; i < indecies.length - 1; i += 1) {
    let str = text.slice(indecies[i], indecies[i + 1]);
    let colorGroup = makeColorGroup(str);
    colorGroups.push(colorGroup);
  }
  return colorGroups;
}

// function convertRowTextToColorGroups(str) {
//   const colorGroups = [];
//   // for list of all colorgroups 'C#(stitchgroups)'
//   let currentGroup = '';
//   // current colorgroup builder
//   for (let char of str) {
//     currentGroup += char.toUpperCase();
//     if (char === ')') {
//       colorGroups.push(currentGroup);
//       currentGroup = '';
//     }
//   }
//   // now have list of all colorgroup strings 'C#(stitchgroups)'
//   for (let index = 0; index < colorGroups.length; index += 1) {
//   // each colorgroup string
//     const colorGroup = {};
//     // initialize the colorgroup object
//     let group = colorGroups[index];
//     colorGroup.colorNum = group[ group.indexOf('C') + 1] - 1;
//     // the color num is whatever is after the C
//     // not gonna worry about more than 9 colors right now
//     let justStitches = group.slice(group.indexOf('(') + 1, group.indexOf(')'));
//     // take everything out of the parenthesis
//     colorGroup.groups = [];
//     let currentAbbr = '';
//     let currentNum = '';
//     for (let char of justStitches) {
//     // go through all characters between the parenthesis
//       if (isNaN(char) && char !== ' ') {
//         if (currentNum.length > 0) {
//           colorGroup.groups.push({ stitchAbbr: currentAbbr, numStitches: currentNum });
//           currentAbbr = '';
//           currentNum = '';
//         }
//         // if the character is a letter
//         currentAbbr += char;
//         // add it to the current abbreviation
//       } else if (char !== ' ') {
//       // if the character is a number
//         currentNum += char;
//         // start the current stitch number
//       } else if (char === ' ') {
//         colorGroup.groups.push({ stitchAbbr: currentAbbr, numStitches: currentNum });
//         currentAbbr = '';
//         currentNum = '';
//       }
      
//     } if (currentAbbr !== '') {
//       colorGroup.groups.push({ stitchAbbr: currentAbbr, numStitches: currentNum });
//     }colorGroups[index] = colorGroup;
//   }
//   return colorGroups;
// }

class SvgMain extends React.Component {
  constructor(props) {
    super(props);
    this.makeStitchRows =this.makeStitchRows.bind(this);
  }

  makeStitchRows() {
    const stitchRows = [];
    const allRowsText = this.props.rows;
    const allRows = allRowsText.map(x => makeColorGroups(x.rowText));
    // allRows is an array of arrays
    for (let i = 0; i < allRows.length; i += 1) {
      // i is row index in allRows
      // allRows[i] is an array of objects
      const stitchRow = [];
      let column = 0 ;
      for (let j = 0; j < allRows[i].length; j += 1) {
        // allRows[i][j] is colorgroup in row, an object
        let colorNum = allRows[i][j].colorNum;
        for (let k of allRows[i][j].groups) {
          // k is an object in the array allRows[i][j].groups
          
          for (let count = 0; count < k.numStitches; count += 1) {
            
            let stitch = new letterToStitch[k.stitchAbbr]();
            stitch.colorClass = `color${colorNum}`;
            stitch.row = i;
            stitch.column = column;
            if (i > 0) {
              stitch.stitchBelow = stitchRows[i - 1][column];
            }
            stitchRow.push(stitch);
            column += 1
          }
        }
      }
      stitchRows.push(stitchRow);
    }

    return stitchRows;
  }

  renderStitch(s, stitch) {
    const outline = s.path(stitch.outline);
    outline.attr({ 'fill-opacity': 0 });
    outline.addClass('outline');
    const mainColor = s.path(stitch.colorPath);
    mainColor.attr({ strokeWidth: 1 });
    mainColor.addClass(stitch.colorClass);
    const prevColor = s.path(stitch.prevColorPath);
    prevColor.attr({ strokeWidth: 1 });
    if (stitch.stitchBelow) {
      prevColor.addClass(stitch.stitchBelow.colorClass);
    } else {
      prevColor.addClass(stitch.colorClass);
    }
    const group = s.g(prevColor, mainColor, outline);
    stitch.image = group;
  }

  renderRow(s, row) {
    let horizontal = 0;
    const rowGroup = s.g();
    for (let stitch of row) {
      this.renderStitch(s, stitch);
      stitch.image.transform(`translate(${horizontal},0)`);
      horizontal += stitch.width;
      rowGroup.add(stitch.image);
    }
    return rowGroup;
  }

  renderRows(s, rows) {
    let vertical = 0;
    for (let i = rows.length - 1; i >= 0; i -= 1) {
      let row = this.renderRow(s, rows[i]);
      row.transform(`translate(0,${vertical})`);
      vertical += 18;
    }
  }


  componentDidMount() {
    const s = Snap('#svg');
    const stitchRows = this.makeStitchRows(this.props.rows);
    this.renderRows(s, stitchRows);
    for (let i = 0; i < this.props.colors.length; i += 1) {
      $(`.color${i}`).attr({ fill: this.props.colors[i]});
    }
  }

  componentDidUpdate() {
    const s = Snap('#svg');
    s.clear();
    const stitchRows = this.makeStitchRows(this.props.rows);
    this.renderRows(s, stitchRows);
    for (let i = 0; i < this.props.colors.length; i += 1) {
      $(`.color${i}`).attr({ fill: this.props.colors[i] });
    }
  }

  render() {
    return (<svg id='svg' width='500px' height='500px' />);
  }
}


class SavePattern extends React.Component {
  render() {
    return (
      <form id='savePattern' onSubmit={(evt) => {evt.preventDefault(); this.props.handleSubmit()}}>
      Name:
        <input type='text' required onChange={(evt) => this.props.handleChange(evt)}
        value={this.props.value}/>
        <input type='submit' name='save'/>
      </form>

    );
  }
}


class ColorText extends React.Component {
  renderColorBoxes() {
    const colorBoxes = [];
    for (let i = 0; i < this.props.colorVals.length; i += 1) {
      colorBoxes.push(
        <form key={i} id={'color' + (i + 1).toString()} onSubmit={(evt)=> {
          evt.preventDefault();
          this.props.handleSubmit(i);
        }} ><span>Color {i + 1}</span>
          <input className='colorBox' type='text' value={
            this.props.colorVals[i]} onChange={(evt) =>{
            this.props.handleChange(evt, i);
          }} />
          <input type='submit' />
        </form>
      );
    }
    return colorBoxes;
  }

  render() {
    return <span> {this.renderColorBoxes()}</span>;
  }
}

class RowText extends React.Component {
  render() {
    if (this.props.edit === true) {
      return (<form id={this.props.id} onSubmit= {(evt)=> {
        evt.preventDefault();
        this.props.handleSubmit(this.props.rowNum);
      }}>
        <input className='rowEdit' type='text' value={this.props.value}
          onChange={(evt) => this.props.handleChange(evt, this.props.rowNum)}/>
        <input type='submit' value='Save'/></form>
      );
    }
    return (<span className='rowText' id={'row' + this.props.rowNum.toString()}>
      {this.props.rowText}</span>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        { edit: false, rowText: 'C1(K3) C2(P3)' },
        { edit: false, rowText: 'C1(P3 K3)' }
      ],
      colors: ['skyblue', 'pink'],
      colorVals: ['skyblue', 'pink'],
      name:''
    };
    this.handleRowSubmit = this.handleRowSubmit.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.addARow = this.addARow.bind(this);
    this.deleteARow = this.deleteARow.bind(this);
    this.editRow = this.editRow.bind(this);
    this.handleColorSubmit = this.handleColorSubmit.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.addColor = this.addColor.bind(this);
    this.deleteColor = this.deleteColor.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  addTopRow() {
    const newState = $.extend(true, {}, this.state);
    newState.rows.push({ edit: false, rowText: '' });
    this.setState({ rows: newState.rows });
  }

  addARow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rows.splice(index, 0, { edit: false, rowText: '' });
    this.setState({ rows: newState.rows });
  }

  deleteARow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rows.splice(index, 1);
    this.setState({ rows: newState.rows });
  }


  editRow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rows[index].edit = true;
    newState.rows[index].value = newState.rows[index].rowText;
    this.setState({ rows: newState.rows });
  }

  handleRowChange(evt, i) {
    const newState = $.extend(true, {}, this.state);
    newState.rows[i].value = evt.target.value;
    this.setState({ rows: newState.rows });
  }

  handleRowSubmit(i) {
    const newState = $.extend(true, {}, this.state);
    newState.rows[i].edit = false;
    newState.rows[i].rowText = newState.rows[i].value.toUpperCase();
    this.setState({ rows: newState.rows });
  }

  addColor() {
    const newState = $.extend(true, {}, this.state);
    if (newState.colors.length < 9) {
      newState.colors.push('');
      newState.colorVals.push('');
      this.setState({ colors: newState.colors, colorVals: newState.colorVals });
    }
  }

  deleteColor() {
    const newState = $.extend(true, {}, this.state);
    if (newState.colors.length > 1) {
      newState.colors.pop();
      newState.colorVals.pop();
      this.setState({ colors: newState.colors, colorVals: newState.colorVals });
    }
  }

  handleColorChange(evt, i) {
    const newState = $.extend(true, {}, this.state);
    newState.colorVals[i] = evt.target.value.replace(/ /g, '');
    this.setState({ colorVals: newState.colorVals });
  }

  handleColorSubmit(i) {
    const newState = $.extend(true, {}, this.state);
    newState.colorVals[i] = newState.colorVals[i].replace(/\s/g, '');
    newState.colors[i] = newState.colorVals[i];
    this.setState({ colors: newState.colors });
  }

  handleSave() {
    const s = Snap('#svg');
    const svgString = s.toString();
    const formData = new FormData();
    formData.append('svgString', svgString);
    formData.append('name', this.state.name);
    const patternText = createTextOfPattern(this.state.rows);
    formData.append('patternText', patternText);
    fetch('/save', { method: 'POST', body: formData })
      .then(response => response.text())
      .then(num => window.location.replace(`/patterns/${num}`));
  }

  handleNameChange(evt) {
    const newState = $.extend(true, {}, this.state);
    newState.name = evt.target.value;
    this.setState({ name: newState.name });
  }


  renderRows() {
    const allRows = [];
    const rowsCopy = this.state.rows;
    for (let i = (rowsCopy.length - 1); i >= 0; i -= 1) {
      allRows.push(<span key={i.toString()}><button className='delete'
        onClick={() => this.deleteARow(i)}> - </button> {'Row' +
        (i + 1).toString()}: <RowText edit={rowsCopy[i].edit} rowNum={i}
        handleSubmit={this.handleRowSubmit} handleChange={this.handleRowChange}
        rowText={rowsCopy[i].rowText} value={rowsCopy[i].value}/>
      <button className='edit' onClick={
        ()=> this.editRow(i)}>Edit</button><br/>
      <button className='add' onClick={() => this.addARow(i)}>
      + </button>
      </span>);
    }
    return allRows;
  }

  render() {
    return (
      <div className='row'>
        <div id='textside' className='col-6'>
          <h5> Colors</h5>
          <button className='addColor' onClick={this.addColor}> + </button>
          <button className='deleteColor' onClick={this.deleteColor}> - </button>
          <ColorText colorVals={this.state.colorVals} handleChange={this.handleColorChange}
            handleSubmit={this.handleColorSubmit}/>
          <h5> Pattern Text </h5>
          <div id='text'>
            <button className='add' onClick={() => this.addTopRow()}>
              +</button>
            {this.renderRows()}

          </div>
        </div>
        <div id='svgside' className='col-6'>
          <SvgMain size='10px' rows={this.state.rows} colors={this.state.colors}/>
          <SavePattern value={this.state.name} handleSubmit={this.handleSave} 
          handleChange={this.handleNameChange}/>
        </div>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));
