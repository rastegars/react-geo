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

class Search extends PureComponent {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  handleInputChange = (e) => {
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
    const SEARCH_URL = 'http://localhost:3004/places/search'
    axios.get(`${SEARCH_URL}?prefix=${this.state.query}&limit=7`)
         .then(({ data }) => {
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