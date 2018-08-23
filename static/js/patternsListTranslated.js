/* global $ React :true*/

function DisplayResults(props) {
  let allResults = [];
  let i = 0;
  for (let item of props.results) {
    allResults.push(React.createElement(
      'tr',
      { key: i },
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: `/patterns/${item[0]}` },
          item[1],
          ' '
        )
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { href: `/patterns/${item[0]}` },
          React.createElement('img', { src: item[2], className: 'thumbnail' })
        )
      )
    ));
    i += 1;
  }
  return React.createElement(
    'table',
    { className: 'table col-8 offset-2' },
    React.createElement(
      'tbody',
      null,
      allResults
    )
  );
}

function DisplayPages(props) {
  // props - numPages, page
  const allPages = [];
  if (props.page > 1) {
    allPages.push(React.createElement(
      'div',
      { key: 'prev', className: 'pages col-1', onClick: () => props.onClick(props.page - 1) },
      ' ',
      '<<prev',
      ' '
    ));
  } else {
    allPages.push(React.createElement(
      'div',
      { key: 'prev', className: 'col-1 currentPage' },
      ' ',
      '<<prev',
      ' '
    ));
  }
  const numPages = [];
  for (let i = 1; i <= props.numPages; i += 1) {
    if (i !== props.page) {
      numPages.push(React.createElement(
        'span',
        { key: i, className: 'pages', onClick: () => props.onClick(i) },
        i
      ));
    } else {
      numPages.push(React.createElement(
        'span',
        { key: i, className: 'currentPage' },
        i
      ));
    }
  }
  allPages.push(React.createElement(
    'div',
    { key: 'numpages', className: 'numpages col-6' },
    numPages
  ));
  if (props.page < props.numPages) {
    allPages.push(React.createElement(
      'div',
      { key: 'next', className: 'col-1 pages', onClick: () => props.onClick(props.page + 1) },
      ' ',
      'next>>',
      ' '
    ));
  } else {
    allPages.push(React.createElement(
      'div',
      { key: 'next', className: 'col-1 currentPage' },
      'next>>'
    ));
  }
  if (props.numPages > 1) {
    return React.createElement(
      'div',
      { key: 'allPages', className: 'row justify-content-center' },
      allPages
    );
  }
  return null;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      page: 1,
      searchResults: { patterns: [], numPages: 0 }
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.setSearchResults = this.setSearchResults.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.handleSearch(1);
  }

  setSearchResults(data) {
    this.setState({ searchResults: data });
  }

  handleSearch(page) {
    const newState = $.extend(true, {}, this.state);
    newState.page = page;
    // fetch has problems with URL parameters
    // let url = new URL('/patterns/search/results.json');
    // let params = {searchVal: newState.searchVal, page: newState.page};
    // url.search = new URLSearchParams(params);
    // fetch(url)
    // .then(response => response.json())
    // .then(data => this.setSearchResults(data))
    $.get('/patterns/search/results.json', { searchVal: newState.searchVal, page: page }, response => {
      if (this.mounted) {
        let data = JSON.parse(response);
        this.setSearchResults(data);
      }
    });

    this.setState({ page: newState.page });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'h4',
          null,
          'All Patterns'
        )
      ),
      React.createElement(DisplayPages, { numPages: this.state.searchResults.numPages,
        page: this.state.page, onClick: this.handleSearch }),
      React.createElement(DisplayResults, { results: this.state.searchResults.patterns })
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.querySelector('#root'));

