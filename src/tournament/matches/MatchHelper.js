import React from 'react'
import { getTeamName, getTeamFlag } from '../../core/TeamHelper'
// import { isAwayGoalsWinner } from '../../core/Helper'
import {
  PlayoffWinTooltip,
  WalkoverTooltip,
  AwardedTooltip,
  AetTooltip,
  ByeTooltip,
  CancelledTooltip,
  GoldenGoalTooltip,
  SilverGoalTooltip,
  Extra140Tooltip,
  DisqualifiedTooltip,
  ReplacementTooltip,
  ConsolationTooltip,
  PenTooltip,
  ReplayTooltip,
  CoinTossTooltip,
  WithdrewTooltip,
  MatchPostponedTooltip,
  SharedBronzeTooltip,
  MatchVoidedTooltip,
} from '../../core/TooltipHelper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { isEmpty, isUndefined, isNull } from 'lodash'

export const calculateAggregateScore = (round) => {
  if (isEmpty(round.pairs)) return
  round.pairs.forEach((p) => {
    if (p.matches) {
      const m1 = p.matches.find((m) => m.match_type === 'firstleg')
      const m2 = p.matches.find((m) => m.match_type === 'secondleg')
      const m3 = p.matches.find((m) => m.match_type === 'playoffleg')
      // console.log('m1', m1)
      // console.log('m2', m2)
      if (!isUndefined(m2) && !isUndefined(m3) && m2.home_team === m3.away_team && m2.away_team === m3.home_team) {
        if (m3.home_playoff_win) {
          m2.away_aggregate_playoff_win = m3.home_playoff_win
          m2.playoff_notes = m3.playoff_notes
        }
      }
      if (!isUndefined(m2) && !isUndefined(m1) && m2.home_team === m1.away_team && m2.away_team === m1.home_team) {
        // m1.round_type = firstLeg.round_type
        // m2.round_type = secondLeg.round_type
        // m1.first_leg = true
        // m2.second_leg = true
        m1.home_score_2nd_leg = m2.away_score
        m1.away_score_2nd_leg = m2.home_score
        m1.home_extra_score_2nd_leg = m2.away_extra_score
        m1.away_extra_score_2nd_leg = m2.home_extra_score
        m1.home_penalty_score_2nd_leg = m2.away_penalty_score
        m1.away_penalty_score_2nd_leg = m2.home_penalty_score
        if (m1.home_awarded) {
          m1.home_awarded_1st_leg = m1.home_awarded
          m1.awarded_text_1st_leg = m1.awarded_text
        }
        if (m1.away_awarded) {
          m1.away_awarded_1st_leg = m1.away_awarded
          m1.awarded_text_1st_leg = m1.awarded_text
        }
        if (m2.home_awarded) {
          m1.home_awarded_2nd_leg = m2.home_awarded
          m1.awarded_text_2nd_leg = m2.awarded_text
        }
        if (m2.away_awarded) {
          m1.away_awarded_2nd_leg = m2.away_awarded
          m1.awarded_text_2nd_leg = m2.awarded_text
        }
        if (m1.home_score != null && m1.away_score != null && m2.home_score != null && m2.away_score != null) {
          m1.home_aggregate_score_1st_leg = parseInt(m1.home_score) + parseInt(m2.away_score)
          m1.away_aggregate_score_1st_leg = parseInt(m1.away_score) + parseInt(m2.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m1.home_aggregate_score_1st_leg = m1.home_aggregate_score_1st_leg + parseInt(m2.away_extra_score)
            m1.away_aggregate_score_1st_leg = m1.away_aggregate_score_1st_leg + parseInt(m2.home_extra_score)
          }
          m2.home_aggregate_score_2nd_leg = parseInt(m2.home_score) + parseInt(m1.away_score)
          m2.away_aggregate_score_2nd_leg = parseInt(m2.away_score) + parseInt(m1.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m2.home_aggregate_score_2nd_leg = m2.home_aggregate_score_2nd_leg + parseInt(m2.home_extra_score)
            m2.away_aggregate_score_2nd_leg = m2.away_aggregate_score_2nd_leg + parseInt(m2.away_extra_score)
          }
        }
        if (m1.home_aggregate_score_1st_leg === m1.away_aggregate_score_1st_leg) {
          if (m1.away_score > m2.away_score) {
            m1.aggregate_team_1st_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m1.aggregate_team_1st_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m1.aggregate_team_1st_leg = m2.away_team
          }
        }
        if (m2.home_aggregate_score_2nd_leg === m2.away_aggregate_score_2nd_leg) {
          if (m1.away_score > m2.away_score) {
            m2.aggregate_team_2nd_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m2.aggregate_team_2nd_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m2.aggregate_team_2nd_leg = m2.away_team
          }
        }
        if (m1.home_coin_toss) {
          m2.away_coin_toss = true
        } else if (m1.away_coin_toss) {
          m2.home_coin_toss = true
        } else if (m2.home_coin_toss) {
          m1.away_coin_toss = true
        } else if (m2.away_coin_toss) {
          m1.home_coin_toss = true
        }
        if (m1.bypass_away_goals) {
          m2.bypass_away_goals = m1.bypass_away_goals
        } else if (m2.bypass_away_goals) {
          m1.bypass_away_goals = m2.bypass_away_goals
        }
        if (m1.need_playoff) {
          // firstLeg.need_playoff = m1.need_playoff
          // secondLeg.need_playoff = m1.need_playoff
          m2.need_playoff = m1.need_playoff
        } else if (m2.need_playoff) {
          // firstLeg.need_playoff = m2.need_playoff
          // secondLeg.need_playoff = m2.need_playoff
          m1.need_playoff = m2.need_playoff
        }
        if (m2.away_aggregate_playoff_win) {
          m1.home_aggregate_playoff_win = m2.away_aggregate_playoff_win
          m1.playoff_notes = m2.playoff_notes
        }
      }
    }
  })
}

const getLeagueClassname = (name) => {
  let fontClassName
  switch (name) {
    case 'League A':
      fontClassName = 'unl-league-A'
      break
    case 'League B':
      fontClassName = 'unl-league-B'
      break
    case 'League C':
      fontClassName = 'unl-league-C'
      break
    case 'League D':
      fontClassName = 'unl-league-D'
      break
    default:
      fontClassName = 'unl-league-A'
  }
  return fontClassName
}

export const hasGroupPlayoff = (group) => {
  if (isEmpty(group.matches)) return false
  return group.matches.find((m) => m.group_playoff) !== undefined
}

export const hasReplay = (round) => {
  if (isEmpty(round.matches)) return false
  return round.matches.find((m) => m.replay) !== undefined
}

export const isSharedBronze = (match) => {
  return match.shared_bronze
}

export const getRoundMatches = (round, sorted) => {
  if (isEmpty(round)) return []
  const tmp = []
  const tmpPlayoff = []
  const tmpReplay = []
  round.matches &&
    round.matches.forEach((m) => {
      if (!m.group_playoff && !m.replay) {
        tmp.push(m)
      } else if (m.replay) {
        tmpReplay.push(m)
      } else {
        tmpPlayoff.push(m)
      }
    })
  if (tmpPlayoff.length === 0 && tmpReplay.length === 0) {
    return getDateMatchArray(tmp, sorted)
  } else if (tmpReplay.length > 0) {
    return [getDateMatchArray(tmp, sorted), getDateMatchArray(tmpReplay, sorted)]
  } else {
    return [getDateMatchArray(tmp, sorted), getDateMatchArray(tmpPlayoff, sorted)]
    //return [getDateMatchArray(tmp, sorted), { ...getDateMatchArrayPair(tmpPlayoff, sorted), name: 'Playoff' }]
  }
}

export const getRoundPairs = (round, sorted) => {
  if (isEmpty(round)) return []
  round.pairs &&
    round.pairs.forEach((p) => {
      p.matches &&
        p.matches.forEach((m) => {
          if (m.match_type === 'firstleg') {
            p.date = m.date
            p.time = m.time
          }
        })
    })
  return getDateMatchArray(round.pairs, sorted)
}

export const getDateMatchArray = (matches, sorted) => {
  if (isEmpty(matches)) return []
  const isPair = !isEmpty(matches[0].matches)
  const date_matches = []
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
    const found = date_matches.find((dm) => dm.date === m.date)
    if (isEmpty(found)) {
      if (isPair) {
        date_matches.push({ date: m.date, pairs: [m] })
      } else {
        date_matches.push({ date: m.date, matches: [m] })
      }
    } else {
      if (isPair) {
        found.pairs.push(m)
      } else {
        found.matches.push(m)
      }
    }
  })
  return date_matches
}

export const splitPathMatches = (round, config) => {
  // console.log('round', round)
  if (!config.multiple_paths) return [{ name: '', pairs: round.pairs }]
  const championsPairs = []
  const leaguePairs = []
  const mainPairs = []
  round.pairs &&
    round.pairs.forEach((p) => {
      if (!isEmpty(p.matches)) {
        if (p.matches[0].path === 'Champions') {
          championsPairs.push(p)
        } else if (p.matches[0].path === 'League') {
          leaguePairs.push(p)
        } else {
          mainPairs.push(p)
        }
      }
    })
  return [
    { name: 'Champions', pairs: championsPairs },
    { name: 'League', pairs: leaguePairs },
    { name: 'Main', pairs: mainPairs },
  ]
}

const getHomeTooltip = (m) => {
  return (
    <React.Fragment>
      {m.home_bye && <ByeTooltip target={`byeTooltip_${m.home_team}_${m.away_team}`} anchor="(bye)" notes={m.bye_notes} />}
      {m.home_withdrew && <span className="withdrew-subscript">(withdrew)</span>}
      {m.home_playoff_win && <PlayoffWinTooltip target={`playoffWin_${m.home_team}_${m.away_team}`} notes={m.playoff_notes} />}
      {m.home_awarded_adjust && m.awarded_adjust_text && (
        <AwardedTooltip target={`awardedAdjust_${m.home_team}_${m.away_team}`} content={m.awarded_adjust_text} />
      )}
      {m.home_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={m.disqualified_notes} />}
      {m.home_replacement && <ReplacementTooltip target="replacementTooltip" notes={m.replacement_notes} />}
    </React.Fragment>
  )
}

const getAwayTooltip = (m) => {
  return (
    <React.Fragment>
      {m.away_bye && <ByeTooltip target={`byeTooltip_${m.home_team}_${m.away_team}`} anchor="(bye)" notes={m.bye_notes} />}
      {m.away_withdrew && <span className="withdrew-subscript">(withdrew)</span>}
      {m.away_playoff_win && <PlayoffWinTooltip target={`playoffWin_${m.home_team}_${m.away_team}`} notes={m.playoff_notes} />}
      {m.away_awarded_adjust && m.awarded_adjust_text && (
        <AwardedTooltip target={`awardedAdjust_${m.home_team}_${m.away_team}`} content={m.awarded_adjust_text} />
      )}
      {m.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={m.disqualified_notes} />}
      {m.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={m.replacement_notes} />}
    </React.Fragment>
  )
}

export const getHomeBracketTooltip = (m, config) => {
  return (
    <React.Fragment>
      {!isNull(m.home_extra_score) && !isNull(m.away_extra_score) && m.home_extra_score > m.away_extra_score && getBracketExtraTimeTooltip(m, config)}
      {m.home_penalty_score > m.away_penalty_score && <PenTooltip target="penTooltip" anchor="(pen)" />}
      {m.home_walkover && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover_notes} anchor="(w/o)" />}
      {!isUndefined(m.home_replay_score) && !isUndefined(m.away_replay_score) && m.home_replay_score > m.away_replay_score && (
        <ReplayTooltip target="replayTooltip" anchor="(rep)" />
      )}
      {m.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coi)" />}
      {m.home_bye && <ByeTooltip target={`byeTooltip_${m.home_team}_${m.away_team}`} anchor="(bye)" notes={m.bye_notes} />}
      {m.home_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
      {isSharedBronze(m) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={m.shared_bronze_text} />}
      {m.home_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={m.disqualified_notes} />}
      {m.home_replacement && <ReplacementTooltip target="replacementTooltip" notes={m.replacement_notes} />}
      {m.match_postponed && <MatchPostponedTooltip target="matchPostponedTooltip" anchor="(ppd)" notes={m.postponed_notes} />}
      {m.extra_140 && <Extra140Tooltip target={`extra140`} />}
    </React.Fragment>
  )
}

export const getAwayBracketTooltip = (m, config) => {
  return (
    <React.Fragment>
      {!isNull(m.home_extra_score) && !isNull(m.away_extra_score) && m.home_extra_score < m.away_extra_score && getBracketExtraTimeTooltip(m, config)}
      {m.home_penalty_score < m.away_penalty_score && <PenTooltip target="penTooltip" anchor="(pen.)" />}
      {m.away_walkover && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover_notes} anchor="(w/o)" />}
      {!isUndefined(m.home_replay_score) && !isUndefined(m.away_replay_score) && m.home_replay_score < m.away_replay_score && (
        <ReplayTooltip target="replayTooltip" anchor="(rep)" />
      )}
      {m.away_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coi)" />}
      {m.away_bye && <ByeTooltip target={`byeTooltip_${m.home_team}_${m.away_team}`} anchor="(bye)" notes={m.bye_notes} />}
      {m.away_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
      {isSharedBronze(m) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={m.shared_bronze_text} />}
      {m.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={m.disqualified_notes} />}
      {m.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={m.replacement_notes} />}
    </React.Fragment>
  )
}

const getScoreTooltip = (m) => {
  return (
    <React.Fragment>
      {(m.home_walkover || m.away_walkover) && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover_notes} anchor="(w/o)" />}
      {m.match_postponed && (
        <React.Fragment>
          postponed
          {m.postponed_notes && (
            <React.Fragment>
              <br></br>
              {m.postponed_notes}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {m.match_cancelled && (
        <React.Fragment>
          cancelled
          <CancelledTooltip target={`cancelled_${m.home_team}_${m.away_team}`} notes={m.cancelled_text} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const getExtraTimeResult = (m, config) => {
  if (isUndefined(m.home_extra_score) || isUndefined(m.away_extra_score)) return ''
  if (m.home_extra_score === m.away_extra_score && (!isUndefined(m.home_penalty_score) || !isUndefined(m.away_penalty_score))) return 'penalties'
  if (config.golden_goal_rule) return 'goldengoal'
  if (config.silver_goal_rule) return 'silvergoal'
  return 'extratime'
}

const getExtraTimeTooltip = (m, config) => {
  let tooltip
  switch (getExtraTimeResult(m, config)) {
    case 'goldengoal':
      tooltip = <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g.g.)" />
      break
    case 'silvergoal':
      tooltip = <SilverGoalTooltip target="silvergoalTooltip" anchor="(s.g.)" />
      break
    case 'extratime':
      tooltip = <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />
      break
    case 'penalties':
      tooltip = <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />
      break
    default:
      tooltip = null
  }
  return tooltip
}

export const getBracketExtraTimeTooltip = (m, config) => {
  let tooltip
  // console.log('m', m)
  switch (getExtraTimeResult(m, config)) {
    case 'goldengoal':
      tooltip = <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g)" />
      break
    case 'silvergoal':
      tooltip = <SilverGoalTooltip target="silvergoalTooltip" anchor="(s)" />
      break
    case 'extratime':
      tooltip = <AetTooltip target="aetTooltip" anchor="(aet)" />
      break
    default:
      tooltip = null
  }
  return tooltip
}

const getExtraTimeText = (m, config) => {
  let text
  switch (getExtraTimeResult(m, config)) {
    case 'goldengoal':
      text = <React.Fragment>&nbsp;won on golden goal</React.Fragment>
      break
    case 'silvergoal':
      text = <React.Fragment>&nbsp;won on silver goal</React.Fragment>
      break
    case 'extratime':
      text = <React.Fragment>&nbsp;won after extra time</React.Fragment>
      break
    default:
      text = <React.Fragment></React.Fragment>
  }
  return text
}

export const getOtherTooltip = (m) => {
  return (
    <React.Fragment>
      {(m.home_awarded || m.home_awarded_score_not_counted || m.away_awarded) && m.awarded_text && (
        <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text} />
      )}
      {m.extra_140 && <Extra140Tooltip target={`extra140`} />}
    </React.Fragment>
  )
}

export const getHomeBracketOtherTooltip = (m) => {
  return (
    <React.Fragment>
      {m.void_notes && <MatchVoidedTooltip target="matchVoidedTooltip" anchor="(v)" notes={m.void_notes} />}
      {(m.home_awarded || m.home_awarded_score_not_counted) && m.awarded_text && (
        <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text} />
      )}
    </React.Fragment>
  )
}

export const getAwayBracketOtherTooltip = (m) => {
  return (
    <React.Fragment>
      {m.away_awarded && m.awarded_text && <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text} />}
    </React.Fragment>
  )
}

// home_walkover|away_walkover: awarded a knockout win, no score given and counted (opponent disqualified before the match) (just like a bye)
// >>> AFCON_1957

// home_bye|away_bye: have a bye and advance to the next round, no score at all (no opponent/opponent withrew before the match)
// >>> MOFT_1908, MOFT_1912, MOFT_1920, MOFT_1956

// home_coin_toss|away_coin_toss: determine winner of a (knockout/knockout2legged) match
// >>> COPA_1975, COPA_1983, EURO_1968, MOFT_1968|MOFT_1960

// home_playoff_win|away_playoff_win: determine winner of the playoff
// >>> COPA_1979

// home_withdrew|away_withdrew: teams withdrew, to be shown on display match
// >>> MOFT_1936, MOFT_1956|AFCON_2010, MOFT_1908, MOFT_1920, MOFT_1956

// match_postponed: match postponed, to be shown on display match
// >>> MOFT_1956

// match_void: score not counted
// >>> MOFT_1936

// home_awarded_score_not_counted: awarded a knockout win, score given but not counted
// >>> MOFT_1920

// home_awarded_adjust: awarded a roundrobin win (2pts), score still unchanged
// >>> COPA_1942, COPA_1953

// home_disqualified|away_disqualified: teams disqualified, to be shown on display match
// >>> MOFT_1920

// home_replacement|away_replacement: teams replacement, to be shown on display match
// >>> MOFT_1920

export const isHomeLose = (m) => {
  if (m.away_walkover || m.away_bye || m.away_coin_toss || m.away_playoff_win || m.home_withdrew || m.match_postponed) return true
  if (!m.knockout_match) return false
  if (isEmpty(m.match_type) || m.match_type === 'firstlegonly') {
    return (
      !(m.match_void && m.away_withdrew) &&
      (m.home_score < m.away_score || m.home_extra_score < m.away_extra_score || m.home_penalty_score < m.away_penalty_score)
    )
  }
  // console.log('m', m)
  return m.home_penalty_score < m.away_penalty_score || (!m.need_playoff && m.home_aggregate_score < m.away_aggregate_score) || m.aggregate_team === m.away_team
}

export const isAwayLose = (m) => {
  if (m.home_walkover || m.home_bye || m.home_coin_toss || m.home_playoff_win || m.away_withdrew || m.match_postponed) return true
  // console.log('m', m)
  if (!m.knockout_match) return false
  if (isEmpty(m.match_type) || m.match_type === 'firstlegonly') {
    return (
      !(m.match_void && m.home_withdrew) &&
      (m.home_score > m.away_score || m.home_extra_score > m.away_extra_score || m.home_penalty_score > m.away_penalty_score)
    )
  }
  return m.home_penalty_score > m.away_penalty_score || (!m.need_playoff && m.home_aggregate_score > m.away_aggregate_score) || m.aggregate_team === m.home_team
}

export const showScore = (m) => {
  return !m.home_walkover && !m.away_walkover && !m.match_postponed && !m.match_cancelled
}

const DisplayAwayGoalsText = (props) => {
  const { match } = props
  const { aggregate_team, home_extra_score, away_extra_score } = match
  return (
    <React.Fragment>
      {aggregate_team && (
        <React.Fragment>
          &nbsp;&gt;&gt;&gt; <b>{getTeamName(aggregate_team)}</b> won on away goals
          {home_extra_score != null && away_extra_score != null && <React.Fragment>&nbsp;after extra time</React.Fragment>}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const DisplayExtraTimeText = (props) => {
  const { m, config } = props
  return (
    <React.Fragment>
      {m.void_notes && <React.Fragment>&gt;&gt;&gt;&nbsp;{m.void_notes}</React.Fragment>}
      {!m.void_notes && (
        <React.Fragment>
          {!isUndefined(m.home_extra_score) && !isUndefined(m.away_extra_score) && (
            <React.Fragment>
              {isUndefined(m.home_penalty_score) && isUndefined(m.away_penalty_score) && !m.group_playoff && (
                <React.Fragment>
                  {m.home_extra_score !== m.away_extra_score && <React.Fragment>&nbsp;&gt;&gt;&gt;&nbsp;</React.Fragment>}
                  {m.home_extra_score > m.away_extra_score && (
                    <React.Fragment>
                      <b>{getTeamName(m.home_team)}</b>
                    </React.Fragment>
                  )}
                  {m.home_extra_score < m.away_extra_score && (
                    <React.Fragment>
                      <b>{getTeamName(m.away_team)}</b>
                    </React.Fragment>
                  )}
                  {m.home_extra_score !== m.away_extra_score && <React.Fragment>{getExtraTimeText(m, config)}</React.Fragment>}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {!isUndefined(m.home_penalty_score) && !isUndefined(m.away_penalty_score) && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;
              {m.home_penalty_score > m.away_penalty_score && (
                <React.Fragment>
                  <b>{getTeamName(m.home_team)}</b>
                </React.Fragment>
              )}
              {m.home_penalty_score < m.away_penalty_score && (
                <React.Fragment>
                  <b>{getTeamName(m.away_team)}</b>
                </React.Fragment>
              )}
              &nbsp;won on penalties&nbsp;
              <b>
                {m.home_penalty_score}-{m.away_penalty_score}
              </b>
              {isUndefined(m.home_extra_score) && isUndefined(m.away_extra_score) && <React.Fragment>&nbsp;(No extra time was played)</React.Fragment>}
            </React.Fragment>
          )}
          {m.home_coin_toss && (m.round_type === 'secondleg' || m.round_type === undefined) && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;<b>{getTeamName(m.home_team)}</b> won on coin toss
            </React.Fragment>
          )}
          {m.away_coin_toss && (m.round_type === 'secondleg' || m.round_type === undefined) && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;<b>{getTeamName(m.away_team)}</b> won on coin toss
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const DisplayKnockout2LeggedMatch = (props) => {
  const { m, config } = props
  const loseData = {
    ...m,
    ...config,
    aggregate_team: m.aggregate_team_1st_leg,
    home_aggregate_score: m.home_aggregate_score_1st_leg,
    away_aggregate_score: m.away_aggregate_score_1st_leg,
  }
  return (
    <React.Fragment>
      <Row className="padding-top-md">
        <Col className={`team-name text-uppercase text-right team-name-no-padding-right col-box-25${isHomeLose(loseData) ? ' gray3' : ''}`}>
          {getTeamName(m.home_team)}
          {m.home_aggregate_playoff_win && <PlayoffWinTooltip target={`playoffWin_${m.home_team}_${m.away_team}`} notes={m.playoff_notes} />}
        </Col>
        <Col className="padding-top-sm text-center col-box-10">{getTeamFlag(m.home_team, config)}</Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_score != null && m.away_score != null && (
            <React.Fragment>
              {m.home_walkover && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover_notes} anchor="(w/o)" />}
              {!m.home_walkover && (
                <React.Fragment>
                  {m.home_score}-{m.away_score}
                </React.Fragment>
              )}
              {(m.home_awarded_1st_leg || m.away_awarded_1st_leg) && m.awarded_text_1st_leg && (
                <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text_1st_leg} />
              )}
            </React.Fragment>
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_score_2nd_leg != null && m.away_score_2nd_leg != null && m.home_extra_score_2nd_leg == null && m.away_extra_score_2nd_leg == null && (
            <React.Fragment>
              {m.home_score_2nd_leg}-{m.away_score_2nd_leg}
            </React.Fragment>
          )}
          {m.home_extra_score_2nd_leg != null && m.away_extra_score_2nd_leg != null && (
            <React.Fragment>
              {parseInt(m.home_score_2nd_leg) + parseInt(m.home_extra_score_2nd_leg)}-{parseInt(m.away_score_2nd_leg) + parseInt(m.away_extra_score_2nd_leg)}
              <AetTooltip target="aetTooltip3" anchor="(a.e.t.)" />
            </React.Fragment>
          )}
          {(m.home_awarded_2nd_leg || m.away_awarded_2nd_leg) && m.awarded_text_2nd_leg && (
            <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text_2nd_leg} />
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_aggregate_score_1st_leg != null && m.away_aggregate_score_1st_leg != null && (
            <React.Fragment>
              {m.home_aggregate_score_1st_leg}-{m.away_aggregate_score_1st_leg}
            </React.Fragment>
          )}
        </Col>
        <Col className="padding-top-sm text-center flag-no-padding-left col-box-10">{getTeamFlag(m.away_team, config)}</Col>
        <Col className={`team-name text-uppercase col-box-25${isAwayLose(loseData) ? ' gray3' : ''}`}>{getTeamName(m.away_team)}</Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 6, offset: 6 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_1st_leg != null && m.away_aggregate_score_1st_leg != null && !m.bypass_away_goals && (
            <DisplayAwayGoalsText
              match={{
                ...m,
                aggregate_team: m.aggregate_team_1st_leg,
                home_extra_score: m.home_extra_score_2nd_leg,
                away_extra_score: m.away_extra_score_2nd_leg,
              }}
            />
          )}
          <DisplayExtraTimeText
            m={{
              ...m,
              home_extra_score: m.home_extra_score_2nd_leg,
              away_extra_score: m.away_extra_score_2nd_leg,
              home_penalty_score: m.home_penalty_score_2nd_leg,
              away_penalty_score: m.away_penalty_score_2nd_leg,
            }}
            config={config}
          />
        </Col>
      </Row>
      <Row className="padding-tb-md border-bottom-gray5"></Row>
    </React.Fragment>
  )
}

export const DisplayMatch = (props) => {
  const { m, config } = props
  const loseData = {
    ...m,
    ...config,
    aggregate_team: m.aggregate_team_2nd_leg,
    home_aggregate_score: m.home_aggregate_score_2nd_leg,
    away_aggregate_score: m.away_aggregate_score_2nd_leg,
  }
  const borderBottomColor = m.match_type === 'secondleg' || m.match_type === 'firstlegonly' ? 'border-bottom-gray2' : 'border-bottom-gray5'
  return (
    <Col sm="12" className={`padding-tb-md ${borderBottomColor}`}>
      <Row>
        <Col sm="2" xs="1" className="font-10 margin-top-time-xs">
          {(config.hide_date_grouping || m.match_type === 'secondleg') && (
            <React.Fragment>
              <span className="txt-underline">
                {config.show_match_year ? moment(m.date).format('dddd, MMMM D, YYYY') : moment(m.date).format('dddd, MMMM D')}
              </span>
            </React.Fragment>
          )}
          <br />
          {m.time}
          {m.group && (
            <React.Fragment>
              <br />
              {m.group} {m.group_playoff ? 'Playoff' : ''}
            </React.Fragment>
          )}
          <span className="no-display-xs">
            <br />
            {m.stadium}
          </span>
          <span className="no-display-xs">
            <br />
            {m.city}
          </span>
        </Col>
        <Col sm="3" xs="3" className={`team-name text-uppercase text-right team-name-no-padding-right${isHomeLose(loseData) ? ' gray3' : ''}`}>
          {getTeamName(m.home_team)}
          {getHomeTooltip(m)}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center">
          {getTeamFlag(m.home_team, config)}
        </Col>

        <Col sm="2" xs="2" className={`score text-center score-no-padding-right${m.match_postponed ? ' withdrew-subscript gray3' : ''}`}>
          {(isUndefined(m.home_extra_score) || isUndefined(m.away_extra_score)) && (
            <React.Fragment>
              {getScoreTooltip(m)}
              {showScore(m) && (
                <React.Fragment>
                  {m.home_score}-{m.away_score}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {!isUndefined(m.home_extra_score) && !isUndefined(m.away_extra_score) && (
            <React.Fragment>
              {parseInt(m.home_score) + parseInt(m.home_extra_score)}-{parseInt(m.away_score) + parseInt(m.away_extra_score)}
              {getExtraTimeTooltip(m, config)}
            </React.Fragment>
          )}
          {getOtherTooltip(m)}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
          {getTeamFlag(m.away_team, config)}
        </Col>
        <Col sm="3" xs="3" className={`team-name text-uppercase${isAwayLose(loseData) ? ' gray3' : ''}`}>
          {getTeamName(m.away_team)}
          {getAwayTooltip(m)}
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 7, offset: 5 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_2nd_leg != null && m.away_aggregate_score_2nd_leg != null && (
            <React.Fragment>
              Aggregate:&nbsp;
              <b>
                {m.home_aggregate_score_2nd_leg}-{m.away_aggregate_score_2nd_leg}
              </b>
              {!m.bypass_away_goals && <DisplayAwayGoalsText match={{ ...m, aggregate_team: m.aggregate_team_2nd_leg }} />}
            </React.Fragment>
          )}
          <DisplayExtraTimeText m={m} config={config} />
          {isSharedBronze(m) && <React.Fragment>&gt;&gt;&gt;&nbsp;{m.shared_bronze_text}</React.Fragment>}
        </Col>
      </Row>
    </Col>
  )
}

export const DisplaySchedule2 = (props) => {
  const { round, config, details } = props
  if (isEmpty(round)) return null
  const { show_match_year, hide_date_grouping } = config
  //   const { dates, matches } = round
  return (
    <React.Fragment>
      {!isEmpty(details.path_name) && (
        <Row>
          <Col>
            <div className="h3-ff6 margin-top-md">{details.path_name}</div>
          </Col>
        </Row>
      )}
      {round.map((x, index) => (
        <Row key={x.date}>
          {!hide_date_grouping && (
            <Col sm="12" className="h4-ff3 border-bottom-gray2 margin-top-md">
              {show_match_year ? moment(x.date).format('dddd, MMMM D, YYYY') : moment(x.date).format('dddd, MMMM D')}
            </Col>
          )}
          {x.leagues &&
            x.leagues.map((l) => (
              <React.Fragment key={l.name}>
                <Col sm="12" className={`${getLeagueClassname(l.name)} h5-ff3 margin-top-md`}>
                  {l.name}
                </Col>
                <React.Fragment>{l.matches && l.matches.map((m, index) => <DisplayMatch m={m} config={config} key={index} />)}</React.Fragment>
              </React.Fragment>
            ))}
          {x.pairs &&
            x.pairs.map((p, index) => (
              <React.Fragment key={index}>{p.matches && p.matches.map((m, index) => <DisplayMatch m={m} config={config} key={index} />)}</React.Fragment>
            ))}
          {x.matches && x.matches.map((m, index) => <DisplayMatch m={m} config={config} key={index} />)}
        </Row>
      ))}
    </React.Fragment>
  )
}

export const DisplaySchedule = (props) => {
  const { round, config, details } = props
  // const { multiple_paths } = config
  // const { name, dates, consolation_notes } = round
  // const pathDatesMatches = multiple_paths ? splitPathDatesMatches(round) : []
  round.sort((a, b) => {
    if (a.date > b.date) {
      return 1
    } else if (a.date < b.date) {
      return -1
    } else {
      return 0
    }
  })
  const groupName = !isEmpty(details)
    ? details.name && (config.competition_id === 'MOFT' || config.competition_id === 'WOFT')
      ? details.name.replace('Third-place', 'Bronze medal match').replace('Final', 'Gold medal match')
      : details.name
    : ''
  return (
    <React.Fragment>
      {!isEmpty(groupName) && (
        <Row>
          <Col>
            <div className="h2-ff1 margin-top-md">
              {groupName}
              {details && details.consolation_notes && (
                <ConsolationTooltip target={`consolationTooltip_${details.short_name.replace(' ', '_')}`} notes={details.consolation_notes} />
              )}
            </div>
          </Col>
        </Row>
      )}
      <DisplaySchedule2 round={round} config={config} details={details} />
    </React.Fragment>
  )
}
