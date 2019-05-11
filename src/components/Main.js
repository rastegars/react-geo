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

  render() {
    return (
      <div>
        <GoogleMap />
        <Search locations={this.state.locations} />
      </div>
    )
  }
}

export default Main;