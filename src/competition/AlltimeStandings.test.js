import React from 'react'
import { shallow } from 'enzyme'
import AlltimeStandings from './AlltimeStandings'

const data = { config: {} }

test('renders AlltimeStandings', () => {
  const wrapper = shallow(<AlltimeStandings competition={data} />)
  expect(wrapper.find('h1').length).toBe(0)
})
