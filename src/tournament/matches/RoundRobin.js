import React from 'react'
import { DisplaySchedule, getDateMatchArray } from './MatchHelper'

const getStageMatches = (stage, sorted) => {
  let matches = []
  stage.groups &&
    stage.groups.forEach((g) => {
      g.matches &&
        g.matches.forEach((m) => {
          matches.push({ ...m, group: g.details.name })
        })
    })
  return getDateMatchArray(matches, sorted)
}

const RoundRobin = (props) => {
  const { stage, config } = props
  const combinedConfig = { ...config, ...stage.config }
  const sortedMatches = getStageMatches(stage, true)
  // console.log('sortedMatches', sortedMatches)

  return <DisplaySchedule round={sortedMatches} config={combinedConfig} />
}

export default RoundRobin
