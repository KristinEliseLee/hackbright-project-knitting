var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global React Reactstrap $ :true */

function SimpleBar({ children, ...options }) {
  return React.createElement(
    'div',
    _extends({ 'data-simplebar': true }, options),
    React.createElement(
      'div',
      { className: 'simplebar-scroll-content' },
      React.createElement(
        'div',
        { className: 'simplebar-content' },
        children
      )
    )
  );
}

function ColorHelpModal(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      Reactstrap.Modal,
      { isOpen: props.show, toggle: props.onClick, className: 'colorHelp' },
      React.createElement(
        Reactstrap.ModalHeader,
        { toggle: props.onclick },
        'Colors'
      ),
      React.createElement(
        Reactstrap.ModalBody,
        null,
        React.createElement(
          'h4',
          null,
          'Basics'
        ),
        React.createElement(
          'p',
          null,
          'Click the "+" or "-" to add or remove colors',
          React.createElement('br', null),
          'Colors can be any CSS color - by name or hexcode. e.g."green" or "#00FF00"'
        )
      ),
      React.createElement(
        Reactstrap.ModalFooter,
        null,
        React.createElement(
          Reactstrap.Button,
          { className: 'btn btn-outline-secondary', onClick: props.onClick },
          'Cancel'
        )
      )
    )
  );
}
function RowHelpModal(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      Reactstrap.Modal,
      { isOpen: props.show, toggle: props.onClick, className: 'rowHelp' },
      React.createElement(
        Reactstrap.ModalHeader,
        { toggle: props.onclick },
        'Rows'
      ),
      React.createElement(
        Reactstrap.ModalBody,
        null,
        React.createElement(
          'h4',
          null,
          'Basics'
        ),
        React.createElement(
          'p',
          null,
          'Click the "+" or "-" to add or remove rows',
          React.createElement('br', null),
          'Enter row information in the format "Color (color number) (stitch name) (number of stitches)"',
          React.createElement('br', null),
          '"Color 2 Knit 5 Color 1 Purl 3" or "C2K5C1P3" - both are fine'
        ),
        React.createElement(
          'h4',
          null,
          'Currently Supported Stiches'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            'Knit: Knit or K'
          ),
          React.createElement(
            'li',
            null,
            'Purl: Purl or P'
          ),
          React.createElement(
            'li',
            null,
            'Cable Front Knit: CFK'
          ),
          React.createElement(
            'li',
            null,
            'Cable Back Knit: CBK'
          ),
          React.createElement(
            'li',
            null,
            'Cable Front Purl: CFP'
          ),
          React.createElement(
            'li',
            null,
            'Cable Back Purl: CBP'
          )
        )
      ),
      React.createElement(
        Reactstrap.ModalFooter,
        null,
        React.createElement(
          Reactstrap.Button,
          { className: 'btn btn-outline-secondary', onClick: props.onClick },
          'Cancel'
        )
      )
    )
  );
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
    group.addClass('svgstitch');
    stitch.image = group;
  }

  renderRow(s, rows, rowNum) {
    // adds whole row to SVG
    let row = rows[rowNum];
    let horizontal = this.props.width - row.length * 19.8;
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
        stitch.image.translate(stitch.width * (-1 * stitch.offset), 0);
      }
      horizontal += stitch.width;
      rowGroup.add(stitch.image);
    }
    rowGroup.addClass(`row${rowNum}`);
    rowGroup.click(() => this.props.highlight(rowNum));
    if (this.props.edit[rowNum].highlight) {
      rowGroup.addClass('highlight');
    }
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
    frontCables.forEach(el => {
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
    return React.createElement('svg', { id: 'svg', width: `${this.props.width}px`, height: `${this.props.height}px` });
  }
}

function SavePattern(props) {
  // creates name and save form for saving pattern
  return React.createElement(
    'form',
    { id: 'savePattern', onSubmit: evt => {
        evt.preventDefault();props.handleSubmit();
      } },
    React.createElement(
      'div',
      { className: 'form-group row' },
      React.createElement(
        'span',
        { className: 'nameLable col-form-label' },
        ' Name: '
      ),
      React.createElement(
        'div',
        { className: 'col-5 input-group' },
        React.createElement('input', { type: 'text', id: 'nameBox', className: 'form-control text-input',
          required: true, onChange: evt => props.handleChange(evt),
          value: props.value }),
        React.createElement('input', { type: 'submit', className: 'savePattern btn btn-outline-secondary', value: 'Save' })
      )
    )
  );
}

function ColorText(props) {
  // Renders the color text boxes
  const colorBoxes = [];
  for (let i = 0; i < props.colorVals.length; i += 1) {
    colorBoxes.push(React.createElement(
      'form',
      { key: i, id: 'color' + (i + 1).toString(), onSubmit: evt => {
          evt.preventDefault();
          props.handleSubmit(i);
        } },
      React.createElement(
        'div',
        { className: 'form-group form-inline' },
        React.createElement(
          'span',
          { className: 'col-form-label' },
          'Color ',
          i + 1
        ),
        React.createElement('input', { className: 'form-control text-input', type: 'text', value: props.colorVals[i], onChange: evt => {
            props.handleChange(evt, i);
          } }),
        React.createElement('input', { type: 'submit', className: 'btn btn-outline-secondary', value: 'Save' })
      )
    ));
  }
  return React.createElement(
    'span',
    null,
    ' ',
    colorBoxes
  );
}

function RowText(props) {
  // Renders a row of text, with an edit button, or a textbox with a save button
  let classes = 'rowText row' + props.rowNum.toString();
  if (props.highlight) {
    classes += ' highlight';
  }
  if (props.edit === true) {
    return React.createElement(
      'form',
      { id: props.rowNum, onSubmit: evt => {
          evt.preventDefault();
          props.handleSubmit(props.rowNum);
        }, className: 'form-inline' },
      React.createElement(
        'span',
        { className: `${classes} col-form-label`,
          onClick: () => props.toggleHighlight(props.rowNum) },
        'Row' + (props.rowNum + 1).toString(),
        ': '
      ),
      React.createElement('input', { type: 'text', value: props.value,
        onChange: evt => props.handleChange(evt, props.rowNum), className: `${classes} rowEdit text-input form-control` }),
      React.createElement('input', { type: 'submit', value: 'Save', className: `row${props.rowNum} rowSave btn btn-outline-secondary` })
    );
  }
  return React.createElement(
    'span',
    { key: props.rowNum },
    React.createElement(
      'button',
      { className: 'edit btn-outline-secondary btn btn-sm',
        onClick: () => props.editRow(props.rowNum) },
      'Edit'
    ),
    React.createElement(
      'span',
      { className: classes,
        onClick: () => props.toggleHighlight(props.rowNum) },
      'Row' + (props.rowNum + 1).toString(),
      ': '
    ),
    React.createElement(
      'span',
      { className: classes, onClick: () => props.toggleHighlight(props.rowNum) },
      ' ',
      props.rowText
    )
  );
}

function RenderRows(props) {
  // makes all row text lines
  const allRows = [];
  allRows.push(React.createElement(
    'span',
    { className: 'add', key: 'first', onClick: () => props.addTopRow() },
    '+'
  ));
  for (let i = props.rowsText.length - 1; i >= 0; i -= 1) {
    allRows.push(React.createElement(
      'span',
      { key: i.toString() },
      React.createElement('br', null),
      React.createElement(
        'span',
        { className: 'delete',
          onClick: () => props.deleteARow(i) },
        ' - '
      ),
      ' ',
      React.createElement(RowText, { edit: props.rowsEdit[i].edit, rowNum: i,
        handleSubmit: props.handleRowSubmit, handleChange: props.handleRowChange, highlight: props.rowsEdit[i].highlight,
        rowText: props.rowsText[i], value: props.rowsEdit[i].value, editRow: props.editRow, toggleHighlight: props.toggleHighlight }),
      React.createElement('br', null),
      React.createElement(
        'span',
        { className: 'add', onClick: () => props.addARow(i) },
        '+ '
      )
    ));
  }
  return allRows;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsText: ['COLOR 1 KNIT 3 COLOR 2 KNIT 3', 'C1 CBK3 C2 CFK3', 'C2K3C1K3'],
      rowsEdit: [{ edit: false, highlight: false }, { edit: false, highlight: false }, { edit: false, highlight: false }],
      colors: ['skyblue', '#C19AB7'],
      colorVals: ['skyblue', '#C19AB7'],
      name: '',
      colorHelp: false,
      rowHelp: false };
    this.handleRowSubmit = this.handleRowSubmit.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.addARow = this.addARow.bind(this);
    this.addTopRow = this.addTopRow.bind(this);
    this.deleteARow = this.deleteARow.bind(this);
    this.editRow = this.editRow.bind(this);
    this.handleColorSubmit = this.handleColorSubmit.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.addColor = this.addColor.bind(this);
    this.deleteColor = this.deleteColor.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.toggleColorHelpModal = this.toggleColorHelpModal.bind(this);
    this.toggleRowHelpModal = this.toggleRowHelpModal.bind(this);
    this.toggleHighlight = this.toggleHighlight.bind(this);
  }
  componentWillMount() {
    // Adds all stitches to state
    this.state.rowsStitches = makeStitchRows(this.state.rowsText);
  }

  toggleColorHelpModal() {
    this.setState({ colorHelp: !this.state.colorHelp });
  }

  toggleRowHelpModal() {
    this.setState({ rowHelp: !this.state.rowHelp });
  }

  toggleHighlight(i) {
    const newState = $.extend(true, {}, this.state);
    if (newState.rowsEdit[i].highlight) {
      newState.rowsEdit.forEach(x => x.highlight = false);
    } else {
      newState.rowsEdit.forEach(x => x.highlight = false);
      newState.rowsEdit[i].highlight = true;
    }
    this.setState({ rowsEdit: newState.rowsEdit });
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
    fetch('/save', { method: 'POST', body: formData }).then(response => response.text()).then(num => window.location.replace(`/patterns/${num}`));
  }

  handleNameChange(evt) {
    // Handles editing pattern name
    const newState = $.extend(true, {}, this.state);
    newState.name = evt.target.value;
    this.setState({ name: newState.name });
  }

  calculateMaxWidth() {
    // used to find how wide the SVG should be
    let max = 0;
    for (let row of this.state.rowsStitches) {
      if (row.length > max) {
        max = row.length;
      }
    }
    return max * 19.8;
  }

  calculateMaxHeight() {
    // used to find how tall the SVG should be
    return this.state.rowsStitches.length * 18;
  }

  render() {
    // whole page
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: 'row', id: 'wholepage' },
        React.createElement(
          'div',
          { id: 'textside', className: 'col-5 offset-1' },
          React.createElement(
            'div',
            { id: 'colorBox' },
            React.createElement(
              'h5',
              null,
              React.createElement(
                'span',
                { className: 'add', onClick: this.addColor },
                ' + '
              ),
              React.createElement(
                'span',
                { className: 'delete', onClick: this.deleteColor },
                ' - '
              ),
              ' Colors ',
              React.createElement(
                'span',
                { id: 'colorHelp', onClick: this.toggleColorHelpModal },
                React.createElement('i', { className: 'fas fa-question-circle' })
              )
            ),
            React.createElement(
              SimpleBar,
              { id: 'colorBoxes' },
              React.createElement(ColorText, { colorVals: this.state.colorVals, handleChange: this.handleColorChange,
                handleSubmit: this.handleColorSubmit })
            )
          ),
          React.createElement(
            'div',
            { id: 'patternBox' },
            React.createElement(
              'h5',
              null,
              ' Pattern Text ',
              React.createElement(
                'span',
                { id: 'rowHelp', onClick: this.toggleRowHelpModal },
                React.createElement('i', { className: 'fas fa-question-circle' })
              )
            ),
            React.createElement(
              SimpleBar,
              { id: 'patternTextBox' },
              React.createElement(RenderRows, { addTopRow: this.addTopRow, rowsText: this.state.rowsText,
                deleteARow: this.deleteARow, rowsEdit: this.state.rowsEdit,
                handleRowSubmit: this.handleRowSubmit, handleRowChange: this.handleRowChange,
                editRow: this.editRow, toggleHighlight: this.toggleHighlight, addARow: this.addARow })
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'svgside', className: 'col-6' },
          React.createElement(
            SimpleBar,
            { id: 'outerSVGbox' },
            React.createElement(
              'div',
              null,
              React.createElement(SvgMain, { key: '1', width: this.calculateMaxWidth(), height: this.calculateMaxHeight(),
                stitchRows: this.state.rowsStitches, colors: this.state.colors,
                edit: this.state.rowsEdit, highlight: this.toggleHighlight })
            )
          )
        ),
        React.createElement(ColorHelpModal, { onClick: this.toggleColorHelpModal, show: this.state.colorHelp }),
        React.createElement(RowHelpModal, { onClick: this.toggleRowHelpModal, show: this.state.rowHelp })
      ),
      React.createElement(
        'footer',
        { className: 'fixed-bottom' },
        React.createElement(
          'div',
          { className: 'offset-2' },
          React.createElement(SavePattern, { value: this.state.name, handleSubmit: this.handleSave,
            handleChange: this.handleNameChange })
        )
      )
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.querySelector('#root'));

