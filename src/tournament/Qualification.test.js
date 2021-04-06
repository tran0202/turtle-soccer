import React from 'react'
import { shallow } from 'enzyme'
import Qualification from './Qualification'

const data = { state: { tournament: { qualification: { config: {} } } }, query: {} }

test('renders Qualification', () => {
  const wrapper = shallow(<Qualification state={data.state} query={data.query} />)
  expect(wrapper.find('img').length).toBe(0)
})
