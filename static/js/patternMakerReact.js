/* global React ReactDOM makeStitchRows $:true*/

function rowHighlight(evt, rowNum) {
  // function highlights clicked row
  if ($(evt.currentTarget).hasClass('highlight') && !$(evt.currentTarget).hasClass('rowEdit')) {
    // removes highlight upon clicking something already highlighted that isn't a row-edit box
    $('.highlight').removeClass('highlight');
    return null;
  }
  if ($(evt.currentTarget).hasClass('rowSave')) {
    // Unhighlight on save row.
    $('.highlight').removeClass('highlight');
    return null;
  }
  // highlight most recent row clicked only
  $('.highlight').removeClass('highlight');
  $(`.row${rowNum}`).addClass('highlight');
  return null;
}

class SvgMain extends React.PureComponent {
  // Whole SVG component
  renderStitch(s, stitch) {
    // Adds single stitch to SVG
    const outline = s.path(stitch.outline);
    outline.attr({ 'fill-opacity': 0, 'stroke': 'black', 'strokeWidth': 1 });
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
    group.addClass(stitch.cableClass);
    stitch.image = group;
  }

  renderRow(s, rows, rowNum) {
    // adds whole row to SVG
    let row = rows[rowNum];
    let horizontal = (this.props.width - row.length * 19.8);
    const rowGroup = s.g();
    for (let stitch of row) {
      this.renderStitch(s, stitch);
      stitch.image.transform(`translate(${horizontal},0)`);
      if (stitch.cable) {
        let opposite = Math.abs(stitch.width * stitch.offset);
        let adjacent = stitch.height;
        let toSkew = Math.atan(opposite / adjacent) * (180 / Math.PI);
        if (stitch.offset < 0) {
          toSkew *= -1;
        }
        stitch.image.skew(toSkew, 0);
        stitch.image.translate((stitch.width * (-1 * stitch.offset)), 0);
      }
      horizontal += stitch.width;
      rowGroup.add(stitch.image);
    }
    rowGroup.addClass(`row${rowNum}`);
    rowGroup.click((evt) => rowHighlight(evt, rowNum));
    return rowGroup;
  }

  renderRows(s, rows) {
    // adds all rows to SVG
    let vertical = 0;
    for (let i = rows.length - 1; i >= 0; i -= 1) {
      let row = this.renderRow(s, rows, i);
      row.transform(`translate(0,${vertical})`);
      vertical += 18;
    }
  }

  updateAndMount() {
    // This doesn't work in the render method, must run after initial render
    const s = Snap('#svg');
    s.clear();
    this.renderRows(s, this.props.stitchRows);
    for (let i = 0; i < this.props.colors.length; i += 1) {
      $(`.color${i}`).attr({ fill: this.props.colors[i] });
    }
    let bc = $('.backCable').find('*');
    bc.css({ opacity: 0.50 });
    $('.frontCable').attr({ fillOpacity: 100 });
    let frontCables = s.selectAll('.frontCable');
    frontCables.forEach((el) => {
      let trns = el.transform();
      const parentGroup = el.parent();
      el.remove();
      s.add(el);
      parentGroup.add(el);
    });
  }

  componentDidUpdate() {
    this.updateAndMount();
  }

  componentDidMount() {
    this.updateAndMount();
  }

  render() {
    return (<svg id='svg' width={`${this.props.width}px`} height={`${this.props.height}px`} />);
  }
}


function SavePattern(props) {
  // creates name and save form for saving pattern
  return (
    <form id='savePattern' onSubmit={(evt) => {
      evt.preventDefault(); props.handleSubmit();
    }}>
    Name:
      <input type='text' required onChange={(evt) => props.handleChange(evt)}
        value={props.value}/>
      <input type='submit' value='Save'/>
    </form>
  );
}


function ColorText(props) {
  // Renders the color text boxes
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
        <input type='submit' value='Save' />
      </form>
    );
  }
  return <span> { colorBoxes}</span>;
}

function RowText(props) {
  // Renders a row of text, with an edit button, or a textbox with a save button
  if (props.edit === true) {
    return (<form id={props.rowNum} onSubmit= {(evt)=> {
      evt.preventDefault();
      props.handleSubmit(props.rowNum);
    }}>
      <input type='text' value={props.value}
        onChange={(evt) => props.handleChange(evt, props.rowNum)} className={
          `row${props.rowNum} rowEdit`} onClick={(evt) => rowHighlight(evt, props.rowNum)}/>
      <input type='submit' value='Save' className={
        `row${props.rowNum} rowSave`} onClick={(evt) => rowHighlight(evt, props.rowNum)}/>
    </form>
    );
  }
  return (<span key={props.rowNum} >
    <span className={'row' + props.rowNum.toString()} onClick={
      (evt) => rowHighlight(evt, props.rowNum)}> {props.rowText}</span>
    <button className='edit' onClick={()=> props.editRow(
      props.rowNum)}>Edit</button></span>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsText: ['C1K2 C2K2', 'C1CFK2 C2CBK2', 'C2K2 C1K2'],
      rowsEdit: [{ edit: false }, { edit: false }, { edit: false }],
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
  componentWillMount() {
    // Adds all stitches to state
    this.state.rowsStitches = makeStitchRows(this.state.rowsText);
  }

  addTopRow() {
    // handles adding a top row (row 1 is bottom)
    const newState = $.extend(true, {}, this.state);
    newState.rowsText.push('');
    newState.rowsEdit.push({ edit: true, value: '' });
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  addARow(index) {
    // handles adding a row in the middle of the pattern, or the bottom
    const newState = $.extend(true, {}, this.state);
    newState.rowsText.splice(index, 0, '');
    newState.rowsEdit.splice(index, 0, { edit: true, value: '' });
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  deleteARow(index) {
    // handles deleting any row
    const newState = $.extend(true, {}, this.state);
    newState.rowsText.splice(index, 1);
    newState.rowsEdit.splice(index, 1);
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  editRow(index) {
    // sets the row's edit status to 'true'
    const newState = $.extend(true, {}, this.state);
    newState.rowsEdit[index].edit = true;
    newState.rowsEdit[index].value = newState.rowsText[index];
    this.setState({ rowsEdit: newState.rowsEdit });
  }

  handleRowChange(evt, index) {
    // Handles changing text for the row
    const newState = $.extend(true, {}, this.state);
    newState.rowsEdit[index].value = evt.target.value;
    this.setState({ rowsEdit: newState.rowsEdit });
  }

  handleRowSubmit(i) {
    // handles saving of row text after editing
    const newState = $.extend(true, {}, this.state);
    newState.rowsEdit[i].edit = false;
    newState.rowsText[i] = newState.rowsEdit[i].value.toUpperCase();
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  addColor() {
    // adds a color field box
    const newState = $.extend(true, {}, this.state);
    if (newState.colors.length < 9) {
      newState.colors.push('');
      newState.colorVals.push('');
      this.setState({ colors: newState.colors, colorVals: newState.colorVals });
    }
  }

  deleteColor() {
    // removes a color field box
    const newState = $.extend(true, {}, this.state);
    if (newState.colors.length > 1) {
      newState.colors.pop();
      newState.colorVals.pop();
      this.setState({ colors: newState.colors, colorVals: newState.colorVals });
    }
  }

  handleColorChange(evt, i) {
    // handles editing of color field
    const newState = $.extend(true, {}, this.state);
    newState.colorVals[i] = evt.target.value.replace(/ /g, '');
    this.setState({ colorVals: newState.colorVals });
  }

  handleColorSubmit(i) {
    // Pushes the color change through after editing
    const newState = $.extend(true, {}, this.state);
    newState.colorVals[i] = newState.colorVals[i].replace(/\s/g, '');
    newState.colors[i] = newState.colorVals[i];
    this.setState({ colors: newState.colors });
  }

  handleSave() {
    // handles saving the pattern to the database and relocating to it's page
    $('.highlight').removeClass('highlight');
    const s = Snap('#svg');
    const svgString = s.toString();
    const formData = new FormData();
    formData.append('svgString', svgString);
    formData.append('name', this.state.name);
    const patternText = createTextOfPattern(this.state.rowsText);
    formData.append('patternText', patternText);
    fetch('/save', { method: 'POST', body: formData })
      .then(response => response.text())
      .then(num => window.location.replace(`/patterns/${num}`));
  }

  handleNameChange(evt) {
    // Handles editing pattern name
    const newState = $.extend(true, {}, this.state);
    newState.name = evt.target.value;
    this.setState({ name: newState.name });
  }

  calculateMaxWidth() {
    // used to find how wide the SVG should be
    let max = 0
    for (let row of this.state.rowsStitches) {
      if (row.length > max){
        max = row.length
      }
    }
    return (max * 19.8)
  }

  calculateMaxHeight() {
    // used to find how tall the SVG should be
    return (this.state.rowsStitches.length * 18)
  }


  renderRows() {
    // makes all row text lines
    const allRows = [];

    for (let i = (this.state.rowsText.length - 1); i >= 0; i -= 1) {
      allRows.push(<span key={i.toString()} ><br/><span className='delete'
        onClick={() => this.deleteARow(i)}> - </span> <span className={'row' + i}
        onClick={(evt)=> rowHighlight(evt, i)}>{'Row' +
        (i + 1).toString()}: </span><RowText edit={this.state.rowsEdit[i].edit} rowNum={i}
        handleSubmit={this.handleRowSubmit} handleChange={this.handleRowChange}
        rowText={this.state.rowsText[i]} value={this.state.rowsEdit[i].value} editRow={this.editRow}/>
      <br/>
      <span className='add' onClick={() => this.addARow(i)}>
      + </span>
      </span>);
    }
    return allRows;
  }

  render() {
    // whole page
    return (
      <React.Fragment>
        <div className='row' id='wholepage'>
          <div id='textside' className='col-6'>
            <h5> Colors</h5>
            <div id='colorboxes'>
              <span className='add' onClick={this.addColor}> + </span>
              <span className='delete' onClick={this.deleteColor}> - </span>
              <ColorText colorVals={this.state.colorVals} handleChange={this.handleColorChange}
                handleSubmit={this.handleColorSubmit}/>
            </div>
            <h5> Pattern Text </h5>
            <div id='text'>
              <span className='add' onClick={() => this.addTopRow()}>
                +</span>
              {this.renderRows()}
            </div>
          </div>
          <div id='svgside' className='col-6'>
            <SvgMain key='1' width={this.calculateMaxWidth()} height={this.calculateMaxHeight()}
              stitchRows={this.state.rowsStitches} colors={this.state.colors}/>
          </div>
        </div>
        <footer className='fixed-bottom'>
          <div className='offset-2'>
            <SavePattern value={this.state.name} handleSubmit={this.handleSave}
              handleChange={this.handleNameChange}/>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
