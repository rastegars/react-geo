import React, { Component } from 'react';

class Search extends Component {
  render() {
    return (
      <div data-testid='search-container' style={{position: 'absolute', left: '50%', width: '50%'}}>
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