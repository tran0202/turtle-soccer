import React from 'react'
import { shallow } from 'enzyme'
// import { render, screen } from '@testing-library/react'
import App from './App'

test('renders learn react link', () => {
  const wrapper = shallow(<App />)
  expect(wrapper.find('a').length).toBe(1)
  // render(<App />)
  // const linkElement = screen.getByText(/learn react/i)
  // expect(linkElement).toBeInTheDocument()
})
