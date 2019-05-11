import React, { Component } from 'react';

class Places extends Component {
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
    <div key={item.id}>
      <p>{item.location}</p>
      <p>Latitude: {item.lat}</p>
      <p>Longitude: {item.lon}</p>
    </div>

  render() {
    return <div data-testid="saved-places">
      {this.state.locations.map(location => this.renderItem(location))}
    </div>
  }
}

export default Places