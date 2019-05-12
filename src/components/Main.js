import React, { Component } from 'react'
import axios from 'axios'
import GoogleMap from './GoogleMap'
import Search from './Search'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = { locations: [] }
  }

  componentDidMount() {
    this.getPlaces()
  }

  getPlaces = () => {
    axios.get('http://localhost:3004/places').then(({data}) => {
      this.setState({
        locations: data
      })
    })
  }

  addLocation = (location) => {
    this.setState({locations: [...this.state.locations, location]})
  }

  render() {
    return (
      <div>
        <GoogleMap />
        <Search locations={this.state.locations} addLocation={this.addLocation} />
      </div>
    )
  }
}

export default Main;