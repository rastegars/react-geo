import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Search from '../components/Search'

const data = [{
  id: 1,
  location: 'Location Name',
  lat: 12.1,
  lon: 13.1
}]

it('renders serach container', () => {
  const {getByTestId} = render(<Search locations={data} />)
  expect(getByTestId('search-container')).toBeInTheDocument()
});

