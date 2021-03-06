import React from 'react'
import { shallow } from 'enzyme'
import CompetitionsApp from './CompetitionsApp'

test('renders competition names', () => {
  const wrapper = shallow(<CompetitionsApp />)
  expect(wrapper.find('h2').length).toBe(14)
  expect(wrapper.find('img').length).toBe(77)
})
