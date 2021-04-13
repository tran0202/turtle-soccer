import React from 'react'
import { DisplaySchedule, getRoundMatches, hasReplay } from './MatchHelper'
import { getBracketStage, getFinalPathStage, getConsolationPathStage } from '../../core/Helper'
import Bracket from './Bracket'
import { Row, Col } from 'reactstrap'
import { isEmpty } from 'lodash'

const DisplayPath = (props) => {
  const { stage, config } = props
  const bracket_stage = getBracketStage(stage)
  const bracketConsolationConfig = {
    consolation_bracket: true,
    ...config,
  }
  const displayScheduleConfig = {
    knockout_match: true,
    ...config,
    ...stage.config,
  }
  return (
    <React.Fragment>
      {config.consolation_path && (
        <Row>
          <Col>
            <div className="h2-ff5 margin-top-lg txt-underline">Consolation Tournament</div>
          </Col>
        </Row>
      )}
      {!isEmpty(stage.config) && !stage.config.hide_bracket && !config.consolation_path && <Bracket stage={bracket_stage} config={config} />}
      {!isEmpty(stage.config) && !stage.config.hide_bracket && config.consolation_path && <Bracket stage={bracket_stage} config={bracketConsolationConfig} />}
      {!isEmpty(stage.rounds) &&
        stage.rounds.map((r) => {
          const matchArray = getRoundMatches(r, true)
          if (!hasReplay(r)) {
            return <DisplaySchedule round={matchArray} config={displayScheduleConfig} details={r.details} key={r.details.name} />
          } else {
            const replayDetails = { ...r.details, name: `${r.details.name} Replay` }
            return (
              <React.Fragment key={r.details.name}>
                <DisplaySchedule round={matchArray[0]} config={displayScheduleConfig} details={r.details} />
                <DisplaySchedule round={matchArray[1]} config={displayScheduleConfig} details={replayDetails} />
              </React.Fragment>
            )
          }
        })}
    </React.Fragment>
  )
}

const Knockout = (props) => {
  const { stage, config } = props
  const finalPathStage = getFinalPathStage(stage)
  // console.log('stage', stage)
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
