import React from 'react'
import { getTournamentTitleFont } from '../core/Helper'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'
import { isEmpty } from 'lodash'

const hasAnyGroups = (qualification) => {
  if (isEmpty(qualification.stages)) return false
  const rrStage = qualification.stages.find((s) => s.config.type === 'roundrobin')
  if (!rrStage) return false
  return !isEmpty(rrStage.groups)
}

const hasMdGroups = (qualification) => {
  if (isEmpty(qualification.stages)) return 0
  const rrmdStage = qualification.stages.find((s) => s.config.type === 'roundrobinmatchday')
  if (!rrmdStage) return 0
  return rrmdStage.groups ? rrmdStage.groups.length : 0
}

const PageLinks = (props) => {
  const { query, qualification } = props
  const { id, cid, qPage } = query

  return (
    <Nav className="justify-content-center">
      <NavItem>
        <NavLink disabled={qPage === 'about'} href={`/tournament/${id}/qualification/${cid}`}>
          About
        </NavLink>
      </NavItem>
      {!isEmpty(qualification.stages) && (
        <NavItem>
          <NavLink disabled={qPage === 'matches'} href={`/tournament/${id}/qualification/${cid}/matches`}>
            Matches
          </NavLink>
        </NavItem>
      )}
      {(hasAnyGroups(qualification) || hasMdGroups(qualification) > 1) && (
        <NavItem>
          <NavLink disabled={qPage === 'groups'} href={`/tournament/${id}/qualification/${cid}/groups`}>
            Groups
          </NavLink>
        </NavItem>
      )}
      {hasMdGroups(qualification) === 1 && (
        <NavItem>
          <NavLink disabled={qPage === 'standings'} href={`/tournament/${id}/qualification/${cid}/standings`}>
            Standings
          </NavLink>
        </NavItem>
      )}
    </Nav>
  )
}

class QualificationHeader extends React.Component {
  render() {
    const { qState, query } = this.props
    const { qualification, competition } = qState
    const { cid } = query
    const logoSrc = `/images/logos/${cid}.png`
    // console.log('qTournamnent', qTournament)
    return (
      <React.Fragment>
        <Row className="mt-3 text-center">
          <Col lg="2" md="2" sm="3" className="mt-3 mb-2">
            <img src={logoSrc} alt={cid} title={cid} className="img-fluid" />
          </Col>
          <Col lg="10" md="9" sm="9">
            <h1 className={`text-center mt-3 mb-2 ${getTournamentTitleFont(competition)}`} style={{ color: competition.details.color }}>
              {qualification.details.name}
            </h1>
            {qualification.details.start_date && moment(qualification.details.start_date).format('MMMM D, YYYY')} &mdash;&nbsp;
            {qualification.details.end_date && moment(qualification.details.end_date).format('MMMM D, YYYY')}
            <PageLinks query={query} qualification={qualification} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default QualificationHeader
