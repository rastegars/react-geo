import React, { PureComponent } from 'react'
import axios from 'axios'
import '../styles/SearchResult.css'

class SearchResult extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { locations: this.props.data }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.locations !== this.props.data) {
      this.setState({locations: this.props.data, loading: this.props.loading})
    }
  }

  saveLocation = (location) => {
    axios.post('http://localhost:3004/places', {
      location: location.data.display_name,
      lat: location.data.lat,
      lon: location.data.lon
    }).then(({data}) => {
        this.props.addLocation(data)
        this.props.reset()
      }).catch((error) => {
          this.props.showError()
        })
  }

  render() {
    const options = this.state.locations.map(location => (
      <li className='search-item' key={location.data.place_id} >
        <div>
        {location.data.display_name.length > 40 ? ((location.data.display_name.substring(0, 40) + ' ...')) : location.data.display_name}
        </div>
        <div style={{textAlign: 'right'}}>
          <button className="button" onClick={() => this.saveLocation(location)}>Save</button>
        </div>
      </li>
    ))
    return <ul data-testid="search-result">{options}</ul>
  }
}

export default SearchResult