import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Main from '../components/Main'


describe('Main component', () => {
  describe('when rendered', () => {
    const {getByTestId} = render(
      <Main />
    )
    it('should display google map', () => {
      expect(getByTestId('google-map-container')).toBeInTheDocument()
    });
  });
});

