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
    return <span className='rowText'>{this.renderColorGroups()} </span>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [
        { colorGroups: [ { colorNum: 1, groups: [{ stitchAbbr: 'K', numStitches: 7 }] }] },
        { colorGroups: [ { colorNum: 2, groups: [{ stitchAbbr: 'P', numStitches: 7 }] }] }
      ]
    };
  }
  addTopRow() {
    const newRows = this.state.rows.concat();
    newRows.push({ colorGroups: [ { colorNum: 1, groups: [{ stitchAbbr: 'NA',
      numStitches: 0 }] }] });
    this.setState({ rows: newRows });
  }
  addARow(index) {
    const newRows = this.state.rows.concat();

    newRows.splice(index, 0, { colorGroups: [ { colorNum: 1, groups: [{
      stitchAbbr: 'NA', numStitches: 0 }] }] });
    this.setState({ rows: newRows });
  }
  deleteARow(index) {
    const newRows = this.state.rows.concat();
    newRows.splice(index, 1);
    this.setState({ rows: newRows });
  }

  renderRows() {
    const allRows = [];
    const rowsCopy = this.state.rows;
    for (let i = (rowsCopy.length - 1); i >= 0; i -= 1) {
      allRows.push(<span key={i.toString()}><p><button className='delete'
        onClick={() => this.deleteARow(i)}> - </button> {'Row' +
        (i + 1).toString()}: <RowText row={this.state.rows[i]}/></p>
      <button className='add' onClick={() => this.addARow(i)}>
      + </button>
      </span>);
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
