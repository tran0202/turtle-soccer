import React from 'react'
import { shallow } from 'enzyme'
import TournamentApp from './TournamentApp'

const data = { page: {} }

test('renders TournamentApp', () => {
  const wrapper = shallow(<TournamentApp query={data} />)
  expect(wrapper.find('img').length).toBe(0)
})
