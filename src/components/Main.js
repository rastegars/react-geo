import React, { Component } from 'react'
import axios from 'axios'
import GoogleMap from './GoogleMap'
import Search from './Search'
import '../styles/Main.css'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = { locations: [], error: false }
  }

  componentDidMount() {
    this.getPlaces()
  }

  getPlaces = () => {
    axios.get('http://localhost:3004/places').then(({data}) => {
      this.setState({
        locations: data
      }) 
    }).catch((error) => {
        this.setState({error: true})
      })
  }

  showError = () =>
    this.setState({error: true})

  renderError = () =>
    <div className="alert">
      <span className="closebtn" onClick={() => this.setState({ error: false })}>&times;</span> 
      Something Went Wrong!
    </div>

  addLocation = (location) => {
    this.setState({locations: [...this.state.locations, location]})
  }

  render() {
    return (
      <div>
        {this.state.error && this.renderError()}
        <GoogleMap data={this.state.locations} />
        <Search locations={this.state.locations} addLocation={this.addLocation} showError={this.showError} />
      </div>
    )
  }
}

export default Main;