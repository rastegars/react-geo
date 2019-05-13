import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import GoogleMap from '../components/GoogleMap'


test('Renders google map', () => {
  const data = [{
    id: 1,
    location: 'Place Name',
    lat: 12.1,
    lon: 13.1
  }]

  const {getByTestId} = render(<GoogleMap data={data} />)
  expect(getByTestId('google-map-container')).toBeInTheDocument()
});

