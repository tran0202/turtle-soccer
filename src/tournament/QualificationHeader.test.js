import React from 'react'
import { shallow } from 'enzyme'
import QualificationHeader from './QualificationHeader'

const data = { qState: { qualification: { details: {} }, competition: { details: {} } }, query: {} }

test('renders QualificationHeader', () => {
  const wrapper = shallow(<QualificationHeader qState={data.qState} query={data.query} />)
  expect(wrapper.find('img').length).toBe(1)
})
