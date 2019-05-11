import React, { Component } from 'react';
import '../styles/Search.css';
import Places from './Places'

class Search extends Component {
  render() {
    return (
      <div data-testid='search-container' className='search-container'>
        <div>
          <form>
            <input
              type="text"
              placeholder="Search a location" />
          </form>
        </div>
        <Places data={this.props.locations} />
      </div>
    )
  }
}

export default Search