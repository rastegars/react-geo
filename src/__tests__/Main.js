import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Main from '../components/Main'


it('should display google map', () => {
  const {getByTestId} = render(<Main />)
  expect(getByTestId('google-map-container')).toBeInTheDocument()
});

