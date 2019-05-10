import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import GoogleMap from '../components/GoogleMap'


it('Renders google map', () => {
  const {getByTestId} = render(<GoogleMap />)
  expect(getByTestId('google-map-container')).toBeInTheDocument()
});

