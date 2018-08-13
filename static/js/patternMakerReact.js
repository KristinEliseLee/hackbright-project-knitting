/* global React ReactDOM makeStitchRows $:true*/

class SvgMain extends React.PureComponent {
  renderStitch(s, stitch) {
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
    let row = rows[rowNum];
    let horizontal = 0;
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
    return rowGroup;
  }

  renderRows(s, rows) {
    let vertical = 0;
    for (let i = rows.length - 1; i >= 0; i -= 1) {
      let row = this.renderRow(s, rows, i);
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
    bc.css({ opacity: .50 });
    $('.frontCable').attr({ fillOpacity: 100 });
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
    bc.css({ opacity: 0.50 });
    let frontCables = s.selectAll('.frontCable');
    frontCables.forEach((el) => {
      let trns = el.transform();
      el.remove();

      s.add(el);
      el.attr({ transform: trns.globalMatrix });
    });
  }

  render() {
    return (<svg id='svg' width={`${this.props.width}px`} height={`${this.props.height}px`} />);
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
      rowsText: ['C1K2 C2K2', 'C1CFK2 C2CBK2', 'C2K2 C1K2'],
      rowsEdit: [{ edit: false }, { edit: false }, { edit: false }],
      colors: ['skyblue', 'pink'],
      colorVals: ['skyblue', 'pink'],
      name: ''};
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
    this.state.rowsStitches = makeStitchRows(this.state.rowsText)
  }

  addTopRow() {
    const newState = $.extend(true, {}, this.state);
    newState.rowsText.push('');
    newState.rowsEdit.push({ edit: true, value: '' });
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  addARow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rowsText.splice(index, 0, '');
    newState.rowsEdit.splice(index, 0, { edit: true, value: '' });
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  deleteARow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rowsText.splice(index, 1);
    newState.rowsEdit.splice(index, 1);
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
  }

  editRow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rowsEdit[index].edit = true;
    newState.rowsEdit[index].value = newState.rowsText[index];
    this.setState({ rowsEdit: newState.rowsEdit });
  }

  handleRowChange(evt, index) {
    const newState = $.extend(true, {}, this.state);
    newState.rowsEdit[index].value = evt.target.value;
    this.setState({ rowsEdit: newState.rowsEdit });
  }

  handleRowSubmit(i) {
    const newState = $.extend(true, {}, this.state);
    newState.rowsEdit[i].edit = false;
    newState.rowsText[i] = newState.rowsEdit[i].value.toUpperCase();
    newState.rowsStitches = makeStitchRows(newState.rowsText);
    this.setState({ rowsText: newState.rowsText, rowsEdit: newState.rowsEdit,
      rowsStitches: newState.rowsStitches
    });
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
    const patternText = createTextOfPattern(this.state.rowsText);
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

  calculateMaxWidth() {
    let max = 0
    for (let row of this.state.rowsStitches) {
      if (row.length > max){
        max = row.length
      }
    }
    return (max * 19.8)
  }

  calculateMaxHeight() {
    return (this.state.rowsStitches.length * 18)
  }

  renderRows() {
    const allRows = [];

    for (let i = (this.state.rowsText.length - 1); i >= 0; i -= 1) {
      allRows.push(<span key={i.toString()}><button className='delete'
        onClick={() => this.deleteARow(i)}> - </button> {'Row' +
        (i + 1).toString()}: <RowText edit={this.state.rowsEdit[i].edit} rowNum={i}
        handleSubmit={this.handleRowSubmit} handleChange={this.handleRowChange}
        rowText={this.state.rowsText[i]} value={this.state.rowsEdit[i].value}/>
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
      <React.Fragment>
        <div className='row' id='wholepage'>
          <div id='textside' className='col-6'>
            <h5> Colors</h5>
            <div id='colorboxes'>
              <button className='addColor' onClick={this.addColor}> + </button>
              <button className='deleteColor' onClick={this.deleteColor}> - </button>
              <ColorText colorVals={this.state.colorVals} handleChange={this.handleColorChange}
                handleSubmit={this.handleColorSubmit}/>
            </div>
            <h5> Pattern Text </h5>
            <div id='text'>
              <button className='add' onClick={() => this.addTopRow()}>
                +</button>
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
