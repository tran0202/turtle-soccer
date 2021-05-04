import React from 'react'
import Rankings from './Rankings'
import { isSharedBronze, calculateAggregateScore } from '../matches/MatchHelper'
import { getTeamName } from '../../core/TeamHelper'
import { isWinner, collectPairMatches, collectFirstLegMatches, collectMdMatches } from '../../core/Helper'
import {
  hasWildCardAdvancement,
  collectWildCardRankings,
  calculateGroupRankings,
  calculateProgressRankings,
  createGroupFinalRankings,
  sortGroupRankings,
  calculateKnockoutRankings,
  isEliminated,
  isAdvancedNextRound,
  isAdvancedThirdPlace,
  findTeam,
  getBlankRanking,
  findRoundAdvancedTeams,
  findRoundFinalRankings,
} from './RankingsHelper'
import { Row } from 'reactstrap'
import { isEmpty, isUndefined } from 'lodash'

const isRoundRobinRound = (round) => {
  return round.config.round_type === 'roundrobin' || round.config.round_type === 'allocation' || round.config.round_type === 'roundrobinmatchday'
}

const isRoundRobinLeagueMatchdayRound = (round) => {
  return round.config.round_type === 'roundrobinleaguematchday'
}

const isKnockoutRound = (round) => {
  return round.config.round_type === 'knockout' || round.config.round_type === 'knockout2legged'
}

const hasThirdPlaceRound = (tournament) => {
  return !isUndefined(tournament.final_rankings.find((r) => r.name === 'Third-place'))
}

const prepRoundRankings = (tournament) => {
  if (!tournament) return
  tournament.advanced_teams = []
  tournament.final_rankings = []
  const { stages, leagues } = tournament
  leagues &&
    leagues.forEach((l) => {
      l.stages &&
        l.stages.forEach((s) => {
          if (s.config.type !== 'knockout') {
            s.config.round_type = s.config.type
            s.config = { ...s.config, ...l.config }
            tournament.final_rankings.push({ name: l.details.name, ranking_type: 'round', rankings: [], positions: [], ...s })
          } else {
            s.rounds &&
              s.rounds.forEach((r) => {
                if (r.details.name === 'Relegation play-outs') {
                  tournament.advanced_teams.push({ name: r.details.name, ranking_type: 'round', rankings: [], ...r })
                  tournament.final_rankings.push({ name: r.details.name, ranking_type: 'round', rankings: [], ...r })
                } else {
                  tournament.advanced_teams.unshift({ name: r.details.name, ranking_type: 'round', rankings: [], ...r })
                  tournament.final_rankings.unshift({ name: r.details.name, ranking_type: 'round', rankings: [], ...r })
                }
              })
          }
        })
    })
  stages &&
    stages.forEach((s) => {
      if (s.config.type !== 'knockout') {
        s.config.round_type = s.config.type
        tournament.advanced_teams.unshift({ name: s.details.name, ranking_type: 'round', rankings: [], ...s })
        tournament.final_rankings.unshift({ name: s.details.name, ranking_type: 'round', rankings: [], ...s })
      } else {
        s.rounds &&
          s.rounds.forEach((r) => {
            tournament.advanced_teams.unshift({ name: r.details.name, ranking_type: 'round', rankings: [], ...r })
            tournament.final_rankings.unshift({ name: r.details.name, ranking_type: 'round', rankings: [], ...r })
          })
      }
    })
}

const initKnockoutRankings = (tournament, round) => {
  const at_round = findRoundAdvancedTeams(tournament, round.details.name)
  // console.log('at_round', at_round)
  let rankings = []
  round.teams &&
    round.teams.forEach((t) => {
      rankings.push(getBlankRanking(t.id))
    })
  if (!isEmpty(rankings)) {
    at_round.rankings = at_round.rankings.concat(rankings)
  }
}

const calculateRoundRankings = (tournament, round, config) => {
  calculateAggregateScore(round)
  collectPairMatches(round)
  calculateKnockoutRankings(tournament, round, config)
}

const collectLeaguePositionTeams = (league, group) => {
  if (isEmpty(group.rankings)) return
  group.rankings.forEach((gr) => {
    const position_name = `Position ${gr.r}`
    const leaguePosition = league.positions.find((p) => p.name === position_name)
    if (!leaguePosition) {
      league.positions.push({ name: position_name, position: gr.r, ranking_type: 'round', rankings: [gr] })
    } else {
      leaguePosition.rankings.push(gr)
    }
  })
}

const eliminateRoundTeams = (tournament, round) => {
  collectFirstLegMatches(round)
  eliminateKnockoutTeams(tournament, round)
  const fr_round = findRoundFinalRankings(tournament, round.details.name)
  sortGroupRankings(fr_round, parseInt(fr_round.config.eliminate_count) + 1, null)
}

const eliminateGroupTeams = (tournament, round, group) => {
  if (!tournament.progress_rankings) return
  if (!group.rankings) return
  let fr_round = findRoundFinalRankings(tournament, round.name)
  if (!fr_round) {
    tournament.final_rankings.unshift({ name: round.name, ranking_type: 'round', rankings: [] })
    fr_round = findRoundFinalRankings(tournament, round.name)
  }
  const config = !isEmpty(group.config.advancement) ? { ...round.config, advancement: group.config.advancement } : round.config
  // console.log('group', group)
  const eliminatedTeams = group.rankings.filter((t) => t && isEliminated(t, config))
  eliminatedTeams &&
    eliminatedTeams.forEach((et) => {
      const eliminatedTeamProgess = tournament.progress_rankings.find((t) => t.id === et.id)
      const eliminatedTeamRanking = eliminatedTeamProgess.rankings ? eliminatedTeamProgess.rankings[eliminatedTeamProgess.rankings.length - 1] : {}
      fr_round.rankings.push(eliminatedTeamRanking)
    })
}

const eliminateKnockoutTeams = (tournament, round) => {
  const exception = tournament.id === 'MOFT1908' && round.details.name === 'Semi-finals'
  const at_round = findRoundAdvancedTeams(tournament, round.details.name)
  round.matches &&
    round.matches.forEach((m) => {
      const fr_round = findRoundFinalRankings(tournament, round.details.name)
      let nextConsolationRound = findRoundAdvancedTeams(tournament, round.config.next_consolation_round)
      const home_ranking = findTeam(at_round.rankings, m.home_team)
      const away_ranking = findTeam(at_round.rankings, m.away_team)
      if (!isWinner('H', m) && !m.away_walkover && !m.away_withdrew && !m.match_postponed) {
        const tmp = fr_round.rankings.find((fr) => fr.id === home_ranking.id)
        if (!tmp) {
          fr_round.rankings.push(home_ranking)
        }
        fr_round.rankings = fr_round.rankings.filter((fr) => fr && fr.id !== m.away_team)
        if (round.config.next_consolation_round) {
          if (!nextConsolationRound) {
            tournament.advanced_teams.push({
              name: round.config.next_consolation_round,
              ranking_type: 'round',
              rankings: [home_ranking],
              exception,
            })
            nextConsolationRound = findRoundAdvancedTeams(tournament, round.config.next_consolation_round)
          } else {
            nextConsolationRound.rankings.push(home_ranking)
          }
          nextConsolationRound.rankings = nextConsolationRound.rankings.filter((fr) => fr.id !== m.away_team)
        }
      } else if (m.away_team !== '' && !isWinner('A', m) && !m.home_walkover && !m.away_withdrew && !m.match_postponed) {
        const tmp = fr_round.rankings.find((fr) => fr.id === away_ranking.id)
        if (!tmp) {
          fr_round.rankings.push(away_ranking)
        }
        fr_round.rankings = fr_round.rankings.filter((fr) => fr && fr.id !== m.home_team)
        if (round.config.next_consolation_round) {
          if (!nextConsolationRound) {
            tournament.advanced_teams.push({
              name: round.config.next_consolation_round,
              ranking_type: 'round',
              rankings: [away_ranking],
              exception,
            })
            nextConsolationRound = findRoundAdvancedTeams(tournament, round.config.next_consolation_round)
          } else {
            nextConsolationRound.rankings.push(away_ranking)
          }
          nextConsolationRound.rankings = nextConsolationRound.rankings.filter((fr) => fr.id !== m.home_team)
        }
      }
    })
}

const eliminateAdvanceWildCardTeams = (tournament, round) => {
  const wildCardRankings = hasWildCardAdvancement(round.config) ? collectWildCardRankings(tournament, round) : null
  if (!wildCardRankings) return
  round.wild_card = wildCardRankings
  if (!tournament.final_rankings) return
  if (!tournament.advanced_teams) return
  const tmpFinalRankings = findRoundFinalRankings(tournament, round.details.name)
  const tmpAdvancedTeams = findRoundAdvancedTeams(tournament, round.config.next_round)
  if (tmpFinalRankings && tmpAdvancedTeams) {
    if (tournament.id === 'WOFT2004') {
      const groupG = tmpFinalRankings.groups.find((g) => g.details.name === 'Group G')
      const australia = groupG.rankings.find((r) => r.id === 'AUS_U23WNT')
      // console.log('australia', australia)
      tmpAdvancedTeams.rankings.push(australia)
    }
    wildCardRankings.rankings &&
      wildCardRankings.rankings.forEach((fr, index) => {
        if (index < round.config.advancement.teams.wild_card.count) {
          tmpAdvancedTeams.rankings.push(fr)
        } else {
          tmpFinalRankings.rankings.push(fr)
        }
      })
  }
}

const advanceByeTeams = (tournament, round) => {
  if (!round.bye_teams) return
  let rankings = []
  round.bye_teams.forEach((t) => {
    rankings.push(getBlankRanking(t.id))
  })
  const next_round = findRoundAdvancedTeams(tournament, round.config.next_round)
  rankings.forEach((r) => {
    next_round.rankings.push(r)
  })
}

const advanceGroupTeams = (tournament, round, group) => {
  if (!tournament.progress_rankings) return
  if (!group.rankings) return
  const config = !isEmpty(group.config.advancement) ? { ...round.config, advancement: group.config.advancement } : round.config
  const advancedThirdPlaceTeams = group.rankings.filter((t) => t && isAdvancedThirdPlace(t, config))
  if (advancedThirdPlaceTeams.length > 0) {
    let at_third = findRoundAdvancedTeams(tournament, 'Third-place')
    if (!at_third) {
      tournament.advanced_teams.push({ name: 'Third-place', ranking_type: 'round', rankings: [] })
      at_third = findRoundAdvancedTeams(tournament, 'Third-place')
    }
    advancedThirdPlaceTeams.forEach((atpt) => {
      const advancedThirdPlaceTeamProgess = tournament.progress_rankings.find((t) => t.id === atpt.id)
      const advancedThirdPlaceTeamRanking = advancedThirdPlaceTeamProgess.rankings
        ? advancedThirdPlaceTeamProgess.rankings[advancedThirdPlaceTeamProgess.rankings.length - 1]
        : {}
      at_third.rankings.push(advancedThirdPlaceTeamRanking)
    })
  }
  let at_next_round = findRoundAdvancedTeams(tournament, round.config.next_round)
  if (!at_next_round) {
    tournament.advanced_teams.push({ name: round.config.next_round, ranking_type: 'round', rankings: [] })
    at_next_round = findRoundAdvancedTeams(tournament, round.config.next_round)
  }
  const advancedTeams = group.rankings.filter((t) => t && isAdvancedNextRound(t, config))
  advancedTeams &&
    advancedTeams.forEach((at) => {
      const advancedTeamProgess = tournament.progress_rankings.find((t) => t.id === at.id)
      const advancedTeamRanking = advancedTeamProgess.rankings ? advancedTeamProgess.rankings[advancedTeamProgess.rankings.length - 1] : {}
      at_next_round.rankings.push(advancedTeamRanking)
    })
}

const advanceKnockoutTeams = (tournament, round) => {
  const at_round = findRoundAdvancedTeams(tournament, round.details.name)
  // console.log('at_round', at_round)
  round.matches &&
    round.matches.forEach((m) => {
      const home_ranking = findTeam(at_round.rankings, m.home_team)
      const away_ranking = findTeam(at_round.rankings, m.away_team)
      // console.log('home_ranking', home_ranking)
      const next_round = findRoundAdvancedTeams(tournament, round.config.next_round)
      if (isWinner('H', m)) {
        next_round.rankings.push(home_ranking)
      } else if (isWinner('A', m)) {
        next_round.rankings.push(away_ranking)
      } else if (m.match_postponed) {
        next_round.rankings.push(home_ranking, away_ranking)
      }
    })
}

const advanceThirdPlaceTeams = (tournament, round) => {
  if (round.details.name !== 'Semi-finals' || !hasThirdPlaceRound(tournament)) return
  const at_round = findRoundAdvancedTeams(tournament, 'Semi-finals')
  round.matches &&
    round.matches.forEach((m) => {
      const next_round = findRoundAdvancedTeams(tournament, 'Third-place')
      const home_ranking = findTeam(at_round.rankings, m.home_team)
      const away_ranking = findTeam(at_round.rankings, m.away_team)
      // console.log('next_round', next_round)
      if (!isWinner('H', m)) {
        if (!next_round) {
          tournament.advanced_teams.push({ name: 'Third-place', ranking_type: 'round', rankings: [home_ranking] })
        } else {
          next_round.rankings.push(home_ranking)
        }
      } else if (!isWinner('A', m)) {
        if (!next_round) {
          tournament.advanced_teams.push({ name: 'Third-place', ranking_type: 'round', rankings: [away_ranking] })
        } else {
          next_round.rankings.push(away_ranking)
        }
      }
    })
}

const advanceSilverMedalTeams = (tournament, round) => {
  if (round.details.name !== 'Playoff Second Round') return
  const at_round = findRoundAdvancedTeams(tournament, 'Playoff Second Round')
  const next_round = findRoundAdvancedTeams(tournament, 'Silver medal match')
  round.matches &&
    round.matches.forEach((m) => {
      const home_ranking = findTeam(at_round.rankings, m.home_team)
      const away_ranking = findTeam(at_round.rankings, m.away_team)
      if (isWinner('H', m)) {
        next_round.rankings.push(home_ranking)
      } else if (isWinner('A', m)) {
        next_round.rankings.push(away_ranking)
      }
      const semiFinalists = findRoundAdvancedTeams(tournament, 'Semi-finals')
      const netherlands = findTeam(semiFinalists.rankings, 'NED_U23MNT')
      next_round.rankings.push(netherlands)
    })
}

const processSemifinalMOFT1908Exception = (tournament) => {
  if (tournament.id !== 'MOFT1908') return
  let fr_round = findRoundFinalRankings(tournament, 'Semi-finals')
  fr_round.rankings = fr_round.rankings.filter((fr) => fr.id !== 'NED_U23MNT')
  const france = fr_round.rankings.find((fr) => fr.id === 'FRA_U23MNT')
  if (france) {
    france.r = 5
  }
  fr_round = findRoundFinalRankings(tournament, 'First Round')
  const sweden = fr_round.rankings.find((fr) => fr.id === 'SWE_U23MNT')
  fr_round.rankings = fr_round.rankings.filter((fr) => fr.id !== 'SWE_U23MNT')
  const franceB = fr_round.rankings.find((fr) => fr.id === 'FRA-B_U23MNT')
  if (franceB) {
    franceB.r = 6
  }
  const at_round = findRoundAdvancedTeams(tournament, 'Third-place')
  at_round.rankings.push(sweden)
}

const processFinalPlayoffCOPA1922Exception = (tournament) => {
  if (tournament.id !== 'COPA1922') return
  const at_round = findRoundAdvancedTeams(tournament, 'Final Playoff')
  const uruguay = at_round.rankings.find((fr) => fr.id === 'URU')
  if (uruguay) uruguay.r = 3
  // console.log('uruguay', uruguay)
  const fr_round = findRoundFinalRankings(tournament, 'Final Playoff')
  fr_round.rankings.push(uruguay)
}

const createFinalRoundRankings = (tournament, round, group) => {
  if (!tournament.progress_rankings) return
  if (!group.rankings) return
  const finalRound = findRoundFinalRankings(tournament, round.details.name)
  group.rankings.forEach((r, index) => {
    const teamProgess = tournament.progress_rankings.find((t) => t.id === r.id)
    const teamRanking = teamProgess.rankings ? teamProgess.rankings[teamProgess.rankings.length - 1] : {}
    finalRound.rankings.push({ ...teamRanking, r: index + 1 })
  })
}

const createSilverMedalRankings = (tournament, round) => {
  if (round.details.name !== 'Silver medal match') return
  const at_round = findRoundAdvancedTeams(tournament, round.details.name)
  const fr_round = findRoundFinalRankings(tournament, round.details.name)
  if (round.matches && at_round) {
    const m = round.matches[round.matches.length - 1]
    if (m) {
      let home_ranking = findTeam(at_round.rankings, m.home_team)
      let away_ranking = findTeam(at_round.rankings, m.away_team)
      const rankWinner = 2
      const rankLoser = 3
      if (isWinner('H', m)) {
        home_ranking.r = rankWinner
        away_ranking.r = rankLoser
        fr_round.rankings = [home_ranking, away_ranking]
      } else if (isWinner('A', m)) {
        home_ranking.r = rankLoser
        away_ranking.r = rankWinner
        fr_round.rankings = [away_ranking, home_ranking]
      }
    }
  }
  const semiFinalists = findRoundFinalRankings(tournament, 'Semi-finals')
  semiFinalists.rankings = semiFinalists.rankings.filter((fr) => fr.id !== 'NED_U23MNT')
  semiFinalists.rankings[0].r = 4
}

const createFinalRankings = (tournament, round) => {
  if (
    round.details.name !== 'Final' &&
    round.details.name !== 'Final Playoff' &&
    round.details.name !== 'Third-place' &&
    round.details.name !== 'Playoff Second Round' &&
    round.details.name !== 'Fifth-place'
  )
    return
  // console.log('round', round)
  const at_round = findRoundAdvancedTeams(tournament, round.details.name)
  const fr_round = findRoundFinalRankings(tournament, round.details.name)
  if (round.matches && at_round) {
    const m = round.config.round_type === 'knockout' ? round.matches[round.matches.length - 1] : round.matches.find((m) => m.match_type === 'firstleg')
    if (m) {
      let home_ranking = findTeam(at_round.rankings, m.home_team)
      let away_ranking = findTeam(at_round.rankings, m.away_team)
      const rankWinner =
        round.details.name === 'Final' || round.details.name === 'Final Second Leg' || round.details.name === 'Final Playoff'
          ? 1
          : round.details.name === 'Third-place'
          ? 3
          : round.details.name === 'Fifth-place'
          ? 5
          : 4
      const rankLoser =
        round.details.name === 'Final' || round.details.name === 'Final Second Leg' || round.details.name === 'Final Playoff'
          ? 2
          : round.details.name === 'Third-place'
          ? 4
          : round.details.name === 'Fifth-place'
          ? 6
          : 5
      if (isWinner('H', m)) {
        home_ranking.r = rankWinner
        away_ranking.r = rankLoser
        if (!m.away_disqualified) {
          fr_round.rankings = [home_ranking, away_ranking]
        } else {
          fr_round.rankings = [home_ranking]
          tournament.final_rankings.unshift({
            name: 'Disqualified',
            ranking_type: 'round',
            rankings: [{ ...away_ranking, r: 'DQ' }],
          })
        }
      } else if (isWinner('A', m)) {
        home_ranking.r = rankLoser
        away_ranking.r = rankWinner
        if (round.details.name === 'Playoff Second Round') {
          fr_round.rankings = [home_ranking]
        } else {
          fr_round.rankings = [away_ranking, home_ranking]
        }
      }
      if (isSharedBronze(m)) {
        home_ranking.r = 3
        away_ranking.r = 3
        const fr = getTeamName(home_ranking.id) > getTeamName(away_ranking.id) ? [away_ranking, home_ranking] : [home_ranking, away_ranking]
        fr_round.rankings = fr
      }
    }
  }
}

const createLeagueRankings = (tournament, league, config) => {
  const league_rankings = []
  const semifinals_rankings = []
  league.positions.forEach((p) => {
    sortGroupRankings(p, league.config.standing_count + (p.position - 1) * league.groups.length + 1, config)
    // console.log('p.rankings', p.rankings)
    p.rankings.forEach((pr, index) => {
      if (league.name === 'League A' && p.position === 1) {
        semifinals_rankings.push(pr)
      } else {
        if (index === 0) {
          pr.top_divider = true
        }
        league_rankings.push(pr)
      }
    })
  })
  if (semifinals_rankings.length > 0) {
    const semifinals = findRoundAdvancedTeams(tournament, 'Semi-finals')
    semifinals.rankings = semifinals_rankings
  }
  const leagueRankings = findRoundFinalRankings(tournament, league.name)
  leagueRankings.rankings = league_rankings
}

const filterRoundRankings = (tournament) => {
  tournament.final_rankings.reverse()
  const exception = tournament.id === 'MOFT1908'
  let filteredRounds =
    hasThirdPlaceRound(tournament) && !exception ? tournament.final_rankings.filter((r) => r.name !== 'Semi-finals') : tournament.final_rankings
  if (filteredRounds.find((r) => r.name === 'Consolation First Round' || r.name === 'Consolation Semi-finals' || r.name === 'Playoff First Round')) {
    filteredRounds = filteredRounds.filter((r) => r.name !== 'Quarter-finals')
  }
  if (filteredRounds.find((r) => r.name === 'Consolation First Round')) {
    filteredRounds = filteredRounds.filter((r) => r.name !== 'First Round')
  }
  filteredRounds = filteredRounds.filter((r) => r.name !== 'Group allocation matches')
  return filteredRounds
}

const FinalStandings = (props) => {
  const { state } = props
  const { tournament, competition } = state
  const config = { id: tournament.id, ...competition.config, ...tournament.config }
  prepRoundRankings(tournament)
  tournament &&
    tournament.final_rankings.reverse().forEach((r) => {
      if (isRoundRobinRound(r)) {
        switch (r.name) {
          case 'Group allocation matches':
          case 'First Round':
          case 'Second Round':
          case 'Final Round':
          case 'Final Tournament':
          case 'First Group Stage':
          case 'Second Group Stage':
          case 'Group Stage':
            console.log('r.name', r.name)
            advanceByeTeams(tournament, r)
            if (r.groups) {
              r.groups.forEach((g) => {
                collectMdMatches(g)
                calculateGroupRankings(g.teams, g, config)
                const matchDay = g.teams ? (r.config.home_and_away ? (g.teams.length - 1) * 2 : g.teams.length - 1) : 3
                createGroupFinalRankings(tournament, g, matchDay, true)
                calculateProgressRankings(tournament, g)
                if (r.config.championship_round) {
                  createFinalRoundRankings(tournament, r, g)
                } else {
                  eliminateGroupTeams(tournament, r, g)
                  advanceGroupTeams(tournament, r, g)
                }
              })
              eliminateAdvanceWildCardTeams(tournament, r)
              const fr_round = findRoundFinalRankings(tournament, r.name)
              !r.config.championship_round && sortGroupRankings(fr_round, parseInt(fr_round.config.eliminate_count) + 1, null)
            }
            break
          default:
            console.log('r.name', r.name)
        }
      }
      if (isRoundRobinLeagueMatchdayRound(r)) {
        switch (r.name) {
          case 'League A':
          case 'League B':
          case 'League C':
          case 'League D':
            console.log('r.name', r.name)
            if (r.groups) {
              r.groups.forEach((g) => {
                collectMdMatches(g)
                calculateGroupRankings(g.teams, g, config)
                const matchDay = g.teams ? (r.config.home_and_away ? (g.teams.length - 1) * 2 : g.teams.length - 1) : 3
                createGroupFinalRankings(tournament, g, matchDay, true)
                calculateProgressRankings(tournament, g)
                collectLeaguePositionTeams(r, g)
              })
              createLeagueRankings(tournament, r, config)
              // const fr_round = findRoundFinalRankings(tournament, r.name)
              // !r.config.championship_round && sortGroupRankings(fr_round, parseInt(fr_round.config.eliminate_count) + 1, null)
            }
            break
          default:
            console.log('r.name', r.name)
        }
      }
      if (isKnockoutRound(r)) {
        switch (r.name) {
          case 'Consolation First Round':
          case 'Consolation Semi-finals':
          case 'Playoff First Round':
          case 'Preliminary Round':
          case 'Preliminary Semi-finals':
          case 'Preliminary Final':
          case 'First Qualifying Round':
          case 'Second Qualifying Round':
          case 'Third Qualifying Round':
          case 'Play-off Round':
          case 'First Round':
          case 'Second Round':
          case 'Round of 32':
          case 'Round of 16':
          case 'Quarter-finals':
            console.log('r.name', r.name)
            advanceByeTeams(tournament, r)
            initKnockoutRankings(tournament, r)
            calculateRoundRankings(tournament, r, config)
            eliminateRoundTeams(tournament, r)
            advanceKnockoutTeams(tournament, r)
            break
          case 'Semi-finals':
            console.log('r.name', r.name)
            initKnockoutRankings(tournament, r)
            calculateRoundRankings(tournament, r, config)
            eliminateRoundTeams(tournament, r)
            advanceThirdPlaceTeams(tournament, r)
            advanceKnockoutTeams(tournament, r)
            processSemifinalMOFT1908Exception(tournament)
            break
          case 'Playoff Second Round':
            console.log('r.name', r.name)
            calculateRoundRankings(tournament, r, config)
            createFinalRankings(tournament, r)
            advanceSilverMedalTeams(tournament, r)
            break
          case 'Silver medal match':
            console.log('r.name', r.name)
            calculateRoundRankings(tournament, r, config)
            createSilverMedalRankings(tournament, r)
            break
          case 'Fifth-place':
          case 'Third-place':
          case 'Final':
          case 'Final Playoff':
            console.log('r.name', r.name)
            calculateRoundRankings(tournament, r, config)
            createFinalRankings(tournament, r)
            processFinalPlayoffCOPA1922Exception(tournament)
            break
          default:
            console.log('r.name', r.name)
        }
      }
    })
  const fr = filterRoundRankings(tournament)
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {!isEmpty(fr) && <Rankings rounds={fr} config={config} />}
    </React.Fragment>
  )
}

export default FinalStandings
