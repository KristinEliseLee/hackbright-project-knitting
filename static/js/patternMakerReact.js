/* global React ReactDOM :true*/

class ColorText extends React.Component {
  renderGroups() {
    const colorGroups = [];
    let i = 0;
    for (let group of this.props.groups) {
      colorGroups.push(
        <span key={i.toString()} className='stitchGroup'>{group.stitchAbbr}{
          group.numStitches}</span>
      );
    }
    return colorGroups;
  }
  render() {
    return (
      <span className='colorGroup'>C{this.props.colorNum}({this.renderGroups()})</span>
    );
  }
}

class RowText extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: this.props.value};
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  renderColorGroups() {
    const newRow = [];
    const colorGroups = this.props.row.colorGroups;
    let i = 0;
    for (let colorGroup of colorGroups) {
      newRow.push(<ColorText colorNum={colorGroup.colorNum}
        groups={colorGroup.groups} key={i.toString()}/>
      );
    }
    return newRow;
  }

  render() {
    if (this.props.row.edit === true) {
      return (<form onSubmit= {this.handleSubmit}><input className='rowEdit'
        type='text' value={this.state.value} onChange={
          this.handleChange}/><input type='submit'/></form>
      );
    }
    return (<span className='rowText' id={'row' + this.props.id.toString()}>{
      this.renderColorGroups()} </span>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        { edit: false, colorGroups: [ { colorNum: 1, groups: [{ stitchAbbr: 'K', numStitches: 7 }] }] },
        { edit: false, colorGroups: [ { colorNum: 2, groups: [{ stitchAbbr: 'P', numStitches: 7 }] }] }
      ]
    };
  }
  addTopRow() {
    const newRows = this.state.rows.concat();
    newRows.push({ edit: false, colorGroups: [ { colorNum: 1, groups: [{ stitchAbbr: 'NA',
      numStitches: 0 }] }] });
    this.setState({ rows: newRows });
  }
  addARow(index) {
    const newRows = this.state.rows.concat();

    newRows.splice(index, 0, { edit: false, colorGroups: [ { colorNum: 1, groups: [{
      stitchAbbr: 'NA', numStitches: 0 }] }] });
    this.setState({ rows: newRows });
  }
  deleteARow(index) {
    const newRows = this.state.rows.concat();
    newRows.splice(index, 1);
    this.setState({ rows: newRows });
  }
  renderTextOnlyRow(index) {
    const row = this.state.rows[index];
    let rowString = '';
    for (let colorGroup of row.colorGroups) {
      rowString += ('C' + colorGroup.colorNum + '( ');
      for (let group of colorGroup.groups) {
        rowString += (group.stitchAbbr + group.numStitches.toString() + ' ');
      }
      rowString += ') ';
    }
    return rowString;
  }
  editRow(index) {
    const editRows = this.state.rows;
    editRows[index].edit = true;
    editRows[index].value = renderTextOnlyRow(index)
    this.setState({ rows: editRows });
  }

  handleSubmit(i) {
    const editRows = this.state.rows;
    editRows[index].edit = false;
    
  }


  renderRows() {
    const allRows = [];
    const rowsCopy = this.state.rows;
    for (let i = (rowsCopy.length - 1); i >= 0; i -= 1) {
      allRows.push(<span key={i.toString()}><button className='delete'
        onClick={() => this.deleteARow(i)}> - </button> {'Row' +
        (i + 1).toString()}: <RowText id={i} row={this.state.rows[i]}
        value={this.renderTextOnlyRow(i)} rowNumber={i}/><button className='edit' onClick={
        ()=> this.editRow(i)}>Edit</button><br/>
      <button className='add' onClick={() => this.addARow(i)}>
      + </button>
      </span>);
    for (let 
    }
    return allRows;
  }

  render() {
    return (
      <div className='row'>
        <div id='textside' className='col-5'>
          <h5> Pattern Text</h5>
          <div id='text'>
            <button className='add' onClick={() => this.addTopRow()}>
              +</button>
            {this.renderRows()}
          </div>
        </div>
        <div id='svgside' className='col-7'>
          SVG side
          <svg id='svg'/>
        </div>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));
