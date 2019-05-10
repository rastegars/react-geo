import React, { Component } from 'react'
import GoogleMap from './GoogleMap'
import Search from './Search'

class Main extends Component {
  render() {
    return (
      <div>
        <GoogleMap />
        <Search />
      </div>
    )
  }
}

export default Main;