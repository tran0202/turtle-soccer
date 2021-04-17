import React from 'react'
import Knockout2LeggedSummary from './Knockout2LeggedSummary'
import { DisplaySchedule, getRoundPairs, calculateAggregateScore, splitPathMatches } from './MatchHelper'
import { Row, Col } from 'reactstrap'
import { isEmpty } from 'lodash'

const PathSchedule = (props) => {
  const { path, config } = props
  const pairArray = getRoundPairs(path, true)
  const pathDetails = { path_name: !isEmpty(path.name) ? `${path.name} Path` : '' }
  // console.log('path', path)
  return <DisplaySchedule round={pairArray} config={config} details={pathDetails} />
}

const Knockout2Legged = (props) => {
  const { round, config } = props
  calculateAggregateScore(round)
  const pathMatches = splitPathMatches(round, config)
  return (
    <React.Fragment>
      {round.details && (
        <Row>
          <Col>
            <div className="h2-ff1 margin-top-md">{round.details.name}</div>
          </Col>
        </Row>
      )}
      <Knockout2LeggedSummary round={round} config={config} />
      {pathMatches.map((p) => (
        <PathSchedule path={p} config={config} key={p.name} />
      ))}
    </React.Fragment>
  )
}

export default Knockout2Legged
