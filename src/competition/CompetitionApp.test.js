import React from 'react'
import { shallow } from 'enzyme'
import CompetitionApp from './CompetitionApp'

test('renders header', () => {
  const wrapper = shallow(<CompetitionApp query={{ page: 'about', id: 'WC' }} />)
  expect(wrapper.find('h1').length).toBe(1)
})
