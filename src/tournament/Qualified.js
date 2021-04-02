import React from 'react'
import { Row, Col } from 'reactstrap'
import ordinalize from 'ordinalize'
import { getFlagSrc, getTeamName } from '../core/TeamHelper'
import moment from 'moment'

export const QualifiedHead = () => {
  return (
    <Row className="no-gutters font-weight-bold team-row padding-tb-sm">
      <Col className="col-1"></Col>
      <Col className="col-3">Teams</Col>
      <Col className="col-3">How</Col>
      <Col className="col-3">When</Col>
      <Col className="col-2">Appearances</Col>
    </Row>
  )
}

const QualifiedRow = (props) => {
  const { row, count } = props
  return (
    <Row className="no-gutters team-row padding-tb-sm">
      <Col className="col-1">{count + 1}</Col>
      <Col className="col-3 text-uppercase text-left">
        {row.team && <img className="flag-sm flag-md" src={getFlagSrc(row.team)} alt={row.team} title={row.team} />}
        &nbsp;&nbsp;{getTeamName(row.team)}
      </Col>
      <Col className="col-3 padding-top-xxs">{row.method}</Col>
      <Col className="col-3 padding-top-xxs">{row.date ? moment(row.date).format('MMMM D, YYYY') : ''}</Col>
      <Col className="col-2 padding-top-xxs">
        {ordinalize(row.appearances)}
        {row.appearances === 1 ? ' (debut)' : ''}
      </Col>
    </Row>
  )
}

const Qualified = (props) => {
  const { teams } = props
  return (
    <React.Fragment>
      <Row className="box-xl mb-5">
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="mt-4"></Row>
          <QualifiedHead />
          {teams.map((r, index) => (
            <QualifiedRow row={r} count={index} key={index} />
          ))}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Qualified
