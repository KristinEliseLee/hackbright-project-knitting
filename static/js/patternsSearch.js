/* global $ React:true*/

function SearchBar(props) {
  return (
    <form action='/patterns/search/results.json' onSubmit={(evt) => {
      evt.preventDefault(); props.onSubmit(1) }}>
      <input type='text' value={props.value} name='searchVal' onChange={props.onChange}/>
      <input type='submit' name='Search'/>
    </form>
  );
}

function DisplayResults(props) {
  let allResults = [];
  let i = 0
  for (let item of props.results) {
    allResults.push (
      <li key={i}>
        <a href={`/patterns/${item[0]}`}> {item[1]} <img src={item[2]} />
        </a>
      </li>
    );
    i += 1;
  }
  return (
    <ul>
      {allResults}
    </ul>
  );
}

function DisplayPages(props) {
  // props - numPages, page
  const allPages = []
  if (props.page > 1) {
    allPages.push(<span onClick={()=>props.onClick(props.page - 1)}> {'<<prev'} </span>
    );
  }
  for (let i = 1; i <= props.numPages; i += 1) {
    if (i !== props.page) {
      allPages.push(
        <span key={i} className='pages' onClick={()=>props.onClick(i)}>{i}
        </span>
      );}
    else {
      allPages.push(<span key={i} className='currentPage'>{i}</span>);
    }
  }
  if (props.page < props.numPages) {
    allPages.push(<span onClick={()=>props.onClick(props.page + 1)}> {'next>>'} </span>
    );
  }
  if (props.numPages > 0) {
    return (<React.Fragment><h6>Page {props.page} of {props.numPages}</h6>
      Go To Page: {allPages}
    </React.Fragment>
    );
  }
  return null
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      currentSearch: '',
      page: 1,
      searchResults: {patterns: [], numPages: 0}
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setSearchResults = this.setSearchResults.bind(this)
  }

  setSearchResults(data) {
    this.setState({searchResults: data})
  }

  handleSearchChange(evt) {
    const newState = $.extend(true, {}, this.state);
    newState.searchVal = evt.target.value;
    this.setState({ searchVal: newState.searchVal });
  }

  handleSearch(page) {
    const newState = $.extend(true, {}, this.state);
    newState.page = page;
    newState.currentSearch = newState.searchVal
    let data;
    $.get('/patterns/search/results.json', { searchVal: newState.searchVal, page: page },
      (response) => { data = JSON.parse(response);
        this.setSearchResults(data);
      });

    this.setState({page: newState.page, currentSearch: newState.currentSearch});
  }

  render() {
    return (<div>
      <SearchBar onSubmit={this.handleSearch} onChange={this.handleSearchChange} 
        value={this.state.value} />
      <DisplayPages numPages={this.state.searchResults.numPages}
        page={this.state.page} onClick={this.handleSearch}/>
      <DisplayResults results={this.state.searchResults.patterns} />
    </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));