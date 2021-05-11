import React from 'react'
import { DisplaySchedule, PathSchedule, getRoundMatches, hasReplay, splitPathMatches } from './MatchHelper'
import { getBracketStage, getFinalPathStage, getConsolationPathStage } from '../../core/Helper'
import Bracket from './Bracket'
import Knockout2Legged from './Knockout2Legged'
import { Row, Col } from 'reactstrap'
import { isEmpty } from 'lodash'

const DisplayPath = (props) => {
  const { stage, config } = props
  const bracket_stage = getBracketStage(stage)
  const bracketConsolationConfig = {
    consolation_bracket: true,
    ...config,
  }
  const isHideBracket = (!isEmpty(stage.config) && stage.config.hide_bracket) || (!isEmpty(stage.rounds) && stage.rounds.length === 1)
  return (
    <React.Fragment>
      {config.consolation_path && (
        <Row>
          <Col>
            <div className="h2-ff5 margin-top-lg txt-underline">Consolation Tournament</div>
          </Col>
        </Row>
      )}
      {!isHideBracket && !config.consolation_path && <Bracket stage={bracket_stage} config={config} />}
      {!isHideBracket && config.consolation_path && <Bracket stage={bracket_stage} config={bracketConsolationConfig} />}
      {!isEmpty(stage.rounds) &&
        stage.rounds.map((r) => {
          const displayScheduleConfig = {
            ...config,
            ...stage.config,
            knockout_match: true,
            round_type: r.config.round_type,
          }
          if (r.config.round_type === 'knockout') {
            const matchArray = getRoundMatches(r, true)
            // console.log('matchArray', matchArray)
            if (!hasReplay(r)) {
              if (!stage.config.multiple_paths) {
                return <DisplaySchedule round={matchArray} config={displayScheduleConfig} details={r.details} key={r.details.name} />
              } else {
                const pathMatches = splitPathMatches(r, displayScheduleConfig)
                return (
                  <React.Fragment key={r.details.name}>
                    {r.details && (
                      <Row>
                        <Col>
                          <div className="h2-ff1 margin-top-md">{r.details.name}</div>
                        </Col>
                      </Row>
                    )}
                    {pathMatches.map((p) => (
                      <PathSchedule path={p} config={displayScheduleConfig} key={p.name} />
                    ))}
                  </React.Fragment>
                )
              }
            } else {
              const replayDetails = { ...r.details, name: `${r.details.name} Replay` }
              return (
                <React.Fragment key={r.details.name}>
                  <DisplaySchedule round={matchArray[0]} config={displayScheduleConfig} details={r.details} />
                  <DisplaySchedule round={matchArray[1]} config={displayScheduleConfig} details={replayDetails} />
                </React.Fragment>
              )
            }
          } else if (r.config.round_type === 'knockout2legged') {
            return <Knockout2Legged round={r} config={displayScheduleConfig} key={r.details.name} />
          }
          return null
        })}
    </React.Fragment>
  )
}

const Knockout = (props) => {
  const { stage, config } = props
  const finalPathStage = getFinalPathStage(stage)
  const consolationPathStage = getConsolationPathStage(stage)
  const consolationConfig = { ...config, consolation_path: true }
  return (
    <React.Fragment>
      <DisplayPath stage={finalPathStage} config={config} />
      {!isEmpty(consolationPathStage.rounds) && <DisplayPath stage={consolationPathStage} config={consolationConfig} />}
    </React.Fragment>
  )
}

export default Knockout
