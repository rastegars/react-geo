// @flow
import React, { PureComponent } from 'react';
import '../styles/Search.css';
import Places from './Places';
import SearchResult from './SearchResult';
import axios from 'axios';

const initialState = {
  searchItems: [],
  query: '',
  error: false,
}

type SearchItem = {
  data: {
    place_id: string,
    display_name: string,
    lat: string,
    lon: string
  }
};

type SearchResultData = Array<SearchItem>;

type Location = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type Locations = Array<Location>;

type Props = {
  locations: Locations,
  deletePlace: (itemID: number) => void,
  showError: () => void,
  addLocation: (location: Location) => void
};

type State = {
  searchItems: SearchResultData,
  query: string,
  error: boolean
};

class Search extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = initialState
  }

  handleInputChange = (e: {target: {value: string}}) => {
    const query = e.target.value
    this.setState({ query })

    if (query && query.length > 1) {
      this.search();
    } 
  }

  reset = () => {
    this.setState(initialState)
  }

  search = () => {
    if (!process.env.REACT_APP_API_HOST) throw new Error('REACT_APP_API_HOST missing')
    const SEARCH_URL = `${process.env.REACT_APP_API_HOST}/places/search?prefix=${this.state.query}&limit=7`
    axios.get(SEARCH_URL).then(({ data }) => {
      this.setState({
        searchItems: data,
        error: false
      })
    }).catch((error) => {
      this.props.showError()
    })
  }

  renderContent = () => {
    if (this.state.error) {
      return (
        <div className="error" style={{margin: 20}}>Session Timeout!</div>
      )
    }

    if (this.state.query.length > 1) {
      return (
        <SearchResult 
          data={this.state.searchItems}
          addLocation={this.props.addLocation}
          reset={this.reset}
          showError={this.props.showError}
        />
      )
    }

    return (
      <Places data={this.props.locations} deletePlace={this.props.deletePlace} />
    )
  }

  render() {
    return (
      <div data-testid='search-container' className='search-container'>
        <div className='form-container'>
          <form>
            <input
              type="text"
              placeholder="Search a location"
              onChange={this.handleInputChange}
              />
          </form>
        </div>
        {this.renderContent()}
      </div>
    )
  }
}

export default Search