import React from 'react'
import Knockout2LeggedSummary from './Knockout2LeggedSummary'
import { PathSchedule, calculateAggregateScore, splitPathPairs } from './MatchHelper'
import { Row, Col } from 'reactstrap'

const Knockout2Legged = (props) => {
  const { round, config } = props
  calculateAggregateScore(round)
  const pathPairs = splitPathPairs(round, config)
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
      {pathPairs.map((p) => (
        <PathSchedule path={p} config={config} key={p.name} />
      ))}
    </React.Fragment>
  )
}

export default Knockout2Legged
