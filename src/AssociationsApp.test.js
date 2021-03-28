import React from 'react'
import { shallow } from 'enzyme'
import AssociationsApp from './AssociationsApp'

test('renders learn react link', () => {
  const wrapper = shallow(<AssociationsApp />)
  expect(wrapper.find('img').length).toBe(222)
})
