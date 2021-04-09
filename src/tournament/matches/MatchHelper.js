import React from 'react'
import { getTeamName, getTeamFlag } from '../../core/TeamHelper'
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
} from '../../core/TooltipHelper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { isEmpty, isUndefined, isNull } from 'lodash'

export const hasGroupPlayoff = (group) => {
  if (!group.matches) return false
  return group.matches.find((m) => m.group_playoff) !== undefined
}

export const hasReplay = (round) => {
  if (!round.matches) return false
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

export const getDateMatchArray = (matches, sorted) => {
  if (isEmpty(matches)) return []
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
      date_matches.push({ date: m.date, matches: [m] })
    } else {
      found.matches.push(m)
    }
  })
  return date_matches
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

const getExtraTimeResult = (m, config) => {
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

const getOtherTooltip = (m, config) => {
  return (
    <React.Fragment>
      {(m.home_awarded || m.home_awarded_score_not_counted || m.away_awarded) && m.awarded_text && (
        <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text} />
      )}
      {m.extra_140 && <Extra140Tooltip target={`extra140`} />}
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
  if (!m.second_leg_match) {
    return (
      !(m.match_void && m.away_withdrew) &&
      (m.home_score < m.away_score || m.home_extra_score < m.away_extra_score || m.home_penalty_score < m.away_penalty_score)
    )
  }
  return m.home_penalty_score < m.away_penalty_score || (!m.need_playoff && m.home_aggregate_score < m.away_aggregate_score) || m.aggregate_team === m.away_team
}

export const isAwayLose = (m) => {
  if (m.home_walkover || m.home_bye || m.home_coin_toss || m.home_playoff_win || m.away_withdrew || m.match_postponed) return true
  if (!m.knockout_match) return false
  if (!m.second_leg_match) {
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

const DisplayExtraTimeText = (props) => {
  const { m, config } = props
  // console.log('m', m)
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
          {config.hide_date_grouping && (
            <React.Fragment>{config.show_match_year ? moment(m.date).format('dddd, MMMM D, YYYY') : moment(m.date).format('dddd, MMMM D')}</React.Fragment>
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
          {/* {m.home_aggregate_score_2nd_leg != null && m.away_aggregate_score_2nd_leg != null && (
            <React.Fragment>
              Aggregate:&nbsp;
              <b>
                {m.home_aggregate_score_2nd_leg}-{m.away_aggregate_score_2nd_leg}
              </b>
              {!m.bypass_away_goals && (
                <DisplayAwayGoalsText
                  param={{ aggregate_team: m.aggregate_team_2nd_leg, home_extra_score: m.home_extra_score, away_extra_score: m.away_extra_score }}
                />
              )}
            </React.Fragment>
          )} */}
          <DisplayExtraTimeText m={m} config={config} />
          {isSharedBronze(m) && <React.Fragment>&gt;&gt;&gt;&nbsp;{m.shared_bronze_text}</React.Fragment>}
        </Col>
      </Row>
    </Col>
  )
}

export const DisplaySchedule2 = (props) => {
  const { round, config } = props
  const { show_match_year, hide_date_grouping } = config
  //   const { dates, matches } = round
  return (
    <React.Fragment>
      {/* {dates && !isEmpty(dates) && config.path_name && (
        <Row>
          <Col>
            <div className="h3-ff6 margin-top-md">{config.path_name}</div>
          </Col>
        </Row>
      )} */}
      {round.map((x) => (
        <Row key={x.date}>
          {!hide_date_grouping && (
            <Col sm="12" className="h4-ff3 border-bottom-gray2 margin-top-md">
              {show_match_year ? moment(x.date).format('dddd, MMMM D, YYYY') : moment(x.date).format('dddd, MMMM D')}
            </Col>
          )}
          {x.matches.map((m, index) => (
            <DisplayMatch m={m} config={config} key={index} />
          ))}
        </Row>
      ))}
    </React.Fragment>
  )
}

export const DisplaySchedule = (props) => {
  const { round, config, details } = props
  const { multiple_paths } = config
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
  console.log('details', details)
  const groupName = !isEmpty(details)
    ? details.name && (config.competition_id === 'MOFT' || config.competition_id === 'WOFT')
      ? details.name.replace('Third-place', 'Bronze medal match').replace('Final', 'Gold medal match')
      : details.name
    : ''
  return (
    <React.Fragment>
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
      {!multiple_paths && <DisplaySchedule2 round={round} config={config} />}
      {/* {multiple_paths &&
          pathDatesMatches.map((p) => (
            <DisplaySchedule2 round={{ dates: p.dates, matches: p.matches }} config={{ ...config, path_name: `${p.path} Path` }} key={p.path} />
          ))} */}
    </React.Fragment>
  )
}
