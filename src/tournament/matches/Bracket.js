import React, { useState } from 'react'
import { getFlagSrc, getBracketTeamName, getBracketTeamCode } from '../../core/TeamHelper'
import { isWinner, isAwayGoalsWinner, reorderBracketPairs } from '../../core/Helper'
import { AwayGoalsTooltip, ConsolationTooltip } from '../../core/TooltipHelper'
import { hasReplay, getHomeBracketOtherTooltip, getAwayBracketOtherTooltip, getHomeBracketTooltip, getAwayBracketTooltip } from './MatchHelper'
import { getTeamArray } from '../../core/DataHelper'
import { Row, Col, Collapse, Button } from 'reactstrap'
import moment from 'moment'
import { isEmpty, isNull, isUndefined } from 'lodash'

const getMatchDate = (match, config) => {
  if (isEmpty(match)) return
  return (
    <React.Fragment>
      {config.show_match_year ? moment(match.date).format('MMMM D') : moment(match.date).format('MMM D, YYYY')}{' '}
      {match.replay_date && <React.Fragment>({moment(match.replay_date).format('MMM D')})</React.Fragment>}
    </React.Fragment>
  )
}

const getMatchPairDate = (match) => {
  if (isEmpty(match)) return
  return <React.Fragment>{match.date ? moment(match.date).format('MMM D, YYYY') : ''}</React.Fragment>
}

export const getBracketClubLogoImg = (id, config) => {
  if (isNull(id)) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    return (
      <React.Fragment>
        <img
          className="bracket-logo-xxxs bracket-logo-xxs bracket-logo-xs bracket-logo-sm"
          src={`/images/${config.logo_path}/${team.logo_filename}`}
          alt={id}
          title={id}
        />
      </React.Fragment>
    )
  } else {
    console.log('Team error', team)
  }
}

export const getTeamFlag = (id, config) => {
  if (!id) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && getBracketClubLogoImg(id, config)}
      {config.team_type_id !== 'CLUB' && (
        <img className="bracket-flag-xxxs bracket-flag-xxs bracket-flag-xs bracket-flag-sm" src={getFlagSrc(id)} alt={id} title={id} />
      )}
    </React.Fragment>
  )
}

export const getHomeHalfBoxTooltip = (isPair, m1, m2, config) => {
  return (
    <React.Fragment>
      &nbsp;
      {!isPair && getHomeBracketTooltip(m1, config)}
      {isPair && (
        <React.Fragment>
          {isAwayGoalsWinner('H', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
          {getAwayBracketTooltip(m2, config)}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const getAwayHalfBoxTooltip = (isPair, m1, m2, config) => {
  return (
    <React.Fragment>
      &nbsp;
      {!isPair && getAwayBracketTooltip(m1, config)}
      {isPair && (
        <React.Fragment>
          {isAwayGoalsWinner('A', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
          {getHomeBracketTooltip(m2, config)}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const getHomeHalfBoxName = (isPair, m1, m2, config) => {
  return (
    <React.Fragment>
      {!isPair && (
        <React.Fragment>
          <Col xs={{ size: 7 }} className={`box-team-name ${isWinner('H', m1) ? '' : 'box-team-name-light'} d-none d-lg-block`}>
            {getBracketTeamName(m1.home_team)}
            {getHomeHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
          <Col xs={{ size: 7 }} className={`box-team-name ${isWinner('H', m1) ? '' : 'box-team-name-light'} d-block d-lg-none`}>
            {getBracketTeamCode(m1.home_team, config)}
            {getHomeHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
        </React.Fragment>
      )}
      {isPair && (
        <React.Fragment>
          <Col xs={{ size: 5 }} className={`box-team-name ${isWinner('H', m1) ? '' : 'box-team-name-light'} d-none d-lg-block`}>
            {getBracketTeamName(m1.home_team)}
            {getHomeHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
          <Col xs={{ size: 5 }} className={`box-team-name ${isWinner('H', m1) ? '' : 'box-team-name-light'} d-block d-lg-none`}>
            {getBracketTeamCode(m1.home_team, config)}
            {getHomeHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const getAwayHalfBoxName = (isPair, m1, m2, config) => {
  return (
    <React.Fragment>
      {!isPair && (
        <React.Fragment>
          <Col xs={{ size: 7 }} className={`box-team-name ${isWinner('A', m1) ? '' : 'box-team-name-light'} d-none d-lg-block`}>
            {getBracketTeamName(m1.away_team)}
            {getAwayHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
          <Col xs={{ size: 7 }} className={`box-team-name ${isWinner('A', m1) ? '' : 'box-team-name-light'} d-block d-lg-none`}>
            {getBracketTeamCode(m1.away_team, config)}
            {getAwayHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
        </React.Fragment>
      )}
      {isPair && (
        <React.Fragment>
          <Col xs={{ size: 5 }} className={`box-team-name ${isWinner('A', m1) ? '' : 'box-team-name-light'} d-none d-lg-block`}>
            {getBracketTeamName(m1.away_team)}
            {getAwayHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
          <Col xs={{ size: 5 }} className={`box-team-name ${isWinner('A', m1) ? '' : 'box-team-name-light'} d-block d-lg-none`}>
            {getBracketTeamCode(m1.away_team, config)}
            {getAwayHalfBoxTooltip(isPair, m1, m2, config)}
          </Col>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const getHomeHalfBoxScores = (isPair, m1, m2) => {
  const m2_away_score =
    (m2 && !isUndefined(m2.away_score) ? m2.away_score : 0) +
    parseInt(m2 && m2.match_type === 'secondleg' && !isUndefined(m2.away_extra_score) ? m2.away_extra_score : 0)
  return (
    <React.Fragment>
      {!isPair && (
        <React.Fragment>
          {m1.home_extra_score == null && (
            <Col xs={{ size: 2 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
              {m1.home_score}
              {m1.home_penalty_score != null && <React.Fragment>&nbsp;({m1.home_penalty_score})</React.Fragment>}
              {m1.home_replay_score != null && <React.Fragment>&nbsp;({m1.home_replay_score})</React.Fragment>}
              {getHomeBracketOtherTooltip(m1)}
            </Col>
          )}
          {m1.home_extra_score != null && (
            <Col xs={{ size: 2 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
              {parseInt(m1.home_score) + parseInt(m1.home_extra_score)}
              {m1.home_penalty_score != null && <React.Fragment>&nbsp;({m1.home_penalty_score})</React.Fragment>}
              {m1.home_replay_score != null && <React.Fragment>&nbsp;({m1.home_replay_score})</React.Fragment>}
              {getHomeBracketOtherTooltip(m1)}
            </Col>
          )}
        </React.Fragment>
      )}
      {isPair && (
        <React.Fragment>
          <Col xs={{ size: 1 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
            {m1.home_score}
          </Col>
          <Col xs={{ size: 1 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
            {!isUndefined(m2.away_score) ? m2_away_score : ''}
          </Col>
          <Col xs={{ size: 1 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
            {m1.home_aggregate_score_1st_leg}
          </Col>
          {m1.home_penalty_score_2nd_leg != null && (
            <Col xs={{ size: 1 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
              {m1.home_penalty_score_2nd_leg != null && <React.Fragment>({m1.home_penalty_score_2nd_leg})</React.Fragment>}
            </Col>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const getAwayHalfBoxScores = (isPair, m1, m2) => {
  const m2_home_score =
    (m2 && !isUndefined(m2.home_score) ? m2.home_score : 0) +
    parseInt(m2 && m2.match_type === 'secondleg' && !isUndefined(m2.home_extra_score) ? m2.home_extra_score : 0)
  return (
    <React.Fragment>
      {!isPair && (
        <React.Fragment>
          {m1.away_extra_score == null && (
            <Col xs={{ size: 2 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
              {m1.away_score}
              {m1.away_penalty_score != null && <React.Fragment>&nbsp;({m1.away_penalty_score})</React.Fragment>}
              {m1.away_replay_score != null && <React.Fragment>&nbsp;({m1.away_replay_score})</React.Fragment>}
              {getAwayBracketOtherTooltip(m1)}
            </Col>
          )}
          {m1.away_extra_score != null && (
            <Col xs={{ size: 2 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
              {parseInt(m1.away_score) + parseInt(m1.away_extra_score)}
              {m1.away_penalty_score != null && <React.Fragment>&nbsp;({m1.away_penalty_score})</React.Fragment>}
              {m1.away_replay_score != null && <React.Fragment>&nbsp;({m1.away_replay_score})</React.Fragment>}
              {getAwayBracketOtherTooltip(m1)}
            </Col>
          )}
        </React.Fragment>
      )}
      {isPair && (
        <React.Fragment>
          <Col xs={{ size: 1 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
            {m1.away_score}
          </Col>
          <Col xs={{ size: 1 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
            {!isUndefined(m2.home_score) ? m2_home_score : ''}
          </Col>
          <Col xs={{ size: 1 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
            {m2.home_aggregate_score_2nd_leg}
          </Col>
          {m1.away_penalty_score_2nd_leg != null && (
            <Col xs={{ size: 1 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
              {m1.away_penalty_score_2nd_leg != null && <React.Fragment>({m1.away_penalty_score_2nd_leg})</React.Fragment>}
            </Col>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const BracketFinalCol = (props) => {
  const { round, thirdPlace, silverMedal, config } = props
  const { column_count } = config
  const colClassname = column_count === 5 ? 'col-brk-18' : 'col-brk-22'
  return (
    <Col className={colClassname}>
      {column_count === 2 && <Row className="bracket-gap-height-10"></Row>}
      {column_count === 3 && <Row className="bracket-gap-height-20"></Row>}
      {column_count === 4 && <Row className="bracket-gap-height-30"></Row>}
      {column_count === 5 && <Row className="bracket-gap-height-40"></Row>}
      <BracketColInner round={round} config={config} />
      {thirdPlace && <BracketColInner round={thirdPlace} config={config} />}
      {silverMedal && <BracketColInner round={silverMedal} config={config} />}
    </Col>
  )
}

const BracketHook1 = (props) => {
  const { colIndex, hookCount, config } = props
  // console.log('config.column_count', config.column_count)
  const colClassname = config.column_count === 5 ? 'col-brk-1' : 'col-brk-2'
  return (
    <Col className={colClassname}>
      {Array.from(Array(hookCount), (e, i) => {
        return (
          <React.Fragment key={i}>
            {colIndex === 0 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-00"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook10"></Col>
                </Row>
                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-01"></Row>}
              </React.Fragment>
            )}
            {colIndex === 1 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-10"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook11"></Col>
                </Row>
                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-11"></Row>}
              </React.Fragment>
            )}
            {colIndex === 2 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-20"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook12"></Col>
                </Row>
                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-21"></Row>}
              </React.Fragment>
            )}
            {colIndex === 3 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-30"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook13"></Col>
                </Row>
              </React.Fragment>
            )}
          </React.Fragment>
        )
      })}
    </Col>
  )
}

const BracketHook2 = (props) => {
  const { colIndex, hookCount, config } = props
  const colClassname = config.column_count === 5 ? 'col-brk-1' : 'col-brk-2'
  return (
    <Col className={colClassname}>
      {Array.from(Array(hookCount), (e, i) => {
        return (
          <React.Fragment key={i}>
            {colIndex === 0 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook200"></Col>
                  </Row>
                )}
                {i > 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook201"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {colIndex === 1 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook210"></Col>
                  </Row>
                )}
                {i > 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook211"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {colIndex === 2 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook220"></Col>
                  </Row>
                )}
                {i > 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook221"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {colIndex === 3 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook230"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )
      })}
    </Col>
  )
}

const BracketBox = (props) => {
  const { pair, colIndex, lastBox, config } = props
  if (isEmpty(pair)) return null
  if (pair.matches && pair.matches.length === 0) return null
  const isPair = !isEmpty(pair.matches)
  const m1 = isPair ? pair.matches[0] : pair
  const m2 = isPair && pair.matches.length > 1 ? pair.matches[1] : {}
  return (
    <React.Fragment>
      <Row className="no-gutters box-sm bracket-box-height">
        <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
          <Row className="no-gutters">
            <Col xs={{ size: 11, offset: 1 }}>
              <span className="box-time d-block d-lg-none">
                {!isPair && (
                  <React.Fragment>
                    {getMatchDate(m1, config)}
                    {m1.city ? ` | ${m1.city}` : ``}
                  </React.Fragment>
                )}
                {isPair && (
                  <React.Fragment>
                    {getMatchPairDate(m1)}
                    {m2 && (
                      <React.Fragment>
                        {` | `}
                        {getMatchPairDate(m2)}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </span>
              <span className="box-time d-none d-lg-block">
                {!isPair && (
                  <React.Fragment>
                    {getMatchDate(m1, config)}
                    {m1.stadium && m1.city ? ` | ${m1.stadium}, ${m1.city}` : ``}
                  </React.Fragment>
                )}
                {isPair && (
                  <React.Fragment>
                    {getMatchPairDate(m1)}
                    {`, `}
                    {m1.city}
                    {m2 && (
                      <React.Fragment>
                        {` | `}
                        {getMatchPairDate(m2)}
                        {m2.date ? `, ` : ``}
                        {m2.city}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </span>
            </Col>
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height border-bottom-gray5">
          <Row className="no-gutters h3-ff3">
            <Col xs={{ size: 2 }} className="brk-halfbox-ml">
              {getTeamFlag(m1.home_team, config)}
            </Col>
            {getHomeHalfBoxName(isPair, m1, m2, config)}
            {getHomeHalfBoxScores(isPair, m1, m2)}
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height">
          <Row className="no-gutters h4-ff3">
            <Col xs={{ size: 2 }} className="brk-halfbox-ml">
              {m1 && <React.Fragment>{getTeamFlag(m1.away_team, config)}</React.Fragment>}
            </Col>
            {getAwayHalfBoxName(isPair, m1, m2, config)}
            {getAwayHalfBoxScores(isPair, m1, m2)}
          </Row>
        </Col>
      </Row>
      {colIndex === 0 && !lastBox && <Row className="bracket-gap-height-01"></Row>}
      {colIndex === 1 && !lastBox && <Row className="bracket-gap-height-11"></Row>}
      {colIndex === 2 && !lastBox && <Row className="bracket-gap-height-21"></Row>}
      {colIndex === 3 && !lastBox && <Row className="bracket-gap-height-31"></Row>}
    </React.Fragment>
  )
}

const BracketColInner = (props) => {
  const { round, colIndex, config } = props
  const pairs = round.pairs || round.matches || []
  const roundName =
    round.details.name && (config.competition_id === 'MOFT' || config.competition_id === 'WOFT')
      ? round.details.name
          .replace('Consolation First Round', 'Consol 1st')
          .replace('Consolation Semi-finals', 'Consol Semi')
          .replace('Third-place', 'Bronze medal')
          .replace('Final', 'Gold medal')
          .replace('Silver medal match', 'Silver medal')
          .replace('Playoff First Round', 'P/o 1st')
          .replace('Playoff Second Round', 'P/o 2nd')
      : round.details.name.replace('Preliminary Semi-finals', 'Prelim Semi').replace('Preliminary Final', 'Prelim Final')

  const roundconsolationTooltip = (
    <React.Fragment>
      {(roundName === 'Consol 1st' || roundName === 'Consol Semi' || roundName === 'P/o 1st' || roundName === 'P/o 2nd') && round.details.consolation_notes && (
        <ConsolationTooltip target={`consolationBracketTooltip_${round.details.short_name.replace(/ /g, '_')}`} notes={round.details.consolation_notes} />
      )}
    </React.Fragment>
  )
  const colClassname1 = `${config.column_count === 5 ? 'h3-ff1' : 'h2-ff1'} margin-top-md d-none d-xl-block`
  const colClassname2 = `${config.column_count === 5 ? 'h4-ff1' : 'h3-ff1'} margin-top-md d-none d-lg-block d-xl-none`
  const colClassname3 = `${config.column_count === 5 ? 'h6-ff1' : 'h5-ff1'} margin-top-md d-none d-md-block d-lg-none`
  const colClassname4 = `${config.column_count === 5 ? 'h6-ff1' : 'h5-ff1'} margin-top-md d-block d-md-none`

  return (
    <React.Fragment>
      {colIndex === 0 && <Row className="bracket-gap-height-00"></Row>}
      {colIndex === 1 && <Row className="bracket-gap-height-10"></Row>}
      {colIndex === 2 && <Row className="bracket-gap-height-20"></Row>}
      {colIndex === 3 && <Row className="bracket-gap-height-30"></Row>}
      <Row className="no-gutters bracket-col-height">
        <Col xs={{ size: 11, offset: 1 }}>
          <div className={colClassname1}>
            {roundName}
            {roundconsolationTooltip}
          </div>
          <div className={colClassname2}>
            {roundName}
            {roundconsolationTooltip}
          </div>
          <div className={colClassname3}>
            {roundName}
            {roundconsolationTooltip}
          </div>
          <div className={colClassname4}>
            {round.details.short_name}
            {roundconsolationTooltip}
          </div>
        </Col>
      </Row>
      {pairs.map((p, index) => (
        <BracketBox pair={p} colIndex={colIndex} lastBox={index === pairs.length - 1} config={config} key={index} />
      ))}
    </React.Fragment>
  )
}

const BracketCol = (props) => {
  const { round, colIndex, config } = props
  const colClassname = config.column_count === 5 ? 'col-brk-18' : 'col-brk-22'
  return (
    <Col className={colClassname}>
      <BracketColInner round={round} colIndex={colIndex} config={config} />
    </Col>
  )
}

const attachReplayMatches = (round) => {
  if (isEmpty(round.matches)) return
  const roundMatches = round.matches.filter((m) => !m.replay)
  const replayMatches = round.matches.filter((m) => m.replay)
  roundMatches.forEach((m) => {
    const cond1 = (rm) => {
      return m.home_team === rm.home_team && m.away_team === rm.away_team
    }
    const cond2 = (rm) => {
      return m.home_team === rm.away_team && m.away_team === rm.home_team
    }
    const rm = replayMatches.find((rm) => cond1(rm) || cond2(rm))
    if (rm) {
      if (m.home_team === rm.home_team && m.away_team === rm.away_team) {
        m.home_replay_score = rm.home_score
        m.away_replay_score = rm.away_score
      } else if (m.home_team === rm.away_team && m.away_team === rm.home_team) {
        m.home_replay_score = rm.away_score
        m.away_replay_score = rm.home_score
      }
      m.replay_date = rm.date
      m.replay_time = rm.time
    }
  })
  return { ...round, matches: roundMatches }
}

const DisplayBracket = (props) => {
  const { stage, config } = props
  const filteredRounds = stage.rounds ? stage.rounds.filter((r) => r.details.name !== 'Preliminary Round' && r.details.name !== 'Third-place') : []
  let thirdPlace = stage.rounds ? stage.rounds.find((s) => s.details.name === 'Third-place') : {}
  // console.log('thirdPlace', thirdPlace)
  if (hasReplay(thirdPlace)) {
    thirdPlace = attachReplayMatches(thirdPlace)
  }
  const roundConfig = { ...config, column_count: filteredRounds.length }
  return (
    <Row className="no-gutters mb-5">
      {filteredRounds.map((_r, index) => {
        const r = hasReplay(_r) ? attachReplayMatches(_r) : _r
        if (!isEmpty(r.pairs) || !isEmpty(r.matches)) {
          const pairs = r.pairs || r.matches
          reorderBracketPairs(pairs)
          const hookCount = pairs.length % 2 === 0 ? pairs.length / 2 : (pairs.length - 1) / 2
          if (r.details.name === 'Final') {
            return <BracketFinalCol round={r} thirdPlace={thirdPlace} config={roundConfig} key={r.details.name} />
          } else if (r.details.name !== 'Third-place') {
            return (
              <React.Fragment key={r.details.name}>
                <BracketCol round={r} colIndex={index} config={roundConfig} />
                <BracketHook1 colIndex={index} hookCount={hookCount} config={roundConfig} />
                <BracketHook2 colIndex={index} hookCount={hookCount} config={roundConfig} />
              </React.Fragment>
            )
          }
        }
        return null
      })}
    </Row>
  )
}

const Bracket = (props) => {
  const { stage, config } = props
  const consolationBracketName = stage.rounds && stage.rounds.find((r) => r.details.name === 'Playoff First Round') !== undefined ? 'Playoff' : 'Consolation'
  const [collapse, setCollapse] = useState(false)
  const [status, setStatus] = useState('Closed')
  const onEntering = () => setStatus('Opening...')
  const onEntered = () => setStatus('Opened')
  const onExiting = () => setStatus('Closing...')
  const onExited = () => setStatus('Closed')
  const toggle = () => setCollapse(!collapse)
  if (isEmpty(stage) || isEmpty(stage.rounds)) return

  return (
    <React.Fragment>
      <Row className="mt-3 text-center">
        <Col sm="12">
          <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse">
            {!config.consolation_bracket && <React.Fragment>Bracket&nbsp;</React.Fragment>}
            {config.consolation_bracket && <React.Fragment>{consolationBracketName} Bracket&nbsp;</React.Fragment>}
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        <DisplayBracket stage={stage} config={config} />
      </Collapse>
    </React.Fragment>
  )
}

export default Bracket
