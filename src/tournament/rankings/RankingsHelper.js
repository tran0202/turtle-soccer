import { getTeamName } from '../../core/TeamHelper'
import { hasGroupPlayoff } from '../matches/MatchHelper'
import { isEmpty, isUndefined } from 'lodash'

export const findTeam = (teamArray, id) => {
  if (isEmpty(teamArray)) return {}
  const team = teamArray.find((t) => t && t.id === id)
  return isUndefined(team) ? {} : team
}

export const isGoalRatioTiebreaker = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('goalratio') !== -1) != null
}

export const isGroupPlayoffTiebreaker = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('groupplayoff') !== -1) != null
}

export const isLotGroupPlayoffTiebreaker = (config) => {
  // console.log('config', config)
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('lotgroupplayoff') !== -1) != null
}

export const isPointsLotTiebreaker = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('pointslot') !== -1) != null
}

export const isHead2HeadBeforeGoalDifference = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return (
    tiebreakers.findIndex((tb) => tb === 'head2head') <
    tiebreakers.findIndex((tb) => tb === 'goaldifferenceandgoalscored' || tb === 'goaldifferencegoalscoredwins')
  )
}

const accumulateRanking2 = (team, match, config) => {
  if (!match || match.home_score === null || match.away_score === null || match.home_extra_score === null || match.away_extra_score === null) return
  const side = match.home_team === team.id ? 'home' : 'away'
  const hs = parseInt(match.home_score) + parseInt(match.home_extra_score)
  const as = parseInt(match.away_score) + parseInt(match.away_extra_score)
  team.mp++
  team.md++
  if (hs > as) {
    if (side === 'home') {
      team.w++
      team.gf += hs
      team.ga += as
      team.pts += config.points_for_win
    } else {
      team.l++
      team.gf += as
      team.ga += hs
    }
  } else if (hs === as) {
    team.d++
    team.gf += hs
    team.ga += hs
    team.pts++
  } else {
    if (side === 'home') {
      team.l++
      team.gf += hs
      team.ga += as
    } else {
      team.w++
      team.gf += as
      team.ga += hs
      team.pts += config.points_for_win
    }
  }
  team.gd = team.gf - team.ga
  team.gr = isGoalRatioTiebreaker(config) && team.ga !== 0 ? team.gf / team.ga : null
  if (side === 'home') {
    if (match.home_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + match.home_fair_pts
    }
  } else {
    if (match.away_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + match.away_fair_pts
    }
  }
  team.h2hm && team.h2hm.push(match)
}

const accumulateRanking = (team, match, config) => {
  if (!team) return
  if (!isMatchFinal(match)) return
  if (
    match.home_walkover ||
    match.home_bye ||
    match.home_awarded_score_not_counted ||
    match.match_postponed ||
    match.match_void ||
    match.match_cancelled ||
    (match.notes && match.notes.awarded)
  )
    return
  if ((match.match_type === 'secondleg' || config.match_type === 'secondleg') && match.home_extra_score != null && match.away_extra_score != null) {
    return accumulateRanking2(team, match, config)
  }
  const side = match.home_team === team.id ? 'home' : 'away'
  team.mp++
  team.md++
  if (parseInt(match.home_score) > parseInt(match.away_score)) {
    if (side === 'home') {
      team.w++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
      team.pts += config.points_for_win
    } else {
      team.l++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
    }
  } else if (parseInt(match.home_score) === parseInt(match.away_score)) {
    if (side === 'home') {
      if (match.home_extra_score != null && match.away_extra_score != null) {
        if (parseInt(match.home_extra_score) > parseInt(match.away_extra_score)) {
          team.w++
          team.gf += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.ga += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.pts += config.points_for_win
        } else if (parseInt(match.home_extra_score) === parseInt(match.away_extra_score)) {
          team.d++
          team.gf += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.ga += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.pts++
        } else {
          team.l++
          team.gf += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.ga += parseInt(match.away_score) + parseInt(match.away_extra_score)
        }
      } else {
        if (match.home_awarded_adjust) {
          team.w++
          team.pts += config.points_for_win
        } else {
          team.d++
          team.pts++
        }
        team.gf += parseInt(match.home_score)
        team.ga += parseInt(match.away_score)
      }
    } else {
      if (match.home_extra_score != null && match.away_extra_score != null) {
        if (parseInt(match.home_extra_score) > parseInt(match.away_extra_score)) {
          team.l++
          team.gf += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.ga += parseInt(match.home_score) + parseInt(match.home_extra_score)
        } else if (parseInt(match.home_extra_score) === parseInt(match.away_extra_score)) {
          team.d++
          team.gf += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.ga += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.pts++
        } else {
          team.w++
          team.gf += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.ga += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.pts += config.points_for_win
        }
      } else {
        if (match.home_awarded_adjust) {
          team.l++
        } else {
          team.d++
          team.pts++
        }
        team.gf += parseInt(match.away_score)
        team.ga += parseInt(match.home_score)
      }
    }
  } else {
    if (side === 'home') {
      team.l++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
    } else {
      team.w++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
      team.pts += config.points_for_win
    }
  }
  team.gd = team.gf - team.ga
  team.gr = isGoalRatioTiebreaker(config) && team.ga !== 0 ? team.gf / team.ga : null
  if (side === 'home') {
    if (match.home_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + match.home_fair_pts
    }
  } else {
    if (match.away_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + match.away_fair_pts
    }
  }
  const newH2h = []
  team.h2hm && team.h2hm.forEach((m) => newH2h.push(m))
  newH2h.push(match)
  team.h2hm = newH2h
}

export const getBlankRanking = (teamId) => {
  return { id: teamId, md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, gr: null, pts: 0, fp: null, h2hm: [] }
}

export const getBlankOppRanking = (teamId, oppid) => {
  return { id: teamId, oppid: oppid, md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, gr: null, pts: 0, fp: null, h2hm: [] }
}

const findLastTeamRanking = (teams, teamId) => {
  const team = teams.find((t) => t.id === teamId)
  if (!team) {
    teams.push({ id: teamId, rankings: [] })
    return getBlankRanking(teamId)
  }
  if (!team.rankings) {
    team.rankings = []
    return getBlankRanking(teamId)
  }
  return team.rankings[team.rankings.length - 1]
}

const calculateTeamRanking = (container, team, match, config) => {
  if (!team) return
  if (!container) return
  if (!isMatchFinal(match)) return
  const lr = findLastTeamRanking(container, team.id)
  const newRanking = { ...lr, year: config.year }
  accumulateRanking(newRanking, match, config)
  const _team = container.find((t) => t.id === team.id)
  _team.rankings.push(newRanking)
}

const findH2hRanking = (teams, teamId, oppid) => {
  const team = teams.find((t) => t.id === teamId)
  if (!team) {
    teams.push({ id: teamId, h2h_rankings: [] })
    return getBlankOppRanking(teamId, oppid)
  }
  if (!team.h2h_rankings) {
    team.h2h_rankings = []
    return getBlankOppRanking(teamId, oppid)
  }
  const hri = team.h2h_rankings.findIndex((hr) => hr.id === teamId && hr.oppid === oppid)
  if (hri === -1) {
    return getBlankOppRanking(teamId, oppid)
  } else {
    const hra = team.h2h_rankings.splice(hri, 1)
    return hra[0]
  }
}

const calculateH2hRanking = (container, team, match, config) => {
  if (!team) return
  if (!container) return
  const oppid = match.home_team === team.id ? match.away_team : match.home_team
  const hr = findH2hRanking(container, team.id, oppid)
  const newRanking = match.away_team === team.id ? { ...hr, year: config.year, ag: match.away_score } : { ...hr, year: config.year }
  accumulateRanking(newRanking, match, config)

  const _team = container.find((t) => t.id === team.id)
  _team.h2h_rankings.push(newRanking)
}

export const calculateGroupRankings = (container, group, config) => {
  const { teams, matches } = group
  if (isEmpty(teams)) return
  matches &&
    matches.forEach((m) => {
      const hr = findTeam(teams, m.home_team)
      const ar = findTeam(teams, m.away_team)
      if (!m.walkover && !m.away_withdrew && !m.match_postponed && !m.match_cancelled) {
        calculateTeamRanking(container, hr, m, config)
        calculateTeamRanking(container, ar, m, config)
        calculateH2hRanking(container, hr, m, config)
        calculateH2hRanking(container, ar, m, config)
      }
    })
}

export const calculateProgressRankings = (tournament, group) => {
  if (!tournament.progress_rankings) {
    tournament.progress_rankings = []
  }
  const config = { ...tournament.config, ...tournament.details }
  calculateGroupRankings(tournament.progress_rankings, group, config)
}

export const calculateKnockoutRankings = (tournament, round, config) => {
  const at_round = findRoundAdvancedTeams(tournament, round.details.name)
  round.matches &&
    round.matches.forEach((m) => {
      const home_rankings = findTeam(at_round.rankings, m.home_team)
      const away_rankings = findTeam(at_round.rankings, m.away_team)
      accumulateRanking(home_rankings, m, config)
      accumulateRanking(away_rankings, m, config)
    })
}

export const findRoundAdvancedTeams = (tournament, name) => {
  if (!tournament.advanced_teams) return
  return tournament.advanced_teams.find((r) => r.name === name)
}

export const findRoundFinalRankings = (tournament, name) => {
  if (!tournament.final_rankings) return
  return tournament.final_rankings.find((r) => r.name === name)
}

const findHeadtoHeadMatch = (a, b, group_playoff) => {
  if (isEmpty(a.h2hm)) return {}
  const cond = (m) => {
    return (m.home_team === a.id && m.away_team === b.id) || (m.home_team === b.id && m.away_team === a.id)
  }
  const cond2 = (m) => {
    return group_playoff ? m.group_playoff : !m.group_playoff
  }
  return a.h2hm.filter((m) => cond(m) && cond2(m))
}

const drawingLots = (a, b) => {
  // Italia 1990
  if (a.id === 'NED' && b.id === 'IRL') {
    a.draw_lot_notes = 'Netherlands took 3rd place after finished identical records (points, goal difference and goal forward) with Republic of Ireland.'
    b.draw_lot_notes = 'Republic of Ireland took 2nd place after finished identical records (points, goal difference and goal forward) with Netherlands.'
    return 1
  }
  // Mexico 1970
  if (a.id === 'URS' && b.id === 'MEX') {
    a.draw_lot_notes = 'Soviet Union took 1st place after finished level (points and goal difference) with Mexico.'
    b.draw_lot_notes = 'Mexico took 2nd place after finished level (points and goal difference) with Soviet Union.'
    return -1
  }
  // Switzerland 1954
  if (a.id === 'YUG-1945-1992' && b.id === 'BRA') {
    a.draw_lot_notes = 'Yugoslavia took 2nd place after finished level points with Brazil.'
    b.draw_lot_notes = 'Brazil took 1st place after finished level points with Yugoslavia.'
    return 1
  }
  if (a.id === 'AUT' && b.id === 'URU') {
    a.draw_lot_notes = 'Austria took 2nd place after finished level points with Uruguay.'
    b.draw_lot_notes = 'Uruguay took 1st place after finished level points with Austria.'
    return 1
  }
  // Gold Cup 2000
  if (a.id === 'KOR' && b.id === 'CAN') {
    a.draw_lot_notes = 'Korea Republic took 3rd place after finished identical records (points, goal difference and goal forward) with Canada.'
    b.draw_lot_notes = 'Canada took 2nd place after finished identical records (points, goal difference and goal forward) with Korea Republic.'
    return 1
  }
  // AFCON 2015
  if (a.id === 'MLI' && b.id === 'GUI') {
    a.draw_lot_notes = 'Mali took 3rd place after tying with Guinea on head-to-head match, overall goal difference and overall goal forward.'
    b.draw_lot_notes = 'Guinea took 2nd place after tying with Mali on head-to-head match, overall goal difference and overall goal forward.'
    return 1
  }
  // AFCON 1988
  if (a.id === 'ALG' && b.id === 'CIV') {
    a.draw_lot_notes = 'Algeria took 2nd place after finished identical records (points, goal difference and goal forward) with Ivory Coast.'
    b.draw_lot_notes = 'Ivory Coast took 3rd place after finished identical records (points, goal difference and goal forward) with Algeria.'
    return -1
  }
  // AFCON 1965
  if (a.id === 'SEN' && b.id === 'TUN') {
    a.draw_lot_notes = 'Senegal took 2nd place after finished level points with Tunisia.'
    b.draw_lot_notes = 'Tunisia took 1st place after finished level points with Senegal.'
    return 1
  }
  return 0
}

const compareFairPoints = (a, b) => {
  if (!a.fp || !b.fp) return drawingLots(a, b)
  // console.log('a', a)
  // console.log('b', b)
  if (a.fp > b.fp) {
    a.fp_notes = `${getTeamName(a.id)} ${a.fp}`
    b.fp_notes = `${getTeamName(b.id)} ${b.fp}`
    return -1
  } else if (a.fp < b.fp) {
    a.fp_notes = `${getTeamName(a.id)} ${a.fp}`
    b.fp_notes = `${getTeamName(b.id)} ${b.fp}`
    return 1
  } else {
    return drawingLots(a, b)
  }
}

const matchResult = (id, m) => {
  if (m.home_team === id) {
    if (m.home_score > m.away_score) {
      return -1
    } else if (m.home_score < m.away_score) {
      return 1
    } else {
      if (m.home_extra_score > m.away_extra_score) {
        return -1
      } else if (m.home_extra_score < m.away_extra_score) {
        return 1
      } else {
        return 0
      }
    }
  } else if (m.away_team === id) {
    if (m.home_score > m.away_score) {
      return 1
    } else if (m.home_score < m.away_score) {
      return -1
    } else {
      if (m.home_extra_score > m.away_extra_score) {
        return 1
      } else if (m.home_extra_score < m.away_extra_score) {
        return -1
      } else {
        return 0
      }
    }
  }
}

const saveDrawTeams = (a, b) => {
  if (!a.draws) {
    a.draws = []
    a.draws.push(b.id)
  } else {
    const tmp = a.draws.find((x) => x === b.id)
    if (tmp === undefined) {
      a.draws.push(b.id)
    }
  }
}

const saveDrawBothTeams = (group, a, b) => {
  saveDrawTeams(a, b)
  saveDrawTeams(b, a)
}

const createH2hNotes = (h2hMatch, a, b, drawFunction) => {
  const show_home_score = h2hMatch.home_extra_score != null ? parseInt(h2hMatch.home_score) + parseInt(h2hMatch.home_extra_score) : h2hMatch.home_score
  const show_away_score = h2hMatch.away_extra_score != null ? parseInt(h2hMatch.away_score) + parseInt(h2hMatch.away_extra_score) : h2hMatch.away_score
  const h2hResult = matchResult(a.id, h2hMatch)
  if (h2hResult === 1) {
    if (a.id === h2hMatch.home_team) {
      a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)}`
    } else {
      a.h2h_notes = `${getTeamName(a.id)} ${show_away_score}-${show_home_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_home_score}-${show_away_score} ${getTeamName(a.id)}`
    }
    a.group_playoff = h2hMatch.group_playoff
    b.group_playoff = h2hMatch.group_playoff
    return 1
  } else if (h2hResult === -1) {
    if (a.id === h2hMatch.home_team) {
      a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)}`
    } else {
      a.h2h_notes = `${getTeamName(a.id)} ${show_away_score}-${show_home_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_home_score}-${show_away_score} ${getTeamName(a.id)}`
    }
    a.group_playoff = h2hMatch.group_playoff
    b.group_playoff = h2hMatch.group_playoff
    return -1
  } else {
    if (h2hMatch.tie_last_match) {
      a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)} >>> Penalties after last game: ${getTeamName(a.id)} ${
        h2hMatch.home_penalty_score
      }-${h2hMatch.away_penalty_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)} >>> Penalties after last game: ${getTeamName(b.id)} ${
        h2hMatch.away_penalty_score
      }-${h2hMatch.home_penalty_score} ${getTeamName(a.id)}`
      return h2hMatch.home_penalty_score > h2hMatch.away_penalty_score ? -1 : 1
    }
    a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)}`
    b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)}`
    return drawFunction()
  }
}

const createHomeAwayH2hNotes = (a, b, drawFunction) => {
  if (!a.h2h_rankings || !b.h2h_rankings) return drawFunction()
  const a_ranking = a.h2h_rankings.find((hr) => hr.id === a.id && hr.oppid === b.id)
  const b_ranking = b.h2h_rankings.find((hr) => hr.id === b.id && hr.oppid === a.id)
  if (a_ranking === undefined || b_ranking === undefined) return drawFunction()
  if (a_ranking.pts > b_ranking.pts) {
    a.h2h_notes = `Points >>> ${getTeamName(a.id)} ${a_ranking.pts} | ${getTeamName(b.id)} ${b_ranking.pts}`
    b.h2h_notes = `Points >>> ${getTeamName(b.id)} ${b_ranking.pts} | ${getTeamName(a.id)} ${a_ranking.pts}`
    return -1
  } else if (a_ranking.pts < b_ranking.pts) {
    a.h2h_notes = `Points >>> ${getTeamName(a.id)} ${a_ranking.pts} | ${getTeamName(b.id)} ${b_ranking.pts}`
    b.h2h_notes = `Points >>> ${getTeamName(b.id)} ${b_ranking.pts} | ${getTeamName(a.id)} ${a_ranking.pts}`
    return 1
  } else {
    if (a_ranking.gd > b_ranking.gd) {
      a.h2h_notes = `Tied on points (${a_ranking.pts}). Goal Difference >>> ${getTeamName(a.id)} ${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd} | ${getTeamName(
        b.id,
      )} ${b_ranking.gd > 0 ? '+' : ''}${b_ranking.gd}`
      b.h2h_notes = `Tied on points (${a_ranking.pts}). Goal Difference >>> ${getTeamName(b.id)} ${b_ranking.gd > 0 ? '+' : ''}${b_ranking.gd} | ${getTeamName(
        a.id,
      )} ${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd}`
      return -1
    } else if (a_ranking.gd < b_ranking.gd) {
      a.h2h_notes = `Tied on points (${a_ranking.pts}). Goal Difference >>> ${getTeamName(a.id)} ${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd} | ${getTeamName(
        b.id,
      )} ${b_ranking.gd > 0 ? '+' : ''}${b_ranking.gd}`
      b.h2h_notes = `Tied on points (${a_ranking.pts}). Goal Difference >>> ${getTeamName(b.id)} ${b_ranking.gd > 0 ? '+' : ''}${b_ranking.gd} | ${getTeamName(
        a.id,
      )} ${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd}`
      return 1
    } else {
      if (a_ranking.ag > b_ranking.ag) {
        a.h2h_notes = `Tied on points (${a_ranking.pts}) and goal difference (${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd}). Away goals >>> ${getTeamName(
          a.id,
        )} ${a_ranking.ag} | ${getTeamName(b.id)} ${b_ranking.ag}`
        b.h2h_notes = `Tied on points (${a_ranking.pts}) and goal difference (${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd}). Away goals >>> ${getTeamName(
          b.id,
        )} ${b_ranking.ag} | ${getTeamName(a.id)} ${a_ranking.ag}`
        return -1
      } else if (a_ranking.ag < b_ranking.ag) {
        a.h2h_notes = `Tied on points (${a_ranking.pts}) and goal difference (${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd}). Away goals >>> ${getTeamName(
          a.id,
        )} ${a_ranking.ag} | ${getTeamName(b.id)} ${b_ranking.ag}`
        b.h2h_notes = `Tied on points (${a_ranking.pts}) and goal difference (${a_ranking.gd > 0 ? '+' : ''}${a_ranking.gd}). Away goals >>> ${getTeamName(
          b.id,
        )} ${b_ranking.ag} | ${getTeamName(a.id)} ${a_ranking.ag}`
        return 1
      } else {
        a.h2h_notes = `Tied on head-to-head results`
        b.h2h_notes = `Tied on head-to-head results`
        return drawFunction()
      }
    }
  }
}

const compareH2h = (a, b, group_playoff, drawFunction) => {
  const found = findHeadtoHeadMatch(a, b, group_playoff)
  // console.log('found', found)
  if (found.length === 1) {
    const h2hMatch = found[0]
    return createH2hNotes(h2hMatch, a, b, drawFunction)
  } else {
    return createHomeAwayH2hNotes(a, b, drawFunction)
  }
}

const compareGoalForward = (a, b, savingNotes, drawFunction) => {
  const tmpA = `Overall goals >>> ${getTeamName(a.id)} ${a.gf}`
  const tmpB = `Overall goals >>> ${getTeamName(b.id)} ${b.gf}`
  const saveNotes = () => {
    if (savingNotes) {
      a.h2h_notes = a.h2h_notes ? `${a.h2h_notes} ${tmpA}` : null
      b.h2h_notes = b.h2h_notes ? `${b.h2h_notes} ${tmpB}` : null
    }
  }
  if (a.gf > b.gf) {
    saveNotes()
    return -1
  } else if (a.gf < b.gf) {
    saveNotes()
    return 1
  } else {
    return drawFunction()
  }
}

const compareGoalDifference = (a, b, savingNotes, drawFunction) => {
  const tmpA = `Overall goal difference >>> ${getTeamName(a.id)} ${a.gd > 0 ? '+' : ''}${a.gd}`
  const tmpB = `Overall goal difference >>> ${getTeamName(b.id)} ${b.gd > 0 ? '+' : ''}${b.gd}`
  const saveNotes = () => {
    if (savingNotes) {
      a.h2h_notes = a.h2h_notes ? `${a.h2h_notes}. ${tmpA}` : null
      b.h2h_notes = b.h2h_notes ? `${b.h2h_notes}. ${tmpB}` : null
    }
  }
  if (a.gd > b.gd) {
    saveNotes()
    return -1
  } else if (a.gd < b.gd) {
    saveNotes()
    return 1
  } else {
    if (savingNotes) {
      a.h2h_notes = a.h2h_notes ? `${a.h2h_notes} and tied on overall goal difference (${a.gd > 0 ? '+' : ''}${a.gd}).` : null
      b.h2h_notes = b.h2h_notes ? `${b.h2h_notes} and tied on overall goal difference (${b.gd > 0 ? '+' : ''}${b.gd}).` : null
    }
    return drawFunction()
  }
}

const comparePoints = (a, b, drawFunction) => {
  if (a.pts > b.pts) {
    return -1
  } else if (a.pts < b.pts) {
    return 1
  } else {
    return drawFunction()
  }
}

export const updateDrawPool = (group, a, b) => {
  if (!group) return
  if (!group.draw_pools) {
    group.draw_pools = []
  }
  const pool = group.draw_pools.find((p) => p.pts === a.pts)
  if (pool === undefined) {
    group.draw_pools.push({ pts: a.pts, teams: [{ id: a.id }, { id: b.id }], matches: findHeadtoHeadMatch(a, b, false) })
  } else {
    const newTeamA = pool.teams.find((t) => t.id === a.id)
    if (newTeamA === undefined) {
      pool.teams.push({ id: a.id })
    }
    const newTeamB = pool.teams.find((t) => t.id === b.id)
    if (newTeamB === undefined) {
      pool.teams.push({ id: b.id })
    }
    const newMatch = pool.matches.find((m) => (m.home_team === a.id && m.away_team === b.id) || (m.home_team === b.id && m.away_team === a.id))
    if (newMatch === undefined) {
      const found = findHeadtoHeadMatch(a, b, false)
      if (!isEmpty(found)) {
        pool.matches.push(found[0])
      }
    }
  }
}

export const updateH2h = (group, a, b) => {
  if (!group || !group.rankings || !group.h2h_rankings) return
  group.rankings.forEach((fr) => {
    const hra = group.h2h_rankings.filter((hr) => hr.id === fr.id)
    fr.h2h_rankings = []
    hra.forEach((hr) => {
      fr.h2h_rankings.push(hr)
    })
  })
}

export const sortDrawPoolRankings = (pool) => {
  if (!pool || !pool.rankings) return
  pool.rankings.sort((a, b) => {
    if (a.pts > b.pts) {
      return -1
    } else if (a.pts < b.pts) {
      return 1
    } else {
      if (a.gd > b.gd) {
        return -1
      } else if (a.gd < b.gd) {
        return 1
      } else {
        if (a.gf > b.gf) {
          return -1
        } else if (a.gf < b.gf) {
          return 1
        }
        return 0
      }
    }
  })
}

export const createDrawPools = (group, startingIndex, config) => {
  if (!group || !group.rankings) return
  group.rankings.forEach((fr) => {
    if (!group.draw_pools) {
      group.draw_pools = []
    }
    let _dp = group.draw_pools.find((dp) => dp.pts === fr.pts)
    if (_dp === undefined) {
      group.draw_pools.push({ pts: fr.pts, teams: [{ id: fr.id }] })
      _dp = group.draw_pools.find((dp) => dp.pts === fr.pts)
    } else {
      const _t = _dp.teams.find((t) => t.id === fr.id)
      if (_t === undefined) {
        _dp.teams.push({ id: fr.id })
      }
      _dp.teams.forEach((t) => {
        if (t.id !== fr.id) {
          const newMatch = group.matches.find((m) => (m.home_team === t.id && m.away_team === fr.id) || (m.home_team === fr.id && m.away_team === t.id))
          if (!_dp.matches) {
            _dp.matches = []
          }
          _dp.matches.push(newMatch)
        }
      })
    }
  })
  group.draw_pools &&
    group.draw_pools.sort((a, b) => {
      if (a.pts > b.pts) {
        return -1
      } else if (a.pts < b.pts) {
        return 1
      } else {
        return 0
      }
    })
  group.draw_pools &&
    group.draw_pools.forEach((dp) => {
      if (dp.teams && dp.teams.length === 1) {
        const _fr = group.rankings.find((fr) => fr.id === dp.teams[0].id)
        if (_fr !== undefined) {
          dp.rankings = [_fr]
        }
      } else if (dp.teams && dp.teams.length === 2) {
        console.log('dp.teams.length', dp.teams.length)
      } else if (dp.teams && dp.teams.length === 3) {
        calculateGroupRankings(dp.teams, dp, config)
        collectGroupRankings(dp, 2)
        let gd_tied = false
        dp.rankings.sort((a, b) => {
          return comparePoints(a, b, () => {
            return compareGoalDifference(a, b, true, () => {
              gd_tied = true
              return compareGoalForward(a, b, true, () => {
                return drawingLots(a, b)
              })
            })
          })
        })
        dp.rankings.forEach((fr) => {
          let allTeamNames = ``
          dp.teams.forEach((t, index) => {
            allTeamNames = `${allTeamNames}${getTeamName(t.id)}${index < dp.teams.length - 2 ? ',' : ''}${index === dp.teams.length - 2 ? ' & ' : ''} `
          })
          fr.h2h_notes = !gd_tied
            ? `Considering only the matches between themselves, teams ${allTeamNames} all tied on points (${fr.pts}). ${getTeamName(fr.id)} GF/GA = ${fr.gf}/${
                fr.ga
              }. Goal Difference >>> ${getTeamName(fr.id)} ${fr.gd > 0 ? '+' : ''}${fr.gd}`
            : `Considering only the matches between themselves, teams ${allTeamNames} all tied on points (${fr.pts}) and goal difference (${
                fr.gd > 0 ? '+' : ''
              }${fr.gd}). ${getTeamName(fr.id)} GF/GA = ${fr.gf}/${fr.ga}. Goals >>> ${getTeamName(fr.id)} ${fr.gf}`
        })
      }
    })
  group.draw_pools &&
    group.draw_pools.forEach((dp) => {
      dp.rankings &&
        dp.rankings.forEach((fr) => {
          if (!group.rankings2) {
            group.rankings2 = []
          }
          const _fr = group.rankings.find((fr2) => fr2.id === fr.id)
          if (_fr !== undefined) {
            _fr.h2h_notes = fr.h2h_notes
            group.rankings2.push(_fr)
          }
        })
    })
  group.rankings = group.rankings2
  group.rankings.forEach((t, index) => {
    if (t) {
      t.r = group.name === 'Semi-finals' || group.name === 'Semi-finals Second Leg' ? startingIndex : index + startingIndex
    }
  })
}

export const sortGroupRankings = (group, startingIndex, config) => {
  if (group && group.rankings) {
    const isGoalRatioTiebreaker = config ? config.isGoalRatioTiebreaker : false
    const isLotGroupPlayoffTiebreaker = config ? config.isLotGroupPlayoffTiebreaker : false
    const isPointsLotTiebreaker = config ? config.isPointsLotTiebreaker : false
    const isHead2HeadBeforeGoalDifference = config ? config.isHead2HeadBeforeGoalDifference : false
    const noSavingDraws = config ? config.noSavingDraws : false
    if (group.three_way_tied) {
      createDrawPools(group, startingIndex, config)
    } else {
      group.rankings.sort((a, b) => {
        if (group.name === 'Semi-finals' || group.name === 'Semi-finals Second Leg') {
          return getTeamName(a.id) > getTeamName(b.id) ? 1 : -1
        } else if (a.pts > b.pts) {
          return -1
        } else if (a.pts < b.pts) {
          return 1
        } else {
          if (isHead2HeadBeforeGoalDifference) {
            updateDrawPool(group, a, b)
            updateH2h(group, a, b)
            return compareH2h(a, b, false, () => {
              return compareGoalDifference(a, b, true, () => {
                return compareGoalForward(a, b, true, () => {
                  return drawingLots(a, b)
                })
              })
            })
          } else if (isPointsLotTiebreaker) {
            return drawingLots(a, b)
          } else if (isLotGroupPlayoffTiebreaker) {
            const dl = drawingLots(a, b)
            if (dl !== 0) return dl
            return compareH2h(a, b, true, () => {
              return 0
            })
          } else if (isGoalRatioTiebreaker) {
            const found = findHeadtoHeadMatch(a, b, true) // Group Playoff
            if (found.length === 1) {
              const h2hMatch = found[0]
              return createH2hNotes(h2hMatch, a, b, () => {
                return 0
              })
            } else if (a.gr != null && b.gr != null) {
              if (a.gr > b.gr) {
                return -1
              } else if (a.gr < b.gr) {
                return 1
              } else {
                return 0
              }
            } else if (a.gr === null) {
              return 1
            } else if (b.gr === null) {
              return -1
            } else {
              return 0
            }
          } else if (a.gd > b.gd) {
            return -1
          } else if (a.gd < b.gd) {
            return 1
          } else {
            return compareGoalDifference(a, b, false, () => {
              if (group.tiebreak_pts_gd) {
                return drawingLots(a, b)
              } else {
                return compareGoalForward(a, b, false, () => {
                  if (!noSavingDraws) {
                    saveDrawBothTeams(group, a, b)
                  }
                  return compareH2h(a, b, false, () => {
                    return compareFairPoints(a, b)
                  })
                })
              }
            })
          }
        }
      })
      group.rankings.forEach((t, index) => {
        if (t) {
          t.r = group.name === 'Semi-finals' || group.name === 'Semi-finals Second Leg' ? startingIndex : index + startingIndex
        }
      })
    }
    if (group.draw_pools && !group.three_way_tied) {
      group.draw_pools.forEach((p) => {
        if (p.teams && p.teams.length === 3) {
          let allTeamNames = ``
          p.teams.forEach((t, index) => {
            allTeamNames = `${allTeamNames}${getTeamName(t.id)}${index < p.teams.length - 2 ? ',' : ''}${index === p.teams.length - 2 ? ' & ' : ''} `
          })
          calculateGroupRankings(p.teams, p, config)
          collectGroupRankings(p, 3)
          sortDrawPoolRankings(p)
          p.rankings.forEach((fr, index) => {
            fr.r = index + 1
            fr.h2h_notes = `Teams ${allTeamNames} all tied on points (${fr.pts}) and goal difference (${fr.gd}). Goals >>> ${getTeamName(fr.id)} ${fr.gf}`
          })
        }
      })
      group.rankings.forEach((fr) => {
        const pool = group.draw_pools.find((p) => p.pts === fr.pts)
        if (pool !== undefined && pool.rankings) {
          const team = pool.rankings.find((pfr) => pfr.id === fr.id)
          if (team !== undefined) {
            fr.r = team.r
            fr.h2h_notes = team.h2h_notes
          }
        }
      })
    }
  }
}

const excludeRankings = (a, b) => {
  if (!a || !b) return
  a.excluded_last_team = true
  a.mp = a.mp - b.mp
  a.w = a.w - b.w
  a.d = a.d - b.d
  a.l = a.l - b.l
  a.gf = a.gf - b.gf
  a.ga = a.ga - b.ga
  a.gd = a.gd - b.gd
  a.pts = a.pts - b.pts
}

// page_excluded = false on Groups | Calculate all rankings
// page_excluded = true on Final Standings | Exclude the matches vs the last-placed team
export const createGroupFinalRankings = (tournament, group, matchDay, page_excluded) => {
  if (!group.teams) return
  collectGroupRankings(group, matchDay)
  collectH2hRankings(group)
  const config = {
    isGoalRatioTiebreaker: isGoalRatioTiebreaker(tournament.config),
    isLotGroupPlayoffTiebreaker: isLotGroupPlayoffTiebreaker(tournament.config),
    isPointsLotTiebreaker: isPointsLotTiebreaker(tournament.config),
    isHead2HeadBeforeGoalDifference: isHead2HeadBeforeGoalDifference(tournament.config),
    points_for_win: tournament.config.points_for_win,
  }
  sortGroupRankings(group, 1, config)
  if (group.config.final_standings_excluded && page_excluded) {
    group.h2h_rankings &&
      group.h2h_rankings.forEach((hr) => {
        if (hr.oppid === group.config.final_standings_excluded) {
          const _fr = group.rankings.find((fr) => fr.id === hr.id)
          excludeRankings(_fr, hr)
        }
      })
  }
  if (tournament.id === 'GC2002' && group.details.name === 'Group* D') {
    group.rankings[0].r = 3
    group.rankings[0].h2h_notes = null
    group.rankings[0].draw_lot_notes =
      'Ecuador took 3rd place after finished identical records (points, goal difference and goal forward) with Canada and Haiti.'
    group.rankings[1].r = 1
    group.rankings[1].h2h_notes = null
    group.rankings[1].draw_lot_notes =
      'Canada took 1st place after finished identical records (points, goal difference and goal forward) with Haiti and Ecuador.'
    group.rankings[2].r = 2
    group.rankings[2].h2h_notes = null
    group.rankings[2].draw_lot_notes =
      'Haiti took 2nd place after finished identical records (points, goal difference and goals forward) with Canada and Ecuador.'
    group.rankings.sort((a, b) => {
      if (a.r < b.r) return -1
      else if (a.r > b.r) return 1
      else return 0
    })
  }
}

export const collectGroupRankings = (group, matchDay) => {
  if (!group.teams) return
  group.teams.forEach((team) => {
    if (team.rankings) {
      const md = team.rankings.length <= matchDay ? team.rankings.length : matchDay
      const rankings = team.rankings.find((r) => r.md === md)
      if (!group.rankings) {
        const newRankings = []
        newRankings.push(rankings)
        group.rankings = newRankings
        if (group.config) {
          group.config.ranking_type = 'group'
        }
      } else {
        group.rankings.push(rankings)
      }
    }
  })
  if (hasGroupPlayoff(group)) {
    const found = group.matches.find((m) => m.group_playoff)
    const team1 = group.teams.find((t) => t.id === found.home_team)
    const team2 = group.teams.find((t) => t.id === found.away_team)
    const ranking1 = team1.rankings.find((r) => r.md === matchDay + 1)
    const ranking2 = team2.rankings.find((r) => r.md === matchDay + 1)
    const final_ranking1 = group.rankings.find((fr) => fr.id === found.home_team)
    const final_ranking2 = group.rankings.find((fr) => fr.id === found.away_team)
    if (!isUndefined(ranking1) && !isUndefined(ranking2)) {
      final_ranking1.h2hm = ranking1.h2hm
      final_ranking2.h2hm = ranking2.h2hm
    }
  }
}

export const collectH2hRankings = (group) => {
  if (!group.teams) return
  group.teams.forEach((team) => {
    if (team.h2h_rankings) {
      if (!group.h2h_rankings) {
        group.h2h_rankings = []
      }
      team.h2h_rankings.forEach((hr) => {
        group.h2h_rankings.push(hr)
      })
    }
  })
}

export const collectProgressRankings = (tournament, teams, matchDay) => {
  if (!teams) return
  if (!tournament || !tournament.progress_rankings) return
  teams.forEach((t) => {
    const team = tournament.progress_rankings.find((t2) => t2.id === t.id)
    if (team && team.rankings) {
      const md = team.rankings.length <= matchDay ? team.rankings.length : matchDay
      const rankings = team.rankings.find((r) => r.md === md)
      if (!tournament.final_rankings) {
        const newRankings = []
        newRankings.push(rankings)
        tournament.final_rankings = newRankings
        tournament.ranking_type = 'group'
      } else {
        tournament.final_rankings.push(rankings)
      }
    }
  })
}

export const collectWildCardRankings = (tournament, round) => {
  const pos = round.groups && hasWildCardAdvancement(round.config) ? round.config.advancement.teams.wild_card.pos : 3
  let wildCard = { rankings: [], ranking_type: 'wildcard' }
  round.groups &&
    round.groups.forEach((g) => {
      // console.log('g', g)
      if (g.config && g.config.advancement && g.config.advancement.teams && !g.config.advancement.teams.wild_card) return
      if (isEmpty(g.rankings) || g.rankings.length < pos) return
      const r = g.rankings.find((fr) => fr.r === pos)
      if (r) {
        const wcr = cloneRanking(r)
        wildCard.rankings.push(wcr)
      }
    })
  sortGroupRankings(wildCard, 1, { noSavingDraws: true })
  return wildCard
}

export const hasWildCardAdvancement = (config) => {
  return (
    config &&
    config.advancement &&
    config.advancement.teams &&
    config.advancement.teams.wild_card &&
    config.advancement.teams.wild_card.pos &&
    config.advancement.teams.wild_card.count
  )
}

export const isWildCardExtraRow = (row, config) => {
  if (hasWildCardAdvancement(config)) {
    return config.advancement.teams.wild_card.count_extra
      ? row.r === config.advancement.teams.wild_card.count + config.advancement.teams.wild_card.count_extra
      : false
  }
  return false
}

export const isAdvancedNextRound = (row, config) => {
  if (!row) return false
  if (config.type === 'allocation') return true
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.auto) {
    let flag = false
    config.advancement.teams.auto.forEach((a) => (flag = flag || row.r === a))
    return flag
  }
  return false
}

export const isAdvancedWildCard = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.wild_card && config.advancement.teams.wild_card.pos) {
    return row.r === config.advancement.teams.wild_card.pos
  }
  return false
}

export const isAdvancedPlayoff = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.playoff) {
    return row.r === config.advancement.teams.playoff
  }
  return false
}

export const isAdvancedThirdPlace = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.third_place) {
    let flag = false
    config.advancement.teams.third_place.forEach((a) => (flag = flag || row.r === a))
    return flag
  }
  return false
}

export const isEliminated = (row, config) => {
  if (!row) return false
  if (isTransferred(row, config)) return true
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.eliminated) {
    let flag = false
    config.advancement.teams.eliminated.forEach((e) => (flag = flag || row.r === e))
    return flag
  }
  return false
}

export const isRelegated = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.relegated) {
    let flag = false
    config.advancement.teams.relegated.forEach((a) => (flag = flag || row.r === a))
    return flag
  }
  return false
}

export const isTransferred = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.transferred) {
    let flag = false
    config.advancement.teams.transferred.forEach((a) => (flag = flag || row.r === a))
    return flag
  }
  return false
}

export const getRowStriped = (row, config) => {
  if (isAdvancedNextRound(row, config)) return ' advanced-next-round-striped'
  if (isAdvancedWildCard(row, config)) return ' advanced-wild-card-striped'
  if (isAdvancedPlayoff(row, config)) return ' advanced-playoff-striped'
  if (isAdvancedThirdPlace(row, config)) return ' advanced-third-place-striped'
  if (isRelegated(row, config)) return ' relegation-striped'
  if (isTransferred(row, config)) return ' transferred-striped'
  return ''
}

// Wild card rankings
export const getWildCardRowStriped = (row, config) => {
  if (!row) return ''
  if (hasWildCardAdvancement(config)) {
    if (row.r <= config.advancement.teams.wild_card.count) {
      return ' advanced-wild-card-striped'
    } else if (isWildCardExtraRow(row, config)) {
      return ' advanced-wild-card-extra-striped'
    } else {
      return ''
    }
  }
  return ''
}

const adjustRankingCount = (rankingBundle) => {
  if (!rankingBundle || isEmpty(rankingBundle)) return
  let min = rankingBundle[0].r
  rankingBundle.forEach((r) => {
    // console.log('r', r)
    if (min > r.r) {
      min = r.r
    }
  })
  rankingBundle.forEach((r) => (r.r = min))
}

export const updateFinalRankings = (round) => {
  if (round.ranking_type !== 'round' && round.ranking_type !== 'alltimeround') return
  if (!round.rankings) return
  const identicals = []
  const runningIds = []
  const newFinalRankings = []
  round.rankings.forEach((fr) => {
    if (fr && !fr.draws) {
      identicals.push({ ids: [fr.id], rankings: [fr] })
      runningIds.push(fr.id)
    } else {
      if (fr && runningIds.find((x) => x === fr.id) === undefined) {
        runningIds.push(fr.id)
        identicals.push({ ids: [fr.id], rankings: [fr] })
      }
      fr.draws.forEach((d) => {
        if (runningIds.find((x) => x === d) === undefined) {
          runningIds.push(d)
          identicals.forEach((i) => {
            const found = i.ids.find((y) => y === fr.id)
            if (found !== undefined) {
              i.ids.push(d)
              const r2 = round.rankings.find((fr2) => fr2.id === d)
              if (!isUndefined(r2)) {
                i.rankings.push(r2)
              }
            }
          })
        }
      })
    }
  })
  // console.log('identicals', identicals)
  identicals.forEach((i) => {
    i.rankings.sort((a, b) => {
      if (getTeamName(a.id) > getTeamName(b.id)) {
        return 1
      }
      return -1
    })
    adjustRankingCount(i.rankings)
    if (i.rankings.length === 1) {
      newFinalRankings.push(i.rankings[0])
    } else {
      newFinalRankings.push(i.rankings)
    }
  })
  round.rankings = newFinalRankings
}

export const createSemifinalistsPool = (round) => {
  if (!round.rankings) return
  let pool = []
  round.rankings.forEach((fr) => {
    pool.push(fr)
  })
  round.rankings = []
  round.rankings.push(pool)
}

export const isMatchFinal = (m) => {
  return isFinite(m.home_score) && isFinite(m.away_score)
}

export const isRankingValid = (r) => {
  return !isEmpty(r) && (!isEmpty(r.id) || r.length > 1)
}

export const cloneRanking = (ranking) => {
  return {
    d: ranking.d,
    fp: ranking.fp,
    ga: ranking.ga,
    gd: ranking.gd,
    gf: ranking.gf,
    gr: ranking.gr,
    h2hm: ranking.h2hm,
    id: ranking.id,
    l: ranking.l,
    md: ranking.md,
    mp: ranking.mp,
    pts: ranking.pts,
    r: 1,
    w: ranking.w,
  }
}
