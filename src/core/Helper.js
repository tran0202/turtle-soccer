import { isEmpty, isNull } from 'lodash'

/* ========== Tournaments ========== */

export const getTournamentTitleFont = (comp) => {
  let fontClassName = ''
  if (!comp) return fontClassName
  switch (comp.id) {
    case 'WC':
      fontClassName = 'h1-ff5 tournament-title-WC'
      break
    case 'WWC':
      fontClassName = 'tournament-title-WWC'
      break
    case 'MOFT':
      fontClassName = 'h1-ff5 tournament-title-MOFT'
      break
    case 'WOFT':
      fontClassName = 'tournament-title-WOFT'
      break
    case 'CONFEDC':
      fontClassName = 'h1-ff5 tournament-title-CONFEDC'
      break
    case 'EURO':
      fontClassName = 'tournament-title-EURO'
      break
    case 'UNL':
      fontClassName = 'h1-ff5 tournament-title-UNL'
      break
    case 'UCL':
      fontClassName = 'h1-ff5 tournament-title-UCL'
      break
    case 'UEL':
      fontClassName = 'h1-ff5 tournament-title-UEL'
      break
    case 'COPA':
      fontClassName = 'tournament-title-COPA'
      break
    case 'GC':
      fontClassName = 'tournament-title-GC'
      break
    case 'AFCON':
      fontClassName = 'tournament-title-AFCON'
      break
    case 'AAC':
      fontClassName = 'tournament-title-AAC'
      break
    case 'ONC':
      fontClassName = 'tournament-title-ONC'
      break
    default:
      fontClassName = 'h1-ff5 tournament-title'
  }
  return fontClassName
}

/* ========== Stages ========== */

export const getAllocationStages = (stages) => {
  return stages ? stages.filter((s) => s.config.type === 'allocation') : []
}

export const getRoundRobinStages = (stages) => {
  return stages ? stages.filter((s) => s.config.type === 'roundrobin') : []
}

export const getRoundRobinMdStages = (stages) => {
  return stages ? stages.filter((s) => s.config.type === 'roundrobinmatchday') : []
}

export const getKnockoutStages = (stages) => {
  return stages ? stages.filter((s) => s.config.type === 'knockout') : []
}

export const getAllRoundRobinStages = (stages) => {
  return stages
    ? stages.filter((s) => s.config.type === 'roundrobin' || s.config.type === 'roundrobinmatchday' || s.config.type === 'roundrobinleaguematchday')
    : []
}

export const getRoundRobinLeagueMdStages = (leagues) => {
  if (!leagues) return null
  const rrLeagues = []
  leagues.forEach((l) => {
    if (l.stages) {
      const rrStages = l.stages.filter((s) => s.config.type === 'roundrobinleaguematchday')
      if (!isEmpty(rrStages)) {
        rrLeagues.push({ ...l, stages: rrStages })
      }
    }
  })
  return rrLeagues
}

export const getDefaultStageTab = (stages) => {
  const temp = 'Group-Stage'
  if (!stages || isEmpty(stages)) return temp
  const defaultStageIndex = stages.findIndex((s) => s.config.default)
  const defaultStageName = defaultStageIndex > -1 ? stages[defaultStageIndex].details.name : stages[0].details.name
  return defaultStageName ? defaultStageName.replace(/ /g, '-') : temp
}

export const getDefaultMdTab = (leagues) => {
  const temp = 'Matchday-1'
  if (!leagues || isEmpty(leagues)) return temp
  const _l = leagues.find((l) => !isNull(l.config.default_matchday))
  // console.log('_l', _l)
  return _l !== undefined ? _l.config.default_matchday.replace(/ /g, '-') : temp
}

export const getDefaultLeagueTab = (leagues) => {
  const temp = 'League-A'
  if (!leagues || isEmpty(leagues)) return temp
  const _l = leagues.find((l) => l.config.default)
  return _l !== undefined ? _l.details.name.replace(/ /g, '-') : temp
}

export const getFinalPathStage = (stage) => {
  if (!stage.rounds) return {}
  const newRounds = stage.rounds.filter(
    (r) =>
      r.details.name !== 'Consolation First Round' &&
      r.details.name !== 'Consolation Semi-finals' &&
      r.details.name !== 'Fifth-place' &&
      r.details.name !== 'Playoff First Round' &&
      r.details.name !== 'Playoff Second Round' &&
      r.details.name !== 'Silver medal match',
  )
  return { ...stage, rounds: newRounds }
}

export const getConsolationPathStage = (stage) => {
  if (!stage.rounds) return {}
  const newRounds = stage.rounds.filter(
    (r) =>
      r.details.name === 'Consolation First Round' ||
      r.details.name === 'Consolation Semi-finals' ||
      r.details.name === 'Fifth-place' ||
      r.details.name === 'Playoff First Round' ||
      r.details.name === 'Playoff Second Round' ||
      r.details.name === 'Silver medal match',
  )
  return { ...stage, rounds: newRounds }
}

export const getBracketStage = (stage) => {
  if (!stage) return {}
  const rounds = []
  stage.rounds &&
    stage.rounds.forEach((r) => {
      const roundMatches = []
      r.matches &&
        r.matches.forEach((m) => {
          roundMatches.push(m)
        })
      rounds.push({ ...r, matches: reorderBracketPairs(roundMatches) })
    })
  return { ...stage, rounds }
}

/* ========== Pairs & Matches ========== */

export const reorderBracketPairs = (pairs) => {
  pairs &&
    pairs.sort((a, b) => {
      if (a.bracket_order < b.bracket_order) {
        return -1
      } else if (a.bracket_order > b.bracket_order) {
        return 1
      } else {
        return 0
      }
    })
  return pairs
}

export const collectPairMatches = (round) => {
  if (!round || !round.pairs) return []
  const matches = []
  round.pairs.forEach((p) => {
    p &&
      p.matches &&
      p.matches.forEach((m) => {
        matches.push(m)
      })
  })
  round.matches = matches
}

export const collectFirstLegMatches = (round) => {
  if (!round || !round.pairs) return []
  const matches = []
  round.pairs.forEach((p) => {
    p &&
      p.matches &&
      p.matches.forEach((m) => {
        if (m.match_type === 'firstleg' || m.match_type === 'firstlegonly') {
          matches.push(m)
        }
      })
  })
  round.matches = matches
}

export const collectMdMatches = (group) => {
  if (isEmpty(group.matchdays)) return
  let matches = []
  group.matchdays &&
    group.matchdays.forEach((md) => {
      md.matches &&
        md.matches.forEach((m) => {
          matches.push(m)
        })
    })
  group.matches = matches
}

export const isWinner = (who, match) => {
  // console.log('match', match)
  if (match) {
    if (who === 'H') {
      if (match.match_void) return match.away_withdrew
      if (match.match_type === 'firstleg') {
        return (
          match.home_aggregate_score_1st_leg > match.away_aggregate_score_1st_leg ||
          match.aggregate_team_1st_leg === match.home_team ||
          (match.home_aggregate_score_1st_leg === match.away_aggregate_score_1st_leg && match.home_penalty_score_2nd_leg > match.away_penalty_score_2nd_leg)
        )
      }
      return (
        match.home_walkover ||
        match.home_coin_toss ||
        match.home_bye ||
        match.home_playoff_win ||
        (!match.second_leg &&
          (match.home_score > match.away_score ||
            (match.home_score === match.away_score && match.home_extra_score > match.away_extra_score) ||
            (match.home_score === match.away_score &&
              match.home_extra_score === match.away_extra_score &&
              match.home_penalty_score > match.away_penalty_score) ||
            match.home_replay_score > match.away_replay_score)) ||
        (match.second_leg && match.home_aggregate_score_2nd_leg > match.away_aggregate_score_2nd_leg) ||
        (match.second_leg &&
          match.home_aggregate_score_2nd_leg === match.away_aggregate_score_2nd_leg &&
          match.home_penalty_score > match.away_penalty_score) ||
        (match.second_leg && match.aggregate_team_2nd_leg === match.home_team)
      )
    } else {
      if (match.match_void) return match.home_withdrew
      if (match.match_type === 'firstleg') {
        return (
          match.home_aggregate_score_1st_leg < match.away_aggregate_score_1st_leg ||
          match.aggregate_team_1st_leg === match.away_team ||
          (match.home_aggregate_score_1st_leg === match.away_aggregate_score_1st_leg && match.home_penalty_score_2nd_leg < match.away_penalty_score_2nd_leg)
        )
      }
      return (
        match.away_walkover ||
        match.away_coin_toss ||
        (!match.second_leg &&
          (match.home_score < match.away_score ||
            (match.home_score === match.away_score && match.home_extra_score < match.away_extra_score) ||
            (match.home_score === match.away_score &&
              match.home_extra_score === match.away_extra_score &&
              match.home_penalty_score < match.away_penalty_score) ||
            match.home_replay_score < match.away_replay_score)) ||
        (match.second_leg && match.home_aggregate_score_2nd_leg < match.away_aggregate_score_2nd_leg) ||
        (match.second_leg &&
          match.home_aggregate_score_2nd_leg === match.away_aggregate_score_2nd_leg &&
          match.home_penalty_score < match.away_penalty_score) ||
        (match.second_leg && match.aggregate_team_2nd_leg === match.away_team)
      )
    }
  }
}

export const isAwayGoalsWinner = (who, match) => {
  // console.log('match', match)
  if (match) {
    if (who === 'H') {
      return match.match_type === 'firstleg' && match.aggregate_team_1st_leg === match.home_team
    } else {
      return match.match_type === 'firstleg' && match.aggregate_team_1st_leg === match.away_team
    }
  }
}
