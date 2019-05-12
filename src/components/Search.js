import React, { Component } from 'react';
import '../styles/Search.css';
import Places from './Places';
import SearchResult from './SearchResult';
import axios from 'axios';

const initialState = {
  searchItems: [],
  query: '',
  error: false
}

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  handleInputChange = (e) => {
    let query = e.target.value
    this.setState({ query })

    if (query && query.length > 1) {
      this.search();
    } 
  }

  search = () => {
    const SEARCH_URL = 'http://localhost:3004/places/search'
    axios.get(`${SEARCH_URL}?prefix=${this.state.query}&limit=7`)
         .then(({ data }) => {
           this.setState({
             searchItems: data,
             loading: false,
             error: false
           })
         }).catch((error) => {
            this.setState({
               error: true
             })
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
        />
      )
    }

    return (
      <Places data={this.props.locations} />
    )
      
  }

  render() {
    return (
      <div data-testid='search-container' className='search-container'>
        <div>
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