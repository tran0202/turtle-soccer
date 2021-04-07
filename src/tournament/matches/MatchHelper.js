import React from 'react'
// import { getTeamArray } from './DataHelper'
import { getTeamName, getTeamFlag } from '../../core/TeamHelper'
// import {
//   PlayoffWinTooltip,
//   WalkoverTooltip,
//   AwardedTooltip,
//   AetTooltip,
//   ByeTooltip,
//   CancelledTooltip,
//   GoldenGoalTooltip,
//   SilverGoalTooltip,
//   Extra140Tooltip,
//   DisqualifiedTooltip,
//   ReplacementTooltip,
//   ConsolationTooltip,
//   PlayoffSecondRoundTooltip,
// } from './TooltipHelper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { isEmpty } from 'lodash'

export const hasGroupPlayoff = (group) => {
  if (!group.matches) return false
  return group.matches.find((m) => m.group_playoff) !== undefined
}

export const hasReplay = (round) => {
  if (!round.matches) return false
  return round.matches.find((m) => m.replay) !== undefined
}

export const getRoundMatches = (round, sorted) => {
  if (isEmpty(round)) return []
  let tmp = []
  let tmpPlayoff = []
  let tmpReplay = []
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
    return [] // [getDateMatchArray(tmp, sorted), { ...getDateMatchArrayPair(tmpReplay, sorted), name: `${round.name} Replay` }]
  } else {
    return [] // [getDateMatchArray(tmp, sorted), { ...getDateMatchArrayPair(tmpPlayoff, sorted), name: 'Playoff' }]
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

export const isHomeLose = (data) => {
  const {
    knockout_match,
    second_leg_match,
    aggregate_team,
    away_team,
    home_score,
    away_score,
    home_extra_score,
    away_extra_score,
    home_penalty_score,
    away_penalty_score,
    home_aggregate_score,
    away_aggregate_score,
    match_void,
    need_playoff,
    home_withdrew,
    away_withdrew,
    away_walkover,
    away_coin_toss,
    round_type,
    postponed,
  } = data
  if (away_walkover || (away_coin_toss && round_type !== 'firstleg') || home_withdrew || postponed) return true
  if (!knockout_match) return false
  if (!second_leg_match) {
    return (
      !(match_void && away_withdrew) &&
      ((home_score != null && away_score != null && home_score < away_score) ||
        (home_extra_score != null && away_extra_score != null && home_extra_score < away_extra_score) ||
        (home_penalty_score != null && home_penalty_score != null && home_penalty_score < away_penalty_score))
    )
  }
  return (
    (home_penalty_score != null && home_penalty_score != null && home_penalty_score < away_penalty_score) ||
    (!need_playoff && home_aggregate_score < away_aggregate_score) ||
    aggregate_team === away_team
  )
}

export const DisplayMatch = (props) => {
  const { m, config } = props
  //   console.log('m', m)
  const homeLoseData = {
    ...m,
    ...config,
    aggregate_team: m.aggregate_team_2nd_leg,
    home_aggregate_score: m.home_aggregate_score_2nd_leg,
    away_aggregate_score: m.away_aggregate_score_2nd_leg,
  }
  //   const awayLoseData = {
  //     knockoutMatch: config.knockoutMatch,
  //     secondLegMatch: config.secondLegMatch,
  //     aggregate_team: m.aggregate_team_2nd_leg,
  //     home_team: m.home_team,
  //     home_score: m.home_score,
  //     away_score: m.away_score,
  //     home_extra_score: m.home_extra_score,
  //     away_extra_score: m.away_extra_score,
  //     home_penalty_score: m.home_penalty_score,
  //     away_penalty_score: m.away_penalty_score,
  //     home_aggregate_score: m.home_aggregate_score_2nd_leg,
  //     away_aggregate_score: m.away_aggregate_score_2nd_leg,
  //     match_void: m.match_void,
  //     need_playoff: m.need_playoff,
  //     home_withdrew: m.home_withdrew,
  //     away_withdrew: m.away_withdrew,
  //   }
  //   // console.log('awayLoseData', awayLoseData)
  //   // console.log('isAwayLoseAggregate(awayLoseData)', isAwayLoseAggregate(awayLoseData))
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
        <Col sm="3" xs="3" className={`team-name text-uppercase text-right team-name-no-padding-right${isHomeLose(homeLoseData) ? ' gray3' : ''}`}>
          {getTeamName(m.home_team)}
          {/* {m.home_bye && <ByeTooltip target={`byeTooltip_${m.home_team}_${m.away_team}`} anchor="(bye)" notes={m.bye_notes} />}
          {m.home_withdrew && <span className="withdrew-subscript">(withdrew)</span>}
          {m.home_playoff_win && <PlayoffWinTooltip target={`playoffWin_${m.home_team}_${m.away_team}`} notes={m.playoff_notes} />}
          {m.home_awarded_adjust && m.awarded_adjust_text && (
            <AwardedTooltip target={`awardedAdjust_${m.home_team}_${m.away_team}`} content={m.awarded_adjust_text} />
          )} */}
        </Col>
        {/* <Col sm="1" xs="1" className="padding-top-sm text-center">
          {getTeamFlag(m.home_team, config)}
        </Col>

        <Col sm="2" xs="2" className={`score text-center score-no-padding-right${m.postponed ? ' withdrew-subscript gray3' : ''}`}>
          {(m.home_extra_score == null || m.away_extra_score == null) && (
            <React.Fragment>
              {m.walkover && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover} anchor="(w/o)" />}
              {m.postponed && (
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
              {!m.walkover && !m.postponed && !m.match_cancelled && (
                <React.Fragment>
                  {m.home_score}-{m.away_score}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {m.home_extra_score != null && m.away_extra_score != null && (
            <React.Fragment>
              {parseInt(m.home_score) + parseInt(m.home_extra_score)}-{parseInt(m.away_score) + parseInt(m.away_extra_score)}
              {(config.goldenGoal || config.silverGoal) &&
              (m.home_extra_score !== 0 || m.away_extra_score !== 0) &&
              m.home_penalty_score == null &&
              m.away_penalty_score == null ? (
                config.goldenGoal ? (
                  <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g.g.)" />
                ) : (
                  <SilverGoalTooltip target="silvergoalTooltip" anchor="(s.g.)" />
                )
              ) : (
                <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />
              )}
            </React.Fragment>
          )}
          {(m.home_awarded || m.home_awarded_score_not_counted || m.away_awarded) && m.awarded_text && (
            <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text} />
          )}
          {m.extra_140 && <Extra140Tooltip target={`extra140`} />}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
          {getTeamFlag(m.away_team, config)}
        </Col>
        <Col
          sm="3"
          xs="3"
          className={`team-name text-uppercase${
            isAwayLoseAggregate(awayLoseData) ||
            m.home_walkover ||
            m.home_playoff_win ||
            (m.home_coin_toss && m.round_type !== 'firstleg') ||
            m.home_bye ||
            m.away_withdrew ||
            m.postponed
              ? ' gray3'
              : ''
          }`}
        >
          {getTeamName(m.away_team)}
          {m.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={m.disqualified_notes} />}
          {m.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={m.replacement_notes} />}
          {m.away_withdrew && <span className="withdrew-subscript">(withdrew)</span>}
        </Col> */}
      </Row>
      {/* <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 7, offset: 5 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_2nd_leg != null && m.away_aggregate_score_2nd_leg != null && (
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
          )}
          <DisplayExtraTimeText
            param={{
              home_team: m.home_team,
              away_team: m.away_team,
              home_extra_score: m.home_extra_score,
              away_extra_score: m.away_extra_score,
              home_penalty_score: m.home_penalty_score,
              away_penalty_score: m.away_penalty_score,
              home_coin_toss: m.home_coin_toss,
              away_coin_toss: m.away_coin_toss,
              group_playoff: m.group_playoff,
              round_type: m.round_type,
              goldenGoal: config.goldenGoal,
              silverGoal: config.silverGoal,
              void_notes: m.void_notes,
            }}
          />
          {isSharedBronze(m) && <React.Fragment>&gt;&gt;&gt;&nbsp;{m.shared_bronze_text}</React.Fragment>}
        </Col>
      </Row> */}
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
  //   console.log('round', round)
  const groupName = !isEmpty(details) ? details.name : ''
  // name && (config.tournamentTypeId === 'MOFT' || config.tournamentTypeId === 'WOFT')
  //   ? name.replace('Third-place', 'Bronze medal match').replace('Final', 'Gold medal match')
  //   : name
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">
            {groupName}
            {/* {(groupName === 'Consolation First Round' || groupName === 'Consolation Semi-finals' || groupName === 'Playoff First Round') &&
                consolation_notes && <ConsolationTooltip target="consolationTooltip" notes={consolation_notes} />}
              {groupName === 'Playoff Second Round' && <PlayoffSecondRoundTooltip target="playoffSecondRoundTooltip" />} */}
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
