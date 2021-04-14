import React from 'react'
import { DisplaySchedule } from './MatchHelper'
import { isEmpty } from 'lodash'

export const getDateLeagueMatchArray = (matches, sorted) => {
  if (isEmpty(matches)) return []
  const date_league_matches = []
  if (sorted) {
    matches.sort((a, b) => {
      if (a.date + a.time < b.date + b.time) {
        return -1
      } else if (a.date + a.time > b.date + a.time) {
        return 1
      } else {
        return 0
      }
    })
  }
  matches.forEach((m) => {
    const found = date_league_matches.find((dm) => dm.date === m.date)
    if (isEmpty(found)) {
      date_league_matches.push({ date: m.date, leagues: [{ name: m.league_name, matches: [m] }] })
    } else {
      const league_found = found.leagues.find((l) => l.name === m.league_name)
      if (isEmpty(league_found)) {
        found.leagues.push({ name: m.league_name, matches: [m] })
      } else {
        league_found.matches.push(m)
      }
    }
  })
  date_league_matches.forEach((d) => {
    d.leagues.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        return 0
      }
    })
    d.leagues.forEach((l) => {
      l.matches.sort((a, b) => {
        if (a.group < b.group) {
          return -1
        } else if (a.group > b.group) {
          return 1
        } else {
          return 0
        }
      })
    })
  })
  return date_league_matches
}

const RoundRobinLeagueMatchDay = (props) => {
  const { matchday, config } = props
  // console.log('getDateLeagueMatchArray(matchday.matches)', getDateLeagueMatchArray(matchday.matches))
  const { matches } = matchday
  const matchArray = getDateLeagueMatchArray(matches, true)
  return (
    <React.Fragment>
      <DisplaySchedule round={matchArray} config={config} />
    </React.Fragment>
  )
}

export default RoundRobinLeagueMatchDay
