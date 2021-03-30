import React from 'react'
import { shallow } from 'enzyme'
import CompetitionAbout from './CompetitionAbout'

test('renders header', () => {
  const wrapper = shallow(<CompetitionAbout competition={{ details: { trophy_filename: 'trophy_filename.png' }, config: { logo_path: 'logo_path' } }} />)
  expect(wrapper.find('img').length).toBe(1)
})
