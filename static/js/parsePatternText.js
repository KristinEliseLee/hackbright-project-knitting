

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
  // returns starting and ending index range (end not inclusive) of the first
  // consecutive string of the type to keep
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

function parseColorGroup(str) {
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
    // these are purposely not if/else, they evaluate in order
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
  // returns an array of indexes where colorGroups start in the text
  const colorGroupIndecies = [0];
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

function parseColorGroups(rowText) {
  // returns an array of colorGroup objects
  let text = 'C1' + rowText;
  const indecies = findColorGroupIndecies(text);
  const colorGroups = [];
  if (indecies.length === 1) {
    indecies.push(text.length);
  }
  for (let i = 0; i < indecies.length - 1; i += 1) {
    let str = text.slice(indecies[i], indecies[i + 1]);
    let colorGroup = parseColorGroup(str);
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

function makeStitchRows(rowsText) {
  // makes an array of arrays of stitch
  // may break this up into 2/3 methods
  const stitchRows = [];
  const allRows = rowsText.map(x => parseColorGroups(x.rowText));
  // allRows is an array of arrays
  for (let i = 0; i < allRows.length; i += 1) {
    // i is row index in allRows
    // allRows[i] is an array of objects
    let leftCS = [];
    let rightCS = [];
    const stitchRow = [];
    let column = 0;
    for (let j = 0; j < allRows[i].length; j += 1) {
      // allRows[i][j] is colorgroup in row, an object
      let colorNum = allRows[i][j].colorNum;
      for (let k of allRows[i][j].groups) {
        // k is an object in the array allRows[i][j].groups
        for (let count = 0; count < k.numStitches; count += 1) {
          let stitch = new letterToStitch[k.stitchAbbr]();
          stitch.colorClass = `color${colorNum}`;
          if (stitch.cable) {
            if (leftCS.length === 0 || leftCS[0].name === stitch.name) {
              leftCS.push(stitch);
            } else if (rightCS.length < leftCS.length && (rightCS.length === 0 || 
              rightCS[0].name === stitch.name)) {
              rightCS.push(stitch);
            } else {
              for (let cb of leftCS) {
                cb.offset = rightCS.length;
              }
              for (let cb of rightCS) {
                cb.offset = (leftCS.length * -1);
              }
              leftCS = [stitch];
              rightCS = [];
            }
          } else if (leftCS.length > 0) {
            for (let cb of leftCS) {
              cb.offset = rightCS.length;
            }
            for (let cb of rightCS) {
              cb.offset = (leftCS.length * -1);
            }
            leftCS = [];
            rightCS = [];
          }

          stitch.row = i;
          stitch.column = column;
          if (i > 0) {
            let offset = 0;
            if (stitchRows[i - 1][column]) {
              offset = stitchRows[i - 1][column].offset;
            }

            stitch.stitchBelow = stitchRows[i - 1][column + offset];
          }
          stitchRow.push(stitch);
          column += 1;
        }
        for (let cb of leftCS) {
          cb.offset = rightCS.length;
        }
        for (let cb of rightCS) {
          cb.offset = (leftCS.length * -1);
        }
      }
    }
    stitchRows.push(stitchRow);
  }
  return stitchRows;
}
