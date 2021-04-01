import React from 'react'
import { shallow } from 'enzyme'
import Rankings from './Rankings'

const rounds = [{}]

test('renders Rankings', () => {
  const wrapper = shallow(<Rankings rounds={rounds} />)
  expect(wrapper.find('h1').length).toBe(0)
})
