// @flow
import React, { PureComponent } from 'react'
import '../styles/Places.css'

type Location = {
  id: number,
  location: string,
  lat: string,
  lon: string
};

type Locations = Array<Location>;

type Props = {
  data: Locations,
  deletePlace: (itemID: number) => void,
};

type State = {
  locations: Locations,
};

class Places extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { locations: props.data }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.data !== this.props.data) {
      this.setState({locations: this.props.data})
    }
  }

  renderItem = (item: Location) =>
    <div className="list-item" key={item.id}>
      <p className="location-name">{item.location}</p>
      <p>Latitude: {item.lat}</p>
      <p>Longitude: {item.lon}</p>
      <div style={{textAlign: 'right'}}>
        <div className="deleteButton" onClick={() => this.props.deletePlace(item.id)}>Remove</div>
      </div>
    </div>

  render() {
    return <div data-testid="saved-places">
      {this.state.locations.map(location => this.renderItem(location))}
    </div>
  }
}

export default Places