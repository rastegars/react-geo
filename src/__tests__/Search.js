import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Search from '../components/Search'

it('renders serach container', () => {
  const {getByTestId} = render(<Search />)
  expect(getByTestId('search-container')).toBeInTheDocument()
});

