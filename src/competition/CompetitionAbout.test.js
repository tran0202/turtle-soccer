import React from 'react'
import { shallow } from 'enzyme'
import CompetitionAbout from './CompetitionAbout'

const data = { details: { trophy_filename: 'trophy_filename.png', descriptions: [] }, config: { logo_path: 'logo_path' } }

test('renders header', () => {
  const wrapper = shallow(<CompetitionAbout competition={data} />)
  expect(wrapper.find('img').length).toBe(1)
})
