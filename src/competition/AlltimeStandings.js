import React from 'react'
// import Rankings from './Rankings'
// import { calculateProgressRankings, collectProgressRankings, sortGroupRankings } from './RankingsHelper'
// import { getTournamentConfig, getTournamentTypeConfig, getParentTeam, getTeamName, isSuccessor } from './Helper'
import { Row, Col } from 'reactstrap'

// const updateRankings = (fr1, fr2) => {
//   fr1.mp += fr2.mp
//   fr1.w += fr2.w
//   fr1.d += fr2.d
//   fr1.l += fr2.l
//   fr1.gf += fr2.gf
//   fr1.ga += fr2.ga
//   fr1.gd += fr2.gd
//   fr1.pts += fr2.pts
// }

// const updateSuccessorRankings = (successor_rankings, all_rankings) => {
//   successor_rankings.final_rankings.forEach((fr) => {
//     const tmp = all_rankings.final_rankings.find((afr) => afr.id === fr.parent_id)
//     if (tmp) {
//       fr.r = tmp.r
//     }
//     if (isSuccessor(fr.id)) {
//       const tmp2 = all_rankings.final_rankings.find((afr) => afr.id === fr.id)
//       if (tmp2) {
//         fr.r = tmp2.r
//       }
//     }
//   })
//   successor_rankings.final_rankings.sort((a, b) => {
//     return a.r > b.r ? 1 : -1
//   })
//   successor_rankings.successors = []
//   let previousRank = 0
//   let tmp_rankings = []
//   successor_rankings.final_rankings.forEach((fr) => {
//     const currentRank = fr.r
//     if (currentRank !== previousRank) {
//       tmp_rankings = []
//       tmp_rankings.push(fr)
//       successor_rankings.successors.push({
//         r: fr.r,
//         name: fr.parent_id ? getTeamName(fr.parent_id) : getTeamName(fr.id),
//         final_rankings: tmp_rankings,
//         ranking_type: 'successorround',
//       })
//     } else {
//       tmp_rankings.push(fr)
//       const successor = successor_rankings.successors.find((s) => s.r === fr.r)
//       successor.name = getTeamName(fr.parent_id ? fr.parent_id : fr.id)
//     }
//     previousRank = fr.r
//   })
// }

// const collectSuccessorRankings = (successor_rankings, fr, parentTeam) => {
//   fr.parent_id = parentTeam.id
//   const tmp2 = successor_rankings.find((sr) => sr.id === fr.id)
//   if (!tmp2) {
//     successor_rankings.push({ ...fr, years: [fr.year] })
//   } else {
//     updateRankings(tmp2, fr)
//     tmp2.years.push(fr.year)
//   }
// }

// const collectRankings = (tournaments) => {
//   let rankingArray = []
//   tournaments &&
//     tournaments.forEach((t) => {
//       t.progress_rankings = null
//       const config = getTournamentConfig(t)
//       let _teams = []
//       let _matches = []
//       let rankings = { teams: _teams, matches: _matches }
//       t.stages &&
//         t.stages.forEach((s) => {
//           if (s.type === 'allocation' || s.type === 'roundrobin' || s.type === 'roundrobinmatchday') {
//             s.bye_teams && s.bye_teams.forEach((t) => _teams.push(t))
//             s.groups &&
//               s.groups.forEach((g) => {
//                 g.teams &&
//                   g.teams.forEach((t) => {
//                     if (!_teams.find((t2) => t.id === t2.id)) {
//                       _teams.push(t)
//                     }
//                   })
//                 g.matches &&
//                   g.matches.forEach((m) => {
//                     _matches.push(m)
//                   })
//                 g.matchdays &&
//                   g.matchdays.forEach((md) => {
//                     md.matches &&
//                       md.matches.forEach((m) => {
//                         _matches.push(m)
//                       })
//                   })
//               })
//           }
//           if (s.type === 'knockout' || s.type === 'knockout2legged' || s.type === 'knockoutmultiple2legged') {
//             s.teams &&
//               s.teams.forEach((t) => {
//                 _teams.push(t)
//               })
//             s.rounds &&
//               s.rounds.forEach((r) => {
//                 r.bye_teams && r.bye_teams.forEach((t) => _teams.push(t))
//                 r.matches &&
//                   r.matches.forEach((m) => {
//                     if (!m.home_bye && !m.away_withdrew && !m.postponed && !m.match_void) {
//                       if (r.round_type === 'secondleg') {
//                         // console.log('m', m)
//                         _matches.push({ ...m, match_type: 'secondleg' })
//                       } else {
//                         _matches.push(m)
//                       }
//                     }
//                   })
//                 r.pairs &&
//                   r.pairs.forEach((p) => {
//                     p.matches &&
//                       p.matches.forEach((m) => {
//                         _matches.push(m)
//                       })
//                   })
//               })
//           }
//         })
//       t.leagues &&
//         t.leagues.forEach((l) => {
//           l.stages &&
//             l.stages.forEach((s) => {
//               if (s.type === 'roundrobinleaguematchday') {
//                 s.groups &&
//                   s.groups.forEach((g) => {
//                     g.teams &&
//                       g.teams.forEach((t) => {
//                         if (!_teams.find((t2) => t.id === t2.id)) {
//                           _teams.push(t)
//                         }
//                       })
//                     g.matchdays &&
//                       g.matchdays.forEach((md) => {
//                         md.matches &&
//                           md.matches.forEach((m) => {
//                             _matches.push(m)
//                           })
//                       })
//                   })
//               } else if (s.type === 'knockout') {
//                 s.rounds &&
//                   s.rounds.forEach((r) => {
//                     r.matches &&
//                       r.matches.forEach((m) => {
//                         if (!m.home_bye && !m.away_withdrew && !m.postponed && !m.match_void) {
//                           _matches.push(m)
//                         }
//                       })
//                   })
//               }
//             })
//         })
//       rankings.teams && rankings.matches && calculateProgressRankings(t, rankings.teams, rankings.matches, config)
//       collectProgressRankings(t, rankings, 18)
//       rankingArray.push(rankings)
//     })

//   let final_rankings = []
//   let successor_rankings = []
//   let allRankings = { final_rankings, ranking_type: 'alltimeround' }
//   let allSuccessorRankings = { final_rankings: successor_rankings, ranking_type: 'alltimeround' }
//   rankingArray.forEach((tou) => {
//     tou.final_rankings &&
//       tou.final_rankings.forEach((fr) => {
//         if (fr) {
//           const parentTeam = getParentTeam(fr.id)
//           const teamId = parentTeam ? parentTeam.id : fr.id
//           const tmp = final_rankings.find((fr2) => teamId === fr2.id)
//           if (!tmp) {
//             if (parentTeam) {
//               final_rankings.push({ ...fr, id: parentTeam.id, children_teams: [{ id: fr.id, year: [fr.year] }] })
//               if (isSuccessor(parentTeam.id)) {
//                 collectSuccessorRankings(successor_rankings, fr, parentTeam)
//               }
//             } else {
//               final_rankings.push(fr)
//             }
//           } else {
//             if (parentTeam) {
//               if (isSuccessor(parentTeam.id)) {
//                 collectSuccessorRankings(successor_rankings, fr, parentTeam)
//               }
//               if (!tmp.children_teams) {
//                 tmp.children_teams = []
//               }
//               const tmp3 = tmp.children_teams.find((ct) => ct.id === fr.id)
//               if (!tmp3) {
//                 tmp.children_teams.push({ id: fr.id, year: [fr.year] })
//               } else {
//                 tmp3.year.push(fr.year)
//               }
//             }
//             updateRankings(tmp, fr)
//           }
//           if (isSuccessor(fr.id)) {
//             let tmp2 = successor_rankings.find((sr) => sr.id === fr.id)
//             if (!tmp2) {
//               successor_rankings.push({
//                 r: fr.r,
//                 id: fr.id,
//                 mp: fr.mp,
//                 w: fr.w,
//                 d: fr.d,
//                 l: fr.l,
//                 gf: fr.gf,
//                 ga: fr.ga,
//                 gd: fr.gd,
//                 pts: fr.pts,
//                 years: [fr.year],
//               })
//             } else {
//               updateRankings(tmp2, fr)
//               tmp2.years.push(fr.year)
//             }
//           }
//         }
//       })
//   })
//   // console.log('allRankings', allRankings)
//   sortGroupRankings(allRankings, 1, null)
//   tournaments.all_rankings = allRankings
//   updateSuccessorRankings(allSuccessorRankings, allRankings)
//   tournaments.successor_rankings = allSuccessorRankings
//   return [allRankings]
// }

const AlltimeStandings = (props) => {
  // const { tournaments, tournamentType } = props
  // const ats = tournaments ? collectRankings(tournaments) : []
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {/* {tournaments && <Rankings rounds={ats} config={{ ...getTournamentTypeConfig(tournamentType), show_successors: tournamentType.show_successors }} />}
      {tournaments &&
        tournamentType.show_successors &&
        tournaments.successor_rankings &&
        tournaments.successor_rankings.successors &&
        tournaments.successor_rankings.successors.length > 0 && (
          <React.Fragment>
            <Row>
              <Col>
                <div className="h2-ff1 margin-top-md">Breakdown of successor teams</div>
              </Col>
            </Row>
            <Rankings rounds={tournaments.successor_rankings.successors} config={getTournamentTypeConfig(tournamentType)} />
          </React.Fragment>
        )} */}
    </React.Fragment>
  )
}

export default AlltimeStandings
