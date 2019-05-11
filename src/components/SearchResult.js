import React, { Component } from 'react'

class SearchResult extends Component {
  constructor(props) {
    super(props)
    this.state = { loading: false, locations: this.props.data }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.locations !== this.props.data) {
      this.setState({locations: this.props.data, loading: this.props.loading})
    }
  }

  render() {
    const options = this.state.locations.map(location => (
      <li key={location.data.place_id} >
        <div>{location.data.display_name.length > 40 ? ((location.data.display_name.substring(0, 40) + ' ...')) : location.data.display_name}</div>
        <div>
          <button onClick={() => this.saveLocation(location)}>Save</button>
        </div>
      </li>
    ))
    return <ul data-testid="search-result">{options}</ul>
  }
}

export default SearchResult