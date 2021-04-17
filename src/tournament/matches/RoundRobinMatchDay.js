import React from 'react'
import { DisplaySchedule, getRoundMatches } from './MatchHelper'

const RoundRobinMatchDay = (props) => {
  const { matchday, config } = props
  // console.log('matchday', matchday)
  const matchArray = getRoundMatches(matchday, true)
  return <DisplaySchedule round={matchArray} config={config} details={matchday.details} />
}

export default RoundRobinMatchDay
