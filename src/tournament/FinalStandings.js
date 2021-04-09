import React from 'react'
// import Rankings from './Rankings'
// import { hasWildCardAdvancement, collectWildCardRankings, getBlankRanking } from './RankingsHelper'
// import {
//   getAllocationStages,
//   getRoundRobinStages,
//   getRoundRobinMdStages,
//   getAllRoundRobinStages,
//   getKnockoutStages,
//   getKnockoutMultiple2LeggedStages,
//   getTournamentConfig,
//   getTournamentTypeConfig,
//   isWinner,
//   isAggregateWinner,
//   isSharedBronze,
//   calculateAggregateScore,
//   calculateAggregateScore2,
//   collectPairMatches,
//   getTeamName,
// } from './Helper'
// import {
//   calculateGroupRankings,
//   calculateProgressRankings,
//   createGroupFinalRankings,
//   sortGroupRankings,
//   calculateKnockoutRankings,
//   isEliminated,
//   isAdvancedNextRound,
//   isAdvancedThirdPlace,
//   findTeam,
// } from './RankingsHelper'
import { Row } from 'reactstrap'

// const eliminateGroupTeams = (tournament, groupStage, group) => {
//   if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
//   if (!group.final_rankings) return
//   if (!tournament.final_rankings) {
//     tournament.final_rankings = {}
//   }
//   if (!tournament.final_rankings.rounds) {
//     tournament.final_rankings.rounds = []
//   }
//   // console.log('groupStage', groupStage)
//   let tmp = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
//   if (!tmp) {
//     tournament.final_rankings.rounds.unshift({ name: groupStage.name, ranking_type: 'round', final_rankings: [] })
//     tmp = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
//   }
//   const config = group.advancement ? group : groupStage
//   const eliminatedTeams = group.final_rankings.filter((t) => t && isEliminated(t, config))
//   eliminatedTeams &&
//     eliminatedTeams.forEach((et) => {
//       const eliminatedTeamProgess = tournament.progress_rankings.teams.find((t) => t.id === et.id)
//       const eliminatedTeamRanking = eliminatedTeamProgess.rankings ? eliminatedTeamProgess.rankings[eliminatedTeamProgess.rankings.length - 1] : {}
//       tmp.final_rankings.push(eliminatedTeamRanking)
//     })
// }

// const advanceGroupTeams = (tournament, groupStage, group) => {
//   if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
//   if (!group.final_rankings) return
//   if (!tournament.advanced_teams) {
//     tournament.advanced_teams = {}
//   }
//   if (!tournament.advanced_teams.rounds) {
//     tournament.advanced_teams.rounds = []
//   }
//   // console.log('groupStage', groupStage)
//   let tmp = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
//   if (!tmp) {
//     tournament.advanced_teams.rounds.unshift({ name: groupStage.next_round, ranking_type: 'round', final_rankings: [] })
//     tmp = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
//   }
//   const config = group.advancement ? group : groupStage
//   const advancedTeams = group.final_rankings.filter((t) => t && isAdvancedNextRound(t, config))
//   advancedTeams &&
//     advancedTeams.forEach((at) => {
//       const advancedTeamProgess = tournament.progress_rankings.teams.find((t) => t.id === at.id)
//       const advancedTeamRanking = advancedTeamProgess.rankings ? advancedTeamProgess.rankings[advancedTeamProgess.rankings.length - 1] : {}
//       tmp.final_rankings.push(advancedTeamRanking)
//     })
//   const advancedThirdPlaceTeams = group.final_rankings.filter((t) => t && isAdvancedThirdPlace(t, groupStage))
//   if (advancedThirdPlaceTeams.length > 0) {
//     tmp = tournament.advanced_teams.rounds.find((r) => r.name === 'Third-place')
//     if (!tmp) {
//       tournament.advanced_teams.rounds.unshift({ name: 'Third-place', ranking_type: 'round', final_rankings: [] })
//       tmp = tournament.advanced_teams.rounds.find((r) => r.name === 'Third-place')
//     }
//     advancedThirdPlaceTeams.forEach((atpt) => {
//       const advancedThirdPlaceTeamProgess = tournament.progress_rankings.teams.find((t) => t.id === atpt.id)
//       const advancedThirdPlaceTeamRanking = advancedThirdPlaceTeamProgess.rankings
//         ? advancedThirdPlaceTeamProgess.rankings[advancedThirdPlaceTeamProgess.rankings.length - 1]
//         : {}
//       tmp.final_rankings.push(advancedThirdPlaceTeamRanking)
//     })
//   }
// }

// const advanceWildCardTeams = (tournament, groupStage) => {
//   const wildCardRankings = hasWildCardAdvancement(groupStage) ? collectWildCardRankings(groupStage) : null
//   if (!wildCardRankings) return
//   groupStage.wild_card = wildCardRankings
//   if (!tournament.final_rankings) return
//   if (!tournament.advanced_teams) return
//   const tmpFinalRankings = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
//   const tmpAdvancedTeams = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
//   if (tmpFinalRankings && tmpAdvancedTeams) {
//     wildCardRankings.final_rankings &&
//       wildCardRankings.final_rankings.forEach((fr, index) => {
//         if (index < groupStage.advancement.teams.wild_card.count) {
//           tmpAdvancedTeams.final_rankings.push(fr)
//         } else {
//           tmpFinalRankings.final_rankings.push(fr)
//         }
//       })
//   }
// }

// const eliminateKnockoutTeams = (tournament, round) => {
//   const exception = tournament.id === 'MOFT1908' && round.name === 'Semi-finals' ? true : false
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   round.matches &&
//     round.matches.forEach((m) => {
//       // console.log('m', m)
//       let finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
//       let nextConsolationRound = findRoundAdvancedTeams(tournament, round.next_consolation_round)
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       if (!isWinner('H', m) && !m.walkover && !m.away_withdrew && !m.match_postponed) {
//         if (!finalStandingRound) {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [home_ranking],
//             exception,
//           })
//           finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
//         } else {
//           const tmp = finalStandingRound.final_rankings.find((fr) => fr.id === home_ranking.id)
//           if (!tmp) {
//             finalStandingRound.final_rankings.push(home_ranking)
//           }
//         }
//         finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== m.away_team)
//         if (round.next_consolation_round) {
//           if (!nextConsolationRound) {
//             tournament.advanced_teams.rounds.push({
//               name: round.next_consolation_round,
//               ranking_type: 'round',
//               final_rankings: [home_ranking],
//               exception,
//             })
//             nextConsolationRound = tournament.advanced_teams.rounds.find((r) => r.name === round.next_consolation_round)
//           } else {
//             nextConsolationRound.final_rankings.push(home_ranking)
//           }
//           nextConsolationRound.final_rankings = nextConsolationRound.final_rankings.filter((fr) => fr.id !== m.away_team)
//         }
//       } else if (m.away_team !== '' && !isWinner('A', m) && !m.walkover && !m.away_withdrew && !m.match_postponed) {
//         if (!finalStandingRound) {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [away_ranking],
//             exception,
//           })
//           finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
//         } else {
//           const tmp = finalStandingRound.final_rankings.find((fr) => fr.id === away_ranking.id)
//           if (!tmp) {
//             finalStandingRound.final_rankings.push(away_ranking)
//           }
//         }
//         finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== m.home_team)
//         if (round.next_consolation_round) {
//           if (!nextConsolationRound) {
//             tournament.advanced_teams.rounds.push({
//               name: round.next_consolation_round,
//               ranking_type: 'round',
//               final_rankings: [away_ranking],
//               exception,
//             })
//             nextConsolationRound = tournament.advanced_teams.rounds.find((r) => r.name === round.next_consolation_round)
//           } else {
//             nextConsolationRound.final_rankings.push(away_ranking)
//           }
//           nextConsolationRound.final_rankings = nextConsolationRound.final_rankings.filter((fr) => fr.id !== m.home_team)
//         }
//       }
//     })
// }

// const eliminateKnockoutTeams2 = (tournament, round) => {
//   const exception = tournament.id === 'MOFT1908' && round.name === 'Semi-finals' ? true : false
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   round.matches &&
//     round.matches.forEach((m) => {
//       // console.log('m', m)
//       let finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
//       let nextConsolationRound = findRoundAdvancedTeams(tournament, round.next_consolation_round)
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       if (!isAggregateWinner('H', m) && !m.walkover && !m.away_withdrew && !m.match_postponed) {
//         if (!finalStandingRound) {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [home_ranking],
//             exception,
//           })
//           finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
//         } else {
//           const tmp = finalStandingRound.final_rankings.find((fr) => fr.id === home_ranking.id)
//           if (!tmp) {
//             finalStandingRound.final_rankings.push(home_ranking)
//           }
//         }
//         finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== m.away_team)
//         if (round.next_consolation_round) {
//           if (!nextConsolationRound) {
//             tournament.advanced_teams.rounds.push({
//               name: round.next_consolation_round,
//               ranking_type: 'round',
//               final_rankings: [home_ranking],
//               exception,
//             })
//             nextConsolationRound = tournament.advanced_teams.rounds.find((r) => r.name === round.next_consolation_round)
//           } else {
//             nextConsolationRound.final_rankings.push(home_ranking)
//           }
//           nextConsolationRound.final_rankings = nextConsolationRound.final_rankings.filter((fr) => fr.id !== m.away_team)
//         }
//       } else if (m.away_team !== '' && !isAggregateWinner('A', m) && !m.walkover && !m.away_withdrew && !m.match_postponed) {
//         if (!finalStandingRound) {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [away_ranking],
//             exception,
//           })
//           finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
//         } else {
//           const tmp = finalStandingRound.final_rankings.find((fr) => fr.id === away_ranking.id)
//           if (!tmp) {
//             finalStandingRound.final_rankings.push(away_ranking)
//           }
//         }
//         finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== m.home_team)
//         if (round.next_consolation_round) {
//           if (!nextConsolationRound) {
//             tournament.advanced_teams.rounds.push({
//               name: round.next_consolation_round,
//               ranking_type: 'round',
//               final_rankings: [away_ranking],
//               exception,
//             })
//             nextConsolationRound = tournament.advanced_teams.rounds.find((r) => r.name === round.next_consolation_round)
//           } else {
//             nextConsolationRound.final_rankings.push(away_ranking)
//           }
//           nextConsolationRound.final_rankings = nextConsolationRound.final_rankings.filter((fr) => fr.id !== m.home_team)
//         }
//       }
//     })
// }

// const advanceKnockoutTeams = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   round.matches &&
//     round.matches.forEach((m) => {
//       const next_round = findRoundAdvancedTeams(tournament, round.next_round)
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       // console.log('m', m)
//       if (isWinner('H', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [home_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking)
//         }
//       } else if (isWinner('A', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [away_ranking] })
//         } else {
//           next_round.final_rankings.push(away_ranking)
//         }
//       } else if (m.match_postponed) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [home_ranking, away_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking, away_ranking)
//         }
//       }
//     })
// }

// const advanceKnockoutTeams2 = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   round.matches &&
//     round.matches.forEach((m) => {
//       const next_round = findRoundAdvancedTeams(tournament, round.next_round)
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       // console.log('m', m)
//       if (isAggregateWinner('H', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [home_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking)
//         }
//       } else if (isAggregateWinner('A', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [away_ranking] })
//         } else {
//           next_round.final_rankings.push(away_ranking)
//         }
//       } else if (m.match_postponed) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [home_ranking, away_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking, away_ranking)
//         }
//       }
//     })
// }

// const advance1stLegTeams = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   round.matches &&
//     round.matches.forEach((m) => {
//       const next_round = findRoundAdvancedTeams(tournament, round.next_round)
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       if (home_ranking && away_ranking) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [home_ranking, away_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking, away_ranking)
//         }
//       }
//     })
// }

// const advanceByeTeams = (tournament, round) => {
//   if (!round.bye_teams) return
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   let next_round = findRoundAdvancedTeams(tournament, round.next_round)
//   if (!next_round) {
//     tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [] })
//     next_round = tournament.advanced_teams.rounds.find((r) => r.name === round.next_round)
//   }
//   next_round &&
//     round.bye_teams.forEach((t) => {
//       const bye_team = advanced_teams.final_rankings.find((fr) => fr.id === t.id)
//       if (bye_team) {
//         next_round.final_rankings.push(bye_team)
//       }
//     })
// }

// const advanceThirdPlaceTeams = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, 'Semi-finals')
//   round.matches &&
//     round.matches.forEach((m) => {
//       const next_round = findRoundAdvancedTeams(tournament, 'Third-place')
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       if (!isWinner('H', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: 'Third-place', ranking_type: 'round', final_rankings: [home_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking)
//         }
//       } else if (!isWinner('A', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: 'Third-place', ranking_type: 'round', final_rankings: [away_ranking] })
//         } else {
//           next_round.final_rankings.push(away_ranking)
//         }
//       }
//     })
// }

// const advanceSilverMedalTeams = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, 'Playoff Second Round')
//   round.matches &&
//     round.matches.forEach((m) => {
//       const next_round = findRoundAdvancedTeams(tournament, 'Silver medal match')
//       const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       if (isWinner('H', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: 'Silver medal match', ranking_type: 'round', final_rankings: [home_ranking] })
//         } else {
//           next_round.final_rankings.push(home_ranking)
//         }
//       } else if (isWinner('A', m)) {
//         if (!next_round) {
//           tournament.advanced_teams.rounds.push({ name: 'Silver medal match', ranking_type: 'round', final_rankings: [away_ranking] })
//         } else {
//           next_round.final_rankings.push(away_ranking)
//         }
//       }
//       const semiFinalists = findRoundAdvancedTeams(tournament, 'Semi-finals')
//       const netherlands = findTeam(semiFinalists.final_rankings, 'NED_U23MNT')
//       findRoundAdvancedTeams(tournament, 'Silver medal match').final_rankings.push(netherlands)
//     })
// }

// const createSilverMedalRankings = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   if (round.matches && advanced_teams) {
//     const m = round.matches[round.matches.length - 1]
//     if (m) {
//       let home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       let away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       const rankWinner = 2
//       const rankLoser = 3
//       if (isWinner('H', m)) {
//         home_ranking.r = rankWinner
//         away_ranking.r = rankLoser
//         tournament.final_rankings.rounds.unshift({
//           name: round.name,
//           ranking_type: 'round',
//           final_rankings: [home_ranking, away_ranking],
//         })
//       } else if (isWinner('A', m)) {
//         home_ranking.r = rankLoser
//         away_ranking.r = rankWinner
//         tournament.final_rankings.rounds.unshift({
//           name: round.name,
//           ranking_type: 'round',
//           final_rankings: [away_ranking, home_ranking],
//         })
//       }
//     }
//   }
//   const semiFinalists = findRoundFinalRanking(tournament, 'Semi-finals')
//   semiFinalists.final_rankings = semiFinalists.final_rankings.filter((fr) => fr.id !== 'NED_U23MNT')
//   semiFinalists.final_rankings[0].r = 4
// }

// const createFinalRankings = (tournament, round) => {
//   const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
//   if (round.matches && advanced_teams) {
//     const m = round.matches[round.matches.length - 1]
//     if (m) {
//       let home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
//       let away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
//       const rankWinner =
//         round.name === 'Final' || round.name === 'Final Second Leg' || round.name === 'Final Playoff'
//           ? 1
//           : round.name === 'Third-place'
//           ? 3
//           : round.name === 'Fifth-place'
//           ? 5
//           : 4
//       const rankLoser =
//         round.name === 'Final' || round.name === 'Final Second Leg' || round.name === 'Final Playoff'
//           ? 2
//           : round.name === 'Third-place'
//           ? 4
//           : round.name === 'Fifth-place'
//           ? 6
//           : 5
//       if (isWinner('H', m)) {
//         home_ranking.r = rankWinner
//         away_ranking.r = rankLoser
//         if (!m.away_disqualified) {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [home_ranking, away_ranking],
//           })
//         } else {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [home_ranking],
//           })
//           tournament.final_rankings.rounds.push({
//             name: 'Disqualified',
//             ranking_type: 'round',
//             final_rankings: [{ ...away_ranking, r: 'DQ' }],
//           })
//         }
//       } else if (isWinner('A', m)) {
//         home_ranking.r = rankLoser
//         away_ranking.r = rankWinner
//         if (round.name === 'Playoff Second Round') {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [home_ranking],
//           })
//         } else {
//           tournament.final_rankings.rounds.unshift({
//             name: round.name,
//             ranking_type: 'round',
//             final_rankings: [away_ranking, home_ranking],
//           })
//         }
//       }
//       if (isSharedBronze(m)) {
//         home_ranking.r = 3
//         away_ranking.r = 3
//         const fr = getTeamName(home_ranking.id) > getTeamName(away_ranking.id) ? [away_ranking, home_ranking] : [home_ranking, away_ranking]
//         tournament.final_rankings.rounds.unshift({
//           name: round.name,
//           ranking_type: 'round',
//           final_rankings: fr,
//         })
//       }
//     }
//   }
// }

// const createFinalRoundRankings = (tournament, groupStage, group) => {
//   if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
//   if (!group.final_rankings) return
//   if (!tournament.final_rankings) {
//     tournament.final_rankings = {}
//   }
//   if (!tournament.final_rankings.rounds) {
//     tournament.final_rankings.rounds = []
//   }
//   tournament.final_rankings.rounds.unshift({ name: groupStage.name, ranking_type: 'round', final_rankings: [] })
//   const finalRound = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
//   group.final_rankings.forEach((fr, index) => {
//     const teamProgess = tournament.progress_rankings.teams.find((t) => t.id === fr.id)
//     const teamRanking = teamProgess.rankings ? teamProgess.rankings[teamProgess.rankings.length - 1] : {}
//     finalRound.final_rankings.push({ ...teamRanking, r: index + 1 })
//   })
// }

// export const findRoundFinalRanking = (tournament, name) => {
//   return tournament.final_rankings && tournament.final_rankings.rounds.find((r) => r.name === name)
// }

// export const findRoundAdvancedTeams = (tournament, name) => {
//   if (!tournament.advanced_teams) return
//   return tournament.advanced_teams.rounds.find((r) => r.name === name)
// }

// const initTournamentRankings = (tournament) => {
//   if (tournament.advanced_teams && tournament.final_rankings) return
//   if (!tournament.advanced_teams) {
//     tournament.advanced_teams = { rounds: [] }
//   }
//   if (!tournament.final_rankings) {
//     tournament.final_rankings = { rounds: [] }
//   }
// }

// const initKnockoutRankings = (tournament, stage) => {
//   const roundName = stage.rounds && stage.rounds.length > 0 ? stage.rounds[0].name : stage.name
//   const _round = tournament.advanced_teams.rounds.find((r) => r.name === roundName)
//   if (_round) return
//   let finalRankings = []
//   stage.teams &&
//     stage.teams.forEach((t) => {
//       finalRankings.push(getBlankRanking(t.id))
//     })
//   tournament.advanced_teams.rounds.push({ name: roundName, ranking_type: 'round', final_rankings: finalRankings })
// }

// const initByeRankings = (tournament, stage) => {
//   if (!stage.bye_teams) return
//   let finalRankings = []
//   stage.bye_teams.forEach((t) => {
//     finalRankings.push(getBlankRanking(t.id))
//   })
//   const _round = tournament.advanced_teams.rounds.find((r) => r.name === stage.name)
//   if (!_round) {
//     tournament.advanced_teams.rounds.push({ name: stage.name, ranking_type: 'round', final_rankings: finalRankings })
//   } else {
//     finalRankings.forEach((fr) => {
//       _round.final_rankings.push(fr)
//     })
//   }
// }

// const collectLeagueGroupTeams = (tournament, league, stage, group) => {
//   if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
//   if (!group.final_rankings) return
//   if (!tournament.final_rankings) {
//     tournament.final_rankings = {}
//   }
//   if (!tournament.final_rankings.rounds) {
//     tournament.final_rankings.rounds = []
//   }
//   if (!league.final_rankings) {
//     league.final_rankings = {}
//   }
//   if (!league.final_rankings.positions) {
//     league.final_rankings.positions = []
//   }
//   group.final_rankings.forEach((gfr) => {
//     const position_name = `${stage.name} Position ${gfr.r}`
//     let tmp = league.final_rankings.positions.find((p) => p.name === position_name)
//     if (!tmp) {
//       league.final_rankings.positions.push({ name: position_name, position: gfr.r, ranking_type: 'round', final_rankings: [gfr] })
//       tmp = league.final_rankings.positions.find((p) => p.name === position_name)
//     } else {
//       tmp.final_rankings.push(gfr)
//     }
//   })
// }

// const isPairComplete = (pair) => {
//   return pair && pair.matches && pair.matches.length === 2 && pair.matches[0].match_type === 'firstleg' && pair.matches[1].match_type === 'secondleg'
// }

// const isFirstLegOnly = (pair) => {
//   return pair && pair.matches && pair.matches.length === 1 && pair.matches[0].match_type === 'firstlegonly'
// }

const FinalStandings = (props) => {
  // const { tournament, tournamentType } = props
  // const config = { ...getTournamentConfig(tournament), ...getTournamentTypeConfig(tournamentType) }
  // const { stages, leagues } = tournament

  // if (leagues) {
  //   leagues.forEach((l, index) => {
  //     if (l.stages) {
  //       const rrlStages = getAllRoundRobinStages(l.stages)
  //       let groupCount = 0
  //       if (rrlStages) {
  //         rrlStages.forEach((s) => {
  //           if (s.groups) {
  //             groupCount = s.groups.length
  //             s.groups.forEach((g) => {
  //               g.matchdays &&
  //                 g.matchdays.forEach((md) => {
  //                   if (!g.matches) {
  //                     g.matches = []
  //                   }
  //                   if (md.matches) {
  //                     g.matches = g.matches.concat(md.matches)
  //                   }
  //                 })
  //               const _config = g.final_standings_excluded ? { ...config, final_standings_excluded: g.final_standings_excluded } : config
  //               g.teams && g.matches && calculateGroupRankings(g.teams, g.teams, g.matches, _config)
  //               createGroupFinalRankings(tournament, g, 6, true)
  //               g.teams && g.matches && calculateProgressRankings(tournament, g.teams, g.matches, config)
  //               collectLeagueGroupTeams(tournament, l, s, g)
  //             })
  //           }
  //         })
  //       }
  //       const league_final_rankings = []
  //       const tournament_final_rankings = []
  //       l.final_rankings &&
  //         l.final_rankings.positions &&
  //         l.final_rankings.positions.forEach((p) => {
  //           sortGroupRankings(p, l.standing_count + (p.position - 1) * groupCount + 1, config)
  //           p.final_rankings.forEach((pfr, index) => {
  //             if (l.name === 'League A' && p.position === 1) {
  //               tournament_final_rankings.push(pfr)
  //             } else {
  //               if (index === 0) {
  //                 pfr.top_divider = true
  //               }
  //               league_final_rankings.push(pfr)
  //             }
  //           })
  //         })
  //       if (tournament_final_rankings.length > 0) {
  //         tournament.advanced_teams = { rounds: [] }
  //         tournament.advanced_teams.rounds.push({ name: 'Semi-finals', ranking_type: 'round', final_rankings: tournament_final_rankings })
  //       }
  //       tournament.final_rankings && tournament.final_rankings.rounds.push({ name: l.name, ranking_type: 'round', final_rankings: league_final_rankings })

  //       const kolStages = getKnockoutStages(l.stages)
  //       kolStages &&
  //         kolStages.forEach((kols) => {
  //           const relegation1stLeg = kols.rounds.find((r) => r.name === 'Relegation First Leg')
  //           if (relegation1stLeg) {
  //             // calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
  //             // createFinalRankings(tournament, final)
  //             // console.log('relegation1stLeg', relegation1stLeg)
  //           }

  //           const semifinals = kols.rounds.find((r) => r.name === 'Semi-finals')
  //           if (semifinals) {
  //             calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals.name), semifinals, config)
  //             eliminateKnockoutTeams(tournament, semifinals)
  //             sortGroupRankings(findRoundFinalRanking(tournament, semifinals.name), parseInt(semifinals.eliminate_count) + 1, null)
  //             advanceThirdPlaceTeams(tournament, semifinals)
  //           }

  //           const thirdPlace = kols.rounds.find((r) => r.name === 'Third-place')
  //           if (thirdPlace) {
  //             calculateKnockoutRankings(findRoundAdvancedTeams(tournament, thirdPlace.name), thirdPlace, config)
  //             createFinalRankings(tournament, thirdPlace)
  //           }

  //           if (semifinals) {
  //             advanceKnockoutTeams(tournament, semifinals)
  //           }

  //           const final = kols.rounds.find((r) => r.name === 'Final')
  //           if (final) {
  //             calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
  //             createFinalRankings(tournament, final)
  //           }
  //         })
  //     }
  //   })
  // }

  // const alloStages = getAllocationStages(stages)
  // alloStages &&
  //   alloStages.forEach((alloStage) => {
  //     alloStage.groups &&
  //       alloStage.groups.forEach((g) => {
  //         g.teams && g.matches && calculateGroupRankings(g.teams, g.teams, g.matches, config)
  //         createGroupFinalRankings(tournament, g, 1, true)
  //         g.teams && g.matches && calculateProgressRankings(tournament, g.teams, g.matches, config)
  //         advanceGroupTeams(tournament, alloStage, g)
  //       })
  //   })

  // const rrStages = getRoundRobinStages(stages)
  // rrStages &&
  //   rrStages.forEach((groupStage) => {
  //     initTournamentRankings(tournament)
  //     initByeRankings(tournament, groupStage)
  //     if (groupStage.bye_teams) {
  //       advanceByeTeams(tournament, groupStage)
  //     }
  //     if (groupStage.groups) {
  //       groupStage.groups.forEach((g) => {
  //         g.teams && g.matches && calculateGroupRankings(g.teams, g.teams, g.matches, config)
  //         createGroupFinalRankings(tournament, g, g.teams ? (groupStage.home_and_away ? (g.teams.length - 1) * 2 : g.teams.length - 1) : 3, true)
  //         g.teams && g.matches && calculateProgressRankings(tournament, g.teams, g.matches, config)
  //         !groupStage.championship_round && eliminateGroupTeams(tournament, groupStage, g)
  //         groupStage.championship_round && createFinalRoundRankings(tournament, groupStage, g)
  //       })
  //       !groupStage.championship_round &&
  //         groupStage.groups.forEach((g) => {
  //           advanceGroupTeams(tournament, groupStage, g)
  //         })
  //       advanceWildCardTeams(tournament, groupStage)
  //       !groupStage.championship_round && sortGroupRankings(findRoundFinalRanking(tournament, groupStage.name), parseInt(groupStage.eliminate_count) + 1, null)
  //     }
  //   })

  // const exception = tournament.id === 'MOFT1908' ? true : false
  // const koStages = getKnockoutStages(stages)
  // koStages &&
  //   koStages.forEach((koStage) => {
  //     if (koStage && koStage.rounds) {
  //       initTournamentRankings(tournament)
  //       initKnockoutRankings(tournament, koStage)
  //       // console.log('koStage', koStage)
  //       if (koStage.type === 'knockout2legged') {
  //         calculateAggregateScore(koStage)
  //       }
  //       const earlyRounds = koStage.rounds.filter(
  //         (r) =>
  //           r.name === 'Preliminary Round' ||
  //           r.name === 'First Round' ||
  //           r.name === 'Round of 16' ||
  //           r.name === 'Quarter-finals' ||
  //           r.name === 'Semi-finals First Leg' ||
  //           r.name === 'Preliminary Semi-finals' ||
  //           r.name === 'Preliminary Final' ||
  //           r.name === 'Preliminary First Leg' ||
  //           r.name === 'Preliminary Second Leg' ||
  //           r.name === 'First Qualifying Round' ||
  //           r.name === 'First Qualifying First Leg' ||
  //           r.name === 'First Qualifying Second Leg' ||
  //           r.name === 'Second Qualifying Round' ||
  //           r.name === 'Second Qualifying First Leg' ||
  //           r.name === 'Second Qualifying Second Leg' ||
  //           r.name === 'Third Qualifying Round' ||
  //           r.name === 'Third Qualifying First Leg' ||
  //           r.name === 'Third Qualifying Second Leg' ||
  //           r.name === 'Play-off Round' ||
  //           r.name === 'Play-off First Leg' ||
  //           r.name === 'Play-off Second Leg',
  //       )
  //       earlyRounds.forEach((round) => {
  //         initByeRankings(tournament, round)
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, round.name), round, config)
  //         if (round.round_type !== 'firstleg') {
  //           eliminateKnockoutTeams(tournament, round)
  //           sortGroupRankings(findRoundFinalRanking(tournament, round.name), parseInt(round.eliminate_count) + 1, null)
  //           advanceKnockoutTeams(tournament, round)
  //           advanceByeTeams(tournament, round)
  //         } else {
  //           advance1stLegTeams(tournament, round)
  //         }
  //       })

  //       if (koStage.consolation_round) {
  //         const consolation = koStage.rounds.find((r) => r.name === 'Consolation First Round')
  //         if (consolation) {
  //           calculateKnockoutRankings(findRoundAdvancedTeams(tournament, consolation.name), consolation, config)
  //           eliminateKnockoutTeams(tournament, consolation)
  //           sortGroupRankings(findRoundFinalRanking(tournament, consolation.name), parseInt(consolation.eliminate_count) + 1, null)
  //           advanceKnockoutTeams(tournament, consolation)
  //         }
  //       }

  //       if (koStage.consolation_round) {
  //         const consolation2 = koStage.rounds.find((r) => r.name === 'Consolation Semi-finals' || r.name === 'Playoff First Round')
  //         if (consolation2) {
  //           calculateKnockoutRankings(findRoundAdvancedTeams(tournament, consolation2.name), consolation2, config)
  //           eliminateKnockoutTeams(tournament, consolation2)
  //           sortGroupRankings(findRoundFinalRanking(tournament, consolation2.name), parseInt(consolation2.eliminate_count) + 1, null)
  //           advanceKnockoutTeams(tournament, consolation2)
  //         }
  //       }

  //       const fifthPlace = koStage.rounds.find((r) => r.name === 'Fifth-place')
  //       if (fifthPlace) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, fifthPlace.name), fifthPlace, config)
  //         createFinalRankings(tournament, fifthPlace)
  //       }

  //       const playoffSecondRound = koStage.rounds.find((r) => r.name === 'Playoff Second Round')
  //       if (playoffSecondRound) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, playoffSecondRound.name), playoffSecondRound, config)
  //         createFinalRankings(tournament, playoffSecondRound)
  //         advanceSilverMedalTeams(tournament, playoffSecondRound)
  //       }

  //       const semifinals = koStage.rounds.find((r) => r.name === 'Semi-finals')
  //       if (semifinals) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals.name), semifinals, config)
  //         eliminateKnockoutTeams(tournament, semifinals)
  //         sortGroupRankings(findRoundFinalRanking(tournament, semifinals.name), parseInt(semifinals.eliminate_count) + 1, null)
  //         advanceThirdPlaceTeams(tournament, semifinals)

  //         if (exception) {
  //           let finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === semifinals.name)
  //           finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== 'NED_U23MNT')
  //           let tmp = finalStandingRound.final_rankings.find((fr) => fr.id === 'FRA_U23MNT')
  //           if (tmp) {
  //             tmp.r = 5
  //           }
  //           finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === 'First round')
  //           const sweden = finalStandingRound.final_rankings.find((fr) => fr.id === 'SWE_U23MNT')
  //           finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== 'SWE_U23MNT')
  //           tmp = finalStandingRound.final_rankings.find((fr) => fr.id === 'FRA-B_U23MNT')
  //           if (tmp) {
  //             tmp.r = 6
  //           }
  //           const thirdPlaceAdvancedRound = tournament.advanced_teams.rounds.find((r) => r.name === 'Third-place')
  //           thirdPlaceAdvancedRound.final_rankings.push(sweden)
  //         }
  //       }

  //       const semifinals2ndLeg = koStage.rounds.find((r) => r.name === 'Semi-finals Second Leg')
  //       if (semifinals2ndLeg) {
  //         calculateAggregateScore(koStage)
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals2ndLeg.name), semifinals2ndLeg, config)
  //         eliminateKnockoutTeams(tournament, semifinals2ndLeg)
  //         sortGroupRankings(findRoundFinalRanking(tournament, semifinals2ndLeg.name), parseInt(semifinals2ndLeg.eliminate_count) + 1, null)
  //       }

  //       const thirdPlace = koStage.rounds.find((r) => r.name === 'Third-place')
  //       if (thirdPlace) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, thirdPlace.name), thirdPlace, config)
  //         createFinalRankings(tournament, thirdPlace)
  //       }

  //       const silverMedal = koStage.rounds.find((r) => r.name === 'Silver medal match')
  //       if (silverMedal) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, silverMedal.name), silverMedal, config)
  //         createSilverMedalRankings(tournament, silverMedal)
  //       }

  //       if (semifinals) {
  //         advanceKnockoutTeams(tournament, semifinals)
  //       }

  //       if (semifinals2ndLeg) {
  //         advanceKnockoutTeams(tournament, semifinals2ndLeg)
  //       }

  //       const final = koStage.rounds.find((r) => r.name === 'Final')
  //       if (final) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
  //         createFinalRankings(tournament, final)
  //       }

  //       const final1stLeg = koStage.rounds.find((r) => r.name === 'Final First Leg')
  //       if (final1stLeg) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final1stLeg.name), final1stLeg, config)
  //         advance1stLegTeams(tournament, final1stLeg)
  //       }

  //       const final2ndLeg = koStage.rounds.find((r) => r.name === 'Final Second Leg')
  //       if (final2ndLeg) {
  //         calculateAggregateScore(koStage)
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final2ndLeg.name), final2ndLeg, config)
  //         if (!final2ndLeg.need_playoff) {
  //           createFinalRankings(tournament, final2ndLeg)
  //         } else {
  //           advance1stLegTeams(tournament, final2ndLeg)
  //         }
  //       }

  //       const finalPlayoffLeg = koStage.rounds.find((r) => r.name === 'Final Playoff')
  //       if (finalPlayoffLeg) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, finalPlayoffLeg.name), finalPlayoffLeg, config)
  //         createFinalRankings(tournament, finalPlayoffLeg)
  //         if (tournament.id === 'COPA1922') {
  //           const at = findRoundAdvancedTeams(tournament, finalPlayoffLeg.name)
  //           const uruguay = at.final_rankings.find((fr) => fr.id === 'URU')
  //           uruguay.r = 3
  //           // console.log('uruguay', uruguay)
  //           const fr = findRoundFinalRanking(tournament, finalPlayoffLeg.name)
  //           fr.final_rankings.push(uruguay)
  //         }
  //       }
  //     }
  //   })

  // const rrmdStages = getRoundRobinMdStages(stages)
  // rrmdStages &&
  //   rrmdStages.forEach((groupStage) => {
  //     // console.log('groupStage', groupStage)
  //     initTournamentRankings(tournament)
  //     initByeRankings(tournament, groupStage)
  //     if (groupStage.bye_teams) {
  //       advanceByeTeams(tournament, groupStage)
  //     }
  //     if (groupStage.groups) {
  //       groupStage.groups.forEach((g) => {
  //         const _matches = []
  //         g.matchdays &&
  //           g.matchdays.forEach((md) => {
  //             md.matches &&
  //               md.matches.forEach((m) => {
  //                 _matches.push(m)
  //               })
  //           })
  //         g.teams && _matches && calculateGroupRankings(g.teams, g.teams, _matches, config)
  //         createGroupFinalRankings(tournament, g, g.teams ? (groupStage.home_and_away ? (g.teams.length - 1) * 2 : g.teams.length - 1) : 3, true)
  //         g.teams && _matches && calculateProgressRankings(tournament, g.teams, _matches, config)
  //         eliminateGroupTeams(tournament, groupStage, g)
  //       })
  //       groupStage.groups.forEach((g) => {
  //         advanceGroupTeams(tournament, groupStage, g)
  //       })
  //       sortGroupRankings(findRoundFinalRanking(tournament, groupStage.name), parseInt(groupStage.eliminate_count) + 1, null)
  //     }
  //   })

  // const koMuliple2LeggedStages = getKnockoutMultiple2LeggedStages(stages)
  // koMuliple2LeggedStages &&
  //   koMuliple2LeggedStages.forEach((s) => {
  //     if (s && s.rounds) {
  //       initTournamentRankings(tournament)
  //       initKnockoutRankings(tournament, s)
  //       s.rounds.forEach((r) => {
  //         calculateAggregateScore2(r)
  //       })
  //       const earlyRounds = s.rounds.filter((r) => r.name === 'Round of 32' || r.name === 'Round of 16' || r.name === 'Quarter-finals')
  //       earlyRounds.forEach((round) => {
  //         initByeRankings(tournament, round)
  //         collectPairMatches(round)
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, round.name), round, config)
  //         round &&
  //           round.pairs &&
  //           round.pairs.forEach((p) => {
  //             if (isPairComplete(p)) {
  //               eliminateKnockoutTeams2(tournament, { ...round, matches: [p.matches[0]] })
  //               advanceKnockoutTeams2(tournament, { ...round, matches: [p.matches[0]] })
  //             }
  //             if (isFirstLegOnly(p)) {
  //               eliminateKnockoutTeams(tournament, { ...round, matches: [p.matches[0]] })
  //               advanceKnockoutTeams(tournament, { ...round, matches: [p.matches[0]] })
  //             }
  //             sortGroupRankings(findRoundFinalRanking(tournament, round.name), parseInt(round.eliminate_count) + 1, null)
  //           })
  //         if (round && round.matches && !round.pairs) {
  //           // console.log('round.matches', round.matches)
  //           eliminateKnockoutTeams(tournament, round)
  //           sortGroupRankings(findRoundFinalRanking(tournament, round.name), parseInt(round.eliminate_count) + 1, null)
  //           advanceKnockoutTeams(tournament, round)
  //         }
  //       })

  //       const semifinals = s.rounds.find((r) => r.name === 'Semi-finals')
  //       if (semifinals) {
  //         collectPairMatches(semifinals)
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals.name), semifinals, config)
  //         semifinals &&
  //           semifinals.pairs &&
  //           semifinals.pairs.forEach((p) => {
  //             // console.log('p', p)
  //             if (isPairComplete(p)) {
  //               eliminateKnockoutTeams2(tournament, { ...semifinals, matches: [p.matches[0]] })
  //               advanceThirdPlaceTeams(tournament, { ...semifinals, matches: [p.matches[0]] })
  //             }
  //             sortGroupRankings(findRoundFinalRanking(tournament, semifinals.name), parseInt(semifinals.eliminate_count) + 1, null)
  //           })
  //         if (semifinals && semifinals.matches && !semifinals.pairs) {
  //           eliminateKnockoutTeams(tournament, semifinals)
  //           sortGroupRankings(findRoundFinalRanking(tournament, semifinals.name), parseInt(semifinals.eliminate_count) + 1, null)
  //           advanceThirdPlaceTeams(tournament, semifinals)
  //         }
  //       }
  //       if (semifinals) {
  //         if (semifinals.matches) {
  //           advanceKnockoutTeams(tournament, semifinals)
  //         } else {
  //           advanceKnockoutTeams2(tournament, semifinals)
  //         }
  //       }

  //       const final = s.rounds.find((r) => r.name === 'Final')
  //       if (final) {
  //         calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
  //         createFinalRankings(tournament, final)
  //       }
  //     }
  //   })

  // const hasThirdPlaceRound = tournament.final_rankings ? tournament.final_rankings.rounds.find((r) => r.name === 'Third-place') !== undefined : false
  // let filteredRounds =
  //   tournament.final_rankings && hasThirdPlaceRound && !exception
  //     ? tournament.final_rankings.rounds.filter((r) => r.name !== 'Semi-finals')
  //     : tournament.final_rankings
  //     ? tournament.final_rankings.rounds
  //     : []
  // if (filteredRounds.find((r) => r.name === 'Consolation First Round' || r.name === 'Consolation Semi-finals' || r.name === 'Playoff First Round')) {
  //   filteredRounds = filteredRounds.filter((r) => r.name !== 'Quarter-finals')
  // }
  // if (filteredRounds.find((r) => r.name === 'Consolation First Round')) {
  //   filteredRounds = filteredRounds.filter((r) => r.name !== 'First round')
  // }
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>FinalStandings
      {/* {filteredRounds.length > 0 && <Rankings config={config} rounds={filteredRounds} />} */}
    </React.Fragment>
  )
}

export default FinalStandings
