import React from 'react'
import { DisplaySchedule, getRoundMatches } from './MatchHelper'

const RoundRobinMatchDay = (props) => {
  const { stage, config } = props
  // console.log('stage', stage)
  const matchArray = getRoundMatches(stage, true)
  return <DisplaySchedule round={matchArray} config={config} />
}

export default RoundRobinMatchDay
