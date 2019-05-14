import React, { PureComponent } from 'react'
import '../styles/Places.css'

class Places extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { locations: props.data }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.locations !== this.props.data) {
      this.setState({locations: this.props.data})
    }
  }

  renderItem = (item) =>
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