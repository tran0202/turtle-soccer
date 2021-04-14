import React from 'react'
import { DisplaySchedule, getRoundMatches } from './MatchHelper'

const RoundRobinMatchDay = (props) => {
  const { matchday, config } = props
  // console.log('stage', stage)
  const matchArray = getRoundMatches(matchday, true)
  return <DisplaySchedule round={matchArray} config={config} />
}

export default RoundRobinMatchDay
