import React, { Component } from 'react';
import '../styles/Search.css';

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
      </div>
    )
  }
}

export default Search