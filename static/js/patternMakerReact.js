/* global React ReactDOM $:true*/

class GroupText extends React.Component {
  render() {
    return (
      <span className='stitchGroup'
        onClick={this.props.onClick}>
        {this.props.stitchAbbr}{this.props.numStitches} </span>
    )
  }
}

class RowText extends React.Component {
  // constructor(props) {
  //   super(props)
  //   // this.state = {
  //   //   groups: [ { stitchAbbr: 'K', numStitches: '7' }]
  //   // }
  // }

  // handleGroupClick(i) {
  //   const groups = this.state.groups.concat()
  //   if (Number(groups[i].numStitches)>1) {
  //     let oldGroup = $.extend({}, groups[i]);
  //     let toAdd = [];
  //     for (let num = 0; num < Number(oldGroup.numStitches); num += 1) {
  //       toAdd.push({ stitchAbbr: oldGroup.stitchAbbr, numStitches: '1' })
  //     }
  //     groups.splice(i, 1, ...toAdd)

  //   }else{
  //     let startingIndex = i
  //     let endingIndex = i
  //     for(let start = i; start >= 0; start -= 1){
  //       if(groups[start].stitchAbbr !== groups[i].stitchAbbr){
  //         startingIndex = start+1;
  //         break;
  //       }
  //     }
  //     for(let end = i; end < groups.length; end += 1) {
  //       if (groups[end].stitchAbbr !== groups[i].stitchAbbr) {
  //         endingIndex = end - 1; 
  //         break;
  //       }
  //     }
  //     stitchNum

  //     this.setState( { groups: groups })
  //   }
  // }

  renderGroups() {
    const newRow = []
    const groups = this.props.row.groups
    for (let i = 0; i < groups.length; i += 1) {
      newRow.push(<GroupText key={i}
        // onClick={()=>this.handleGroupClick(i)}
        stitchAbbr={groups[i].stitchAbbr}
        numStitches={groups[i].numStitches} />)
    }
    return newRow
  }

  render() {
    return <span id={this.props.id}>{this.renderGroups()} </span>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: [{ groups: [ { stitchAbbr: 'K', numStitches: '7' }] },
        { groups: [ { stitchAbbr: 'P', numStitches: '3' }, {stitchAbbr: 'K', numStitches: '4' }] }]
    }
  }
  addTopRow() {
    const newRows = this.state.rows.concat()
    newRows.push({ groups: [ { stitchAbbr: 'NA', numStitches: '' }] })
    this.setState({ rows: newRows })
  }
  addARow(index) {
    const newRows = this.state.rows.concat()

    newRows.splice(index, 0, { groups: [ { stitchAbbr: 'NA', numStitches: '' }] })
    this.setState({ rows: newRows })
  }
  deleteARow(index) {
    const newRows = this.state.rows.concat()
    newRows.splice(index, 1)
    this.setState({ rows: newRows})
  }

  renderRows() {
    const allRows = []
    for (let i = (this.state.rows.length - 1); i >= 0; i -= 1) {
      allRows.push(<span key={i.toString()}><p><button id={'delete' +
        (i + 1).toString} onClick={() => this.deleteARow(i)}> - </button> {'Row' +
        (i + 1).toString()}: <RowText id={'row' + (i + 1).toString()}
      row={this.state.rows[i]} /></p>
      <button key={i.toString()} id={'insertAt' + i.toString()} onClick={() => this.addARow(i)}>
      + </button>
      </span>)
    }
    return allRows
  }

  render() {
    return (
      <div className='row'>
        <div id='textside' className='col-5'>
          <h5> Pattern Text</h5>
          <div id='text'>
            <button id='addTopRow' onClick={() => this.addTopRow()}>
              +</button>
            {this.renderRows()}
          </div>
        </div>
        <div id='svgside' className='col-7'>
          SVG side
          <svg id='svg'/>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.querySelector('#root'))
