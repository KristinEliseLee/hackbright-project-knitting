/* global $ React :true*/

function SearchBar(props) {
  return (
    <form action='/patterns/search/results.json' id='searchbar' onSubmit={(evt) => {
      evt.preventDefault(); props.onSubmit(1);
    }}><div className='form-group row justify-content-center'>
      <div className="input-group col-lg-4 col-6" >
        <input type='text' className="searchBar text-input form-control" value={props.value} name='searchVal' onChange={props.onChange}/>
        <input type='submit' name='Search' className='btn btn-outline-secondary'/>
        </div>
      </div>
    </form>
  );
}

function DisplayResults(props) {
  let allResults = [];
  let i = 0;
  for (let item of props.results) {
    allResults.push(
      <tr key={i}>
        <td><a href={`/patterns/${item[0]}`}>{item[1]} </a></td>
        <td><a href={`/patterns/${item[0]}`}><img src={item[2]} className='thumbnail' /></a></td>
      </tr>
    );
    i += 1;
  }
  return (
    <table className='table col-8 offset-2'>
      <tbody>
        {allResults}
      </tbody>
    </table>
  );
}

function DisplayPages(props) {
  // props - numPages, page
  const allPages = [];
  if (props.page > 1) {
    allPages.push(<div key='prev' className='pages col-1' onClick={
      ()=>props.onClick(props.page - 1)}> {'<<prev'} </div>
    );
  } else {
    allPages.push(<div key='prev' className='col-1 currentPage'> {'<<prev'} </div>);
  }
  const numPages = [];
  for (let i = 1; i <= props.numPages; i += 1) {
    if (i !== props.page) {
      numPages.push(
        <span key={i} className='pages' onClick={()=>props.onClick(i)}>{i}
        </span>
      );
    } else {
      numPages.push(<span key={i} className='currentPage'>{i}</span>);
    }
  }
  allPages.push(<div key='numPages' className='numpages col-6'>{numPages}</div>);
  if (props.page < props.numPages) {
    allPages.push(<div key='next' className='col-1 pages' onClick={
      ()=>props.onClick(props.page + 1)}> {'next>>'} </div>
    );
  } else {
    allPages.push(<div key='next' className='col-1 currentPage'>{'next>>'}</div>);
  }
  if (props.numPages > 1) {
    return (
      <div key='allPages' className='row justify-content-center'>{allPages}
      </div>
    );
  }
  return null;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      currentSearch: '',
      page: 1,
      searchResults: { patterns: [], numPages: 0 }
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setSearchResults = this.setSearchResults.bind(this);
  }

  setSearchResults(data) {
    this.setState({ searchResults: data });
  }

  handleSearchChange(evt) {
    const newState = $.extend(true, {}, this.state);
    newState.searchVal = evt.target.value;
    this.setState({ searchVal: newState.searchVal });
  }

  handleSearch(page) {
    const newState = $.extend(true, {}, this.state);
    newState.page = page;
    newState.currentSearch = newState.searchVal;
    // fetch has problems with URL parameters
    // let url = new URL('/patterns/search/results.json');
    // let params = {searchVal: newState.searchVal, page: newState.page};
    // url.search = new URLSearchParams(params);
    // fetch(url)
    // .then(response => response.json())
    // .then(data => this.setSearchResults(data))
    $.get('/patterns/search/results.json', { searchVal: newState.searchVal, page: page },
      (response) => {
        let data = JSON.parse(response);
        this.setSearchResults(data);
      });

    this.setState({ page: newState.page, currentSearch: newState.currentSearch });
  }

  render() {
    return (<div>
      <div className='row search-text'>
        <h4> Search Pattern By Name </h4>
      </div>
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
