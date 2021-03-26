import React from 'react'
import { shallow } from 'enzyme'
import ConfederationsApp from './ConfederationsApp'

test('renders learn react link', () => {
  const wrapper = shallow(<ConfederationsApp />)
  expect(wrapper.find('img').length).toBe(7)
})
