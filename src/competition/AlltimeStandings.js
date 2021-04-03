import React from 'react'
import Rankings from '../rankings/Rankings'
import { calculateProgressRankings, collectProgressRankings, sortGroupRankings } from '../rankings/RankingsHelper'
import { getParentTeam, getTeamName } from '../core/TeamHelper'
import { isSuccessor } from '../core/Helper'
import { Row, Col } from 'reactstrap'
import { isEmpty } from 'lodash'

const updateRankings = (fr1, fr2) => {
  fr1.mp += fr2.mp
  fr1.w += fr2.w
  fr1.d += fr2.d
  fr1.l += fr2.l
  fr1.gf += fr2.gf
  fr1.ga += fr2.ga
  fr1.gd += fr2.gd
  fr1.pts += fr2.pts
}

const updateSuccessorRankings = (successor_rankings, alltime_rankings) => {
  successor_rankings.final_rankings.forEach((fr) => {
    const tmp = alltime_rankings.final_rankings.find((afr) => afr.id === fr.parent_id)
    if (tmp) {
      fr.r = tmp.r
    }
    if (isSuccessor(fr.id)) {
      const tmp2 = alltime_rankings.final_rankings.find((afr) => afr.id === fr.id)
      if (tmp2) {
        fr.r = tmp2.r
      }
    }
  })
  successor_rankings.final_rankings.sort((a, b) => {
    return a.r > b.r ? 1 : -1
  })
  successor_rankings.successors = []
  let previousRank = 0
  let tmp_rankings = []
  successor_rankings.final_rankings.forEach((fr) => {
    const currentRank = fr.r
    if (currentRank !== previousRank) {
      tmp_rankings = []
      tmp_rankings.push(fr)
      successor_rankings.successors.push({
        r: fr.r,
        name: fr.parent_id ? getTeamName(fr.parent_id) : getTeamName(fr.id),
        final_rankings: tmp_rankings,
        ranking_type: 'successorround',
      })
    } else {
      tmp_rankings.push(fr)
      const successor = successor_rankings.successors.find((s) => s.r === fr.r)
      successor.name = getTeamName(fr.parent_id ? fr.parent_id : fr.id)
    }
    previousRank = fr.r
  })
}

const collectSuccessorRankings = (successor_rankings, fr, parentTeam) => {
  fr.parent_id = parentTeam.id
  const team_sr = successor_rankings.find((sr) => sr.id === fr.id)
  if (!team_sr) {
    successor_rankings.push({ ...fr, years: [fr.year] })
  } else {
    updateRankings(team_sr, fr)
    team_sr.years.push(fr.year)
  }
}

const collectRankings = (competition) => {
  if (!competition) return
  const { tournaments } = competition
  if (!tournaments) return

  let final_rankings = []
  let successor_rankings = []
  let alltimeRankings = { final_rankings, ranking_type: 'alltimeround' }
  let successorRankings = { final_rankings: successor_rankings, ranking_type: 'alltimeround' }

  tournaments.forEach((t) => {
    const config = { ...t.config, ...t.details }
    let _teams = []
    let _matches = []

    t.stages.forEach((s) => {
      if (s.type === 'allocation' || s.type === 'roundrobin' || s.type === 'roundrobinmatchday') {
        s.bye_teams && s.bye_teams.forEach((t) => _teams.push(t))
        s.groups &&
          s.groups.forEach((g) => {
            g.teams &&
              g.teams.forEach((t) => {
                if (!_teams.find((t2) => t.id === t2.id)) {
                  _teams.push(t)
                }
              })
            g.matches &&
              g.matches.forEach((m) => {
                _matches.push(m)
              })
            g.matchdays &&
              g.matchdays.forEach((md) => {
                md.matches &&
                  md.matches.forEach((m) => {
                    _matches.push(m)
                  })
              })
          })
      }
      if (s.type === 'knockout' || s.type === 'knockout2legged' || s.type === 'knockoutmultiple2legged') {
        s.teams &&
          s.teams.forEach((t) => {
            _teams.push(t)
          })
        s.rounds &&
          s.rounds.forEach((r) => {
            r.bye_teams && r.bye_teams.forEach((t) => _teams.push(t))
            r.matches &&
              r.matches.forEach((m) => {
                if (!m.home_bye && !m.away_withdrew && !m.postponed && !m.match_void) {
                  if (r.round_type === 'secondleg') {
                    _matches.push({ ...m, match_type: 'secondleg' })
                  } else {
                    _matches.push(m)
                  }
                }
              })
            r.pairs &&
              r.pairs.forEach((p) => {
                p.matches &&
                  p.matches.forEach((m) => {
                    _matches.push(m)
                  })
              })
          })
      }
    })
    t.leagues &&
      t.leagues.forEach((l) => {
        l.stages &&
          l.stages.forEach((s) => {
            if (s.type === 'roundrobinleaguematchday') {
              s.groups &&
                s.groups.forEach((g) => {
                  g.teams &&
                    g.teams.forEach((t) => {
                      if (!_teams.find((t2) => t.id === t2.id)) {
                        _teams.push(t)
                      }
                    })
                  g.matchdays &&
                    g.matchdays.forEach((md) => {
                      md.matches &&
                        md.matches.forEach((m) => {
                          _matches.push(m)
                        })
                    })
                })
            } else if (s.type === 'knockout') {
              s.rounds &&
                s.rounds.forEach((r) => {
                  r.matches &&
                    r.matches.forEach((m) => {
                      if (!m.home_bye && !m.away_withdrew && !m.postponed && !m.match_void) {
                        _matches.push(m)
                      }
                    })
                })
            }
          })
      })
    // console.log('_teams', _teams)
    calculateProgressRankings(t, _teams, _matches, config)
    // collecting the teams' progress rankings and creating the tournament's final_rankings
    collectProgressRankings(t, _teams, 18)

    t.final_rankings &&
      t.final_rankings.forEach((fr) => {
        if (fr) {
          const parentTeam = getParentTeam(fr.id)
          const teamId = parentTeam ? parentTeam.id : fr.id
          const team_fr = final_rankings.find((fr2) => teamId === fr2.id)
          if (!team_fr) {
            if (parentTeam) {
              final_rankings.push({ ...fr, id: parentTeam.id, children_teams: [{ id: fr.id, year: [fr.year] }] })
              if (isSuccessor(parentTeam.id)) {
                collectSuccessorRankings(successor_rankings, fr, parentTeam)
              }
            } else {
              final_rankings.push(fr)
            }
          } else {
            if (parentTeam) {
              if (isSuccessor(parentTeam.id)) {
                collectSuccessorRankings(successor_rankings, fr, parentTeam)
              }
              if (!team_fr.children_teams) {
                team_fr.children_teams = []
              }
              const children_year = team_fr.children_teams.find((ct) => ct.id === fr.id)
              if (!children_year) {
                team_fr.children_teams.push({ id: fr.id, year: [fr.year] })
              } else {
                children_year.year.push(fr.year)
              }
            }
            updateRankings(team_fr, fr)
          }
          if (isSuccessor(fr.id)) {
            let team_sr = successor_rankings.find((sr) => sr.id === fr.id)
            if (!team_sr) {
              successor_rankings.push({
                r: fr.r,
                id: fr.id,
                mp: fr.mp,
                w: fr.w,
                d: fr.d,
                l: fr.l,
                gf: fr.gf,
                ga: fr.ga,
                gd: fr.gd,
                pts: fr.pts,
                years: [fr.year],
              })
            } else {
              updateRankings(team_sr, fr)
              team_sr.years.push(fr.year)
            }
          }
        }
      })
  })

  sortGroupRankings(alltimeRankings, 1, null)
  competition.alltime_rankings = alltimeRankings
  updateSuccessorRankings(successorRankings, alltimeRankings)
  competition.successor_rankings = successorRankings
}

const AlltimeStandings = (props) => {
  const { competition } = props
  collectRankings(competition)
  const alltimeRound = competition.tournaments ? competition.alltime_rankings : {}
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      <Rankings rounds={[alltimeRound]} config={competition.config} />
      {competition.config.show_successors && !isEmpty(competition.successor_rankings) && (
        <React.Fragment>
          <Row>
            <Col>
              <div className="h2-ff1 margin-top-md">Breakdown of successor teams</div>
            </Col>
          </Row>
          <Rankings rounds={competition.successor_rankings.successors} config={competition.config} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default AlltimeStandings
