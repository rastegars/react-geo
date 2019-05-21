// @flow
import React, { PureComponent } from 'react'
import axios from 'axios'
import '../styles/SearchResult.css'

type SearchItem = {
  data: {
    place_id: string,
    display_name: string,
    lat: string,
    lon: string
  }
};

type Location = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type SearchResultData = Array<SearchItem>;

type Props = {
  data: SearchResultData,
  addLocation: (data: Location) => void,
  reset: () => void,
  showError: () => void,
};

type State = {
  locations: SearchResultData,
};

class SearchResult extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { locations: this.props.data }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data !== this.props.data) {
      this.setState({locations: this.props.data})
    }
  }

  saveLocation = (location: SearchItem) => {
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