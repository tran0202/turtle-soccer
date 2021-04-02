import React from 'react'
import { shallow } from 'enzyme'
import About from './About'

const data = {
  id: 'id',
  config: {},
  details: {
    host: ['RUS'],
    final_host: [],
    final_standings: { third_place: [] },
  },
}

test('renders About', () => {
  const wrapper = shallow(<About tournament={data} />)
  expect(wrapper.find('img').length).toBe(1)
})
