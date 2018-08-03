/* global React ReactDOM :true*/

class SVG extends React.Component {

  componentDidMount() {
    const s = Snap('#svg');

    s.rect(10, 10, this.props.size, this.props.size).attr({ stroke: 'black' });
  }

  render() {
    return (<svg id='svg' />);
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { size: 10 };
  }

  render() {
    return (<SVG size={this.state.size} />);
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
