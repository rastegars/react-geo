import React, { PureComponent } from 'react'
import axios from 'axios'
import GoogleMap from './GoogleMap'
import Search from './Search'
import '../styles/Main.css'

class Main extends PureComponent {
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

  deletePlace = (itemID) => {
    const URL = `http://localhost:3004/places/${itemID}`
    axios.delete(URL).then(() => {
      let arr = this.state.locations
      let findIndex = arr.findIndex((element) => element.id === itemID)
      let result = findIndex >= 0 ? [...arr.slice(0, findIndex), ...arr.slice(findIndex + 1)] : arr
      this.setState({locations: result, error: false})
    }).catch((error) => {
      this.setState({error: true})
    })
  }

  showError = () =>
    this.setState({error: true})

  renderError = () =>
    <div className="alert">
      <span className="closebtn" onClick={() => this.setState({ error: false })}>&times;</span> 
      <p style={{margin: 0}}>Something Went Wrong!</p>
    </div>

  addLocation = (location) => {
    this.setState({locations: [...this.state.locations, location]})
  }

  render() {
    return (
      <div>
        <div className="header">
          <a href="#default" className="logo">React Geocoding Exercise</a>
        </div>
        {this.state.error && this.renderError()}
        <GoogleMap data={this.state.locations} showError={this.showError} />
        <Search locations={this.state.locations} addLocation={this.addLocation} showError={this.showError} deletePlace={this.deletePlace} />
      </div>
    )
  }
}

export default Main;