/* global React ReactDOM $:true*/

// class ColorText extends React.Component {
//   renderGroups() {
//     const colorGroups = [];
//     let i = 0;
//     for (let group of this.props.groups) {
//       colorGroups.push(
//         <span key={i.toString()} className='stitchGroup'>{group.stitchAbbr}{
//           group.numStitches}</span>
//       );
//     }
//     return colorGroups;
//   }
//   render() {
//     return (
//       <span className='colorGroup'>C{this.props.colorNum}({this.renderGroups()})</span>
//     );
//   }
// }
class ColorText extends React.Component {
  renderColorBoxes() {
    const colorBoxes = []
    for (let i = 1; i <= this.props.colorVals.length; i += 1) {
      colorBoxes.push(
        <form key={i} id={'color' + i.toString()} onSubmit={(evt)=> { evt.preventDefault();
          this.props.handleSubmit(i - 1); 
        }} ><span>Color {i}</span>
          <input className='colorBox' type='text' value={this.props.colorVals[i - 1]} onChange={(evt) =>{ 
            this.props.handleChange(evt, i - 1);}} />
          <input type='submit' />
        </form>
        )
    }
    return colorBoxes;
  }

  render(){
    return <span> {this.renderColorBoxes()}</span>
  }

}

class RowText extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = { value: this.props.value };
//   }
  

//   renderColorGroups() {
//     const newRow = [];
//     const colorGroups = this.props.row.colorGroups;
//     let i = 0;
//     for (let colorGroup of colorGroups) {
//       newRow.push(<ColorText colorNum={colorGroup.colorNum}
//         groups={colorGroup.groups} key={i.toString()}/>
//       );
//     }
//     return newRow;
//   }

  render() {
    if (this.props.edit === true) {
      return (<form id={this.props.id} onSubmit= {(evt)=>{ evt.preventDefault(); 
        this.props.handleSubmit(this.props.rowNum)}
      }>
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
        { edit: false, rowText: 'C1(K3 P2)' },
        { edit: false, rowText: 'C2(P3 K2)' }
      ],
      colors: ['blue'],
      colorVals: ['blue']
    };
    this.handleRowSubmit = this.handleRowSubmit.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.editRow = this.editRow.bind(this)
    this.handleColorSubmit = this.handleColorSubmit.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
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

  addColor(){

  }

  deleteColor(){
    
  }

  // ConvertColorGroupsToText(index) {
  //   const row = this.state.rows[index];
  //   let rowString = '';
  //   for (let colorGroup of row.colorGroups) {
  //     rowString += ('C' + colorGroup.colorNum + '( ');
  //     for (let group of colorGroup.groups) {
  //       rowString += (group.stitchAbbr + group.numStitches.toString() + ' ');
  //     }
  //     rowString += ') ';
  //   }
  //   return rowString;
  // }

  convertTextToColorGroups(string) {
    const colorGroups = [];
    // for list of all colorgroups 'C#(stitchgroups)'
    let currentGroup = '';
    // current colorgroup builder
    for (let char of string) {
      currentGroup += char.toUpperCase();
      if (char === ')') {
        colorGroups.push(currentGroup);
        currentGroup = '';
      }
    }
    // now have list of all colorgroup strings 'C#(stitchgroups)'
    for (let index = 0; index < colorGroups.length; index += 1) {
    // each colorgroup string
      const colorGroup = {};
      // initialize the colorgroup object
      let group = colorGroups[index];
      colorGroup.colorNum = group[ group.indexOf('C') + 1];
      // the color num is whatever is after the C
      // not gonna worry about more than 9 colors right now
      let justStitches = group.slice(group.indexOf('(') + 1, group.indexOf(')'));
      // take everything out of the parenthesis
      colorGroup.groups = [];
      let currentAbbr = '';
      let currentNum = '';
      for (let char of justStitches) {
      // go through all characters between the parenthesis
        if (isNaN(char) && char !== ' ') {
        // if the character is a letter
          currentAbbr += char;
          // add it to the current abbreviation
        } else if (char !== ' ') {
        // if the character is a number
          currentNum += char;
          // start the current stitch number
        } else if (char === ' ') {
          colorGroup.groups.push({ stitchAbbr: currentAbbr, numStitches: currentNum });
          currentAbbr = '';
          currentNum = '';
        }
      } if (currentAbbr !== '') {
        colorGroup.groups.push({ stitchAbbr: currentAbbr, numStitches: currentNum });
      }colorGroups[index] = colorGroup;
    }
    return colorGroups;
  }

  editRow(index) {
    const newState = $.extend(true, {}, this.state);
    newState.rows[index].edit = true;
    newState.rows[index].value = newState.rows[index].rowText
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
    newState.rows[i].rowText = newState.rows[i].value;
    this.setState({ rows: newState.rows });
  }

  handleColorChange(evt, i){
    const newState = $.extend(true, {}, this.state);
    newState.colorVals[i] = evt.target.value
    this.setState({colorVals: newState.colorVals})
  }

  handleColorSubmit(i) {
    const newState = $.extend(true, {}, this.state);
    newState.colors[i] = newState.colorVals[i]
    this.setState({colors: newState.colors})

  }


  renderRows() {
    const allRows = [];
    const rowsCopy = this.state.rows;
    for (let i = (rowsCopy.length - 1); i >= 0; i -= 1) {
      // if (rowsCopy[i].edit === true) {
      //   allrows.push(
      //     <span key={i.toString()}><button className='delete'
      //     onClick={() => this.deleteARow(i)}> - </button> {'Row' +
      //   (i + 1).toString()}:<form id={i.toString()} onSubmit={(evt)=>{ evt.preventDefault();
      //       this.handleSubmit(i);}}>
      //       <input className='rowEdit' type='text' value={this.state.rows[i].rowText}
      //         onChange={(evt)=> this.handleChange(evt, i)}/><input type='submit'/></form>
      //         <br/>
      //   <button className='add' onClick={() => this.addARow(i)}> + </button></span>
      //   );
      // } else {
      allRows.push(<span key={i.toString()}><button className='delete'
        onClick={() => this.deleteARow(i)}> - </button> {'Row' +
        (i + 1).toString()}: <RowText edit={rowsCopy[i].edit} rowNum={i} 
        handleRowSubmit={this.handleSubmit} handleRowChange={this.handleChange} 
        rowText={rowsCopy[i].rowText} value={rowsCopy[i].value}/>
        <button className='edit' onClick={
        ()=> this.editRow(i)}>Edit</button><br/>
        <button className='add' onClick={() => this.addARow(i)}>
      + </button>
        </span>);
      }
    // }
    return allRows;
  }

  render() {
    return (
      <div className='row'>
        <div id='textside' className='col-6'>
          <h5> Pattern Text</h5>
          <ColorText colorVals={this.state.colorVals} handleChange={this.handleColorChange}
          handleSubmit={this.handleColorSubmit}/>
          <div id='text'>
            <button className='add' onClick={() => this.addTopRow()}>
              +</button>
            {this.renderRows()}

          </div>
        </div>
        <div id='svgside' className='col-6'>
          SVG side
          <svg id='svg'/>
        </div>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));
