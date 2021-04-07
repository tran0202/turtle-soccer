import React from 'react'
import About from './About'
import QualificationHeader from './QualificationHeader'
import Matches from './matches/Matches'
import Groups from './groups/Groups'
import { Nav, NavItem, NavLink, Row } from 'reactstrap'

const ConfederationLinks = (props) => {
  const { query, config } = props
  const { id, cid } = query
  return (
    <Nav className="justify-content-center qualification-confed-links">
      {config.confed_names.map((confed) => {
        const _confed = confed !== 'QUALIFIED' ? confed : ''
        return (
          <NavItem key={confed}>
            <NavLink disabled={confed === cid} href={`/tournament/${id}/qualification/${_confed}`}>
              {confed === 'QUALIFIED' ? '**' : ''}
              {confed}
              {confed === 'QUALIFIED' ? '**' : ''}
            </NavLink>
          </NavItem>
        )
      })}
    </Nav>
  )
}

const Qualification = (props) => {
  const { state, query } = props
  const { tournament, competition } = state
  const { cid, qPage } = query
  const { qualification } = tournament
  const qState = { qualification, competition }
  const qState2 = { tournament: qualification, competition }
  // console.log('qualification', qualification)

  return (
    <React.Fragment>
      <Row className="mt-1"></Row>
      {qualification.config.existed && (
        <React.Fragment>
          <ConfederationLinks query={query} config={qualification.config} />
          {cid !== 'QUALIFIED' && <QualificationHeader qState={qState} query={query} />}
          {qPage === 'about' && <About tournament={qualification} />}
          {qPage === 'matches' && <Matches state={qState2} />}
          {(qPage === 'groups' || qPage === 'standings') && <Groups state={qState2} />}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Qualification
