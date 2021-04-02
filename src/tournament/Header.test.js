import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'

const data = { tournament: { details: { descriptions: [] } }, competition: { config: {} } }

test('renders header', () => {
  const wrapper = shallow(<Header state={data} />)
  expect(wrapper.find('img').length).toBe(1)
})
