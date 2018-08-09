/* global React ReactDOM makeStitchRows $:true*/





class SvgMain extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   stitchRows : this.makeStitchRows(this.props.rowsText)
  //   }
  // }

  // makeStitchRows(rowsText) {
  //   // makes an array of arrays of stitch
  //   // may break this up into 2/3 methods
  //   const stitchRows = [];
  //   const allRows = rowsText.map(x => parseColorGroups(x.rowText));
  //   // allRows is an array of arrays
  //   for (let i = 0; i < allRows.length; i += 1) {
  //     // i is row index in allRows
  //     // allRows[i] is an array of objects
  //     let leftCS = [];
  //     let rightCS = [];
  //     const stitchRow = [];
  //     let column = 0;
  //     for (let j = 0; j < allRows[i].length; j += 1) {
  //       // allRows[i][j] is colorgroup in row, an object
  //       let colorNum = allRows[i][j].colorNum;
  //       for (let k of allRows[i][j].groups) {
  //         // k is an object in the array allRows[i][j].groups
  //         for (let count = 0; count < k.numStitches; count += 1) {
  //           let stitch = new letterToStitch[k.stitchAbbr]();
  //           stitch.colorClass = `color${colorNum}`;
  //           if (stitch.cable) {
  //             if (leftCS.length === 0 || leftCS[0].name === stitch.name) {
  //               leftCS.push(stitch);
  //             } else if (rightCS.length === 0 || rightCS[0].name === stitch.name) {
  //               rightCS.push(stitch);
  //             } else {
  //               for (let cb of leftCS) {
  //                 cb.offset = rightCS.length;
  //               }
  //               for (let cb of rightCS) {
  //                 cb.offset = (leftCS * -1);
  //               }
  //               leftCS = [stitch];
  //               rightCS = [];
  //             }
  //           }
  //           stitch.row = i;
  //           stitch.column = column;
  //           if (i > 0) {
  //             let offset = stitchRows[i - 1][column].offset;
  //             stitch.stitchBelow = stitchRows[i - 1][column + offset];
  //           }
  //           stitchRow.push(stitch);
  //           for (let cb of leftCS) {
  //             cb.offset = rightCS.length;
  //           }
  //           for (let cb of rightCS) {
  //             cb.offset = (leftCS * -1);
  //           }
  //           column += 1;
  //         }
  //       }
  //     }
  //     stitchRows.push(stitchRow);
  //   }
  //   return stitchRows;
  // }

  renderStitch(s, stitch) {
    const outline = s.path(stitch.outline);
    outline.attr({ 'fill-opacity': 0, 'stroke': 'black', 'strokeWidth': 1});
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
    // if (stitch.offset !== 0) {
    //   prevColor.transform(`translate${stitch.offset * stitch.width} 0)`);
    //   mainColor.transform(`translate${stitch.offset * stitch.width} 0)`);
    //   outline.transform(`translate${stitch.offset * stitch.width} 0)`);
    //   console.log(`translate${stitch.offset * stitch.width} 0)`)
    // }
    const group = s.g(prevColor, mainColor, outline);
    group.addClass(stitch.cableClass);
    stitch.image = group;
    
  }

  renderRow(s, row) {
    let horizontal = 0;
    const rowGroup = s.g();
    for (let stitch of row) {
      this.renderStitch(s, stitch);
      stitch.image.transform(`translate(${horizontal},0)`);
      if (stitch.cable) {
        let opposite = Math.abs(stitch.width * stitch.offset);
        console.log(opposite)
        let adjacent = stitch.height;
        let toSkew = Math.atan(opposite / adjacent) * (180 / Math.PI);
        if (stitch.offset > 0) {
          toSkew *= -1;
        }
        console.log(toSkew)
        stitch.image.skew(toSkew, 0);
        stitch.image.translate((stitch.width * stitch.offset), 0);
      }
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
    this.renderRows(s, this.props.stitchRows);
    for (let i = 0; i < this.props.colors.length; i += 1) {
      $(`.color${i}`).attr({ fill: this.props.colors[i] });
    }
    let bc = $('.backCable').find('*');
    bc.css({ 'opacity': .50 });
    
    $('.frontCable').attr({ fillOpacity: 100 });
    // $('.outline').attr({ stroke: 'black', strokeWidth: 1 })
    let frontCables = s.selectAll('.frontCable');
    frontCables.forEach((el) => {
      let trns = el.transform();
      el.remove();
      s.add(el);
      el.attr({ transform: trns.globalMatrix });
    });
  }

  componentDidUpdate() {
    const s = Snap('#svg');
    s.clear();
    this.renderRows(s, this.props.stitchRows);
    for (let i = 0; i < this.props.colors.length; i += 1) {
      $(`.color${i}`).attr({ fill: this.props.colors[i] });
    }
    let bc = $('.backCable').find('*');
    bc.css({ 'opacity': .50 });
    let frontCables = s.selectAll('.frontCable');
    console.log(frontCables);
    frontCables.forEach((el) => {
      let trns = el.transform();
      console.log(trns);
      el.remove();

      s.add(el);
      el.attr({ transform: trns.globalMatrix });
      console.log(trns);
    }); 

  }

  render() {
    return (<svg id='svg' width='500px' height='500px' />);
  }
}


function SavePattern(props) {
  return (
    <form id='savePattern' onSubmit={(evt) => {
      evt.preventDefault(); props.handleSubmit();
    }}>
    Name:
      <input type='text' required onChange={(evt) => props.handleChange(evt)}
        value={props.value}/>
      <input type='submit' name='save'/>
    </form>
  );
}


function ColorText(props) {
  const colorBoxes = [];
  for (let i = 0; i < props.colorVals.length; i += 1) {
    colorBoxes.push(
      <form key={i} id={'color' + (i + 1).toString()} onSubmit={(evt)=> {
        evt.preventDefault();
        props.handleSubmit(i);
      }} ><span>Color {i + 1}</span>
        <input className='colorBox' type='text' value={
          props.colorVals[i]} onChange={(evt) =>{
          props.handleChange(evt, i);
        }} />
        <input type='submit' />
      </form>
    );
  }
  return <span> { colorBoxes}</span>;
}

function RowText(props) {
  if (props.edit === true) {
    return (<form id={props.id} onSubmit= {(evt)=> {
      evt.preventDefault();
      props.handleSubmit(props.rowNum);
    }}>
      <input className='rowEdit' type='text' value={props.value}
        onChange={(evt) => props.handleChange(evt, props.rowNum)}/>
      <input type='submit' value='Save'/></form>
    );
  }
  return (<span className='rowText' id={'row' + props.rowNum.toString()}>
    {props.rowText}</span>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        { edit: false, rowText: 'C1(K4)' },
        { edit: false, rowText: 'C1(CBK2) C2(CFK2)' },
        { edit: false, rowText: 'C1(K4)' }
      ],
      colors: ['skyblue', 'pink'],
      colorVals: ['skyblue', 'pink'],
      name: '' };
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
          <SvgMain size='10px' stitchRows={makeStitchRows(this.state.rows)} colors={this.state.colors}/>
          <SavePattern value={this.state.name} handleSubmit={this.handleSave}
            handleChange={this.handleNameChange}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
