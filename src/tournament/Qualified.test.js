import React from 'react'
import { shallow } from 'enzyme'
import Qualified from './Qualified'

const data = [{ team: 'QAT' }]

test('renders Qualified', () => {
  const wrapper = shallow(<Qualified teams={data} />)
  expect(wrapper.find('img').length).toBe(0)
})
