import React from 'react'
import { DisplayKnockout2LeggedMatch, splitPathPairs } from './MatchHelper'
import { Row, Col } from 'reactstrap'
import { isEmpty } from 'lodash'

const SummaryHead = () => {
  return (
    <Row className="ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-box-25"></Col>
      <Col className="col-box-10"></Col>
      <Col className="text-center score-no-padding-right col-box-10">Leg1</Col>
      <Col className="text-center score-no-padding-right col-box-10">Leg2</Col>
      <Col className="text-center score-no-padding-right col-box-10">Agg</Col>
      <Col className="col-box-10"></Col>
      <Col className="col-box-25"></Col>
    </Row>
  )
}

const Knockout2LeggedBox = (props) => {
  const { path, config } = props
  // console.log('path', path)
  if (isEmpty(path.pairs)) return null
  return (
    <React.Fragment>
      {!isEmpty(path.name) && (
        <Row>
          <Col>
            <div className="h3-ff6 margin-top-md">{path.name} Path</div>
          </Col>
        </Row>
      )}
      <Row className="box-xl mt-4 mb-5">
        <Col>
          <Row className="mt-2"></Row>
          <SummaryHead />
          {path.pairs && path.pairs.map((p, index) => !isEmpty(p.matches) && <DisplayKnockout2LeggedMatch m={p.matches[0]} key={index} config={config} />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

const Knockout2LeggedSummary = (props) => {
  const { round, config } = props
  const pathMatches = splitPathPairs(round, config)
  // console.log('pathMatches', pathMatches)
  return (
    <React.Fragment>
      {pathMatches.map((p) => (
        <Knockout2LeggedBox path={p} config={config} key={p.name} />
      ))}
    </React.Fragment>
  )
}

export default Knockout2LeggedSummary
