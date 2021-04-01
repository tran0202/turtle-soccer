import React from 'react'
import { shallow } from 'enzyme'
import AlltimeStandings from './AlltimeStandings'

test('renders AlltimeStandings', () => {
  const wrapper = shallow(<AlltimeStandings competition={{}} />)
  expect(wrapper.find('h1').length).toBe(0)
})
