import React from 'react'
import About from './About'
import QualificationHeader from './QualificationHeader'
// import Matches from './Matches'
// import Groups from './Groups'
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
  // console.log('qualification', qualification)

  return (
    <React.Fragment>
      <Row className="mt-1"></Row>
      {qualification.config.existed && (
        <React.Fragment>
          <ConfederationLinks query={query} config={qualification.config} />
          {cid !== 'QUALIFIED' && <QualificationHeader qState={qState} query={query} />}
          {qPage === 'about' && <About tournament={qualification} />}
          {/* {qualification.existed && (
            <React.Fragment>
              {cid !== 'QUALIFIED' && <QualificationHeader qTournament={qualification} query={query} tournamentType={tournamentType} />}
              {qPage === 'about' && <About tournament={qualification} tournamentType={tournamentType} />}
              {qPage === 'matches' && <Matches tournament={qualification} tournamentType={tournamentType} />}
              {(qPage === 'groups' || qPage === 'standings') && <Groups tournament={qualification} tournamentType={tournamentType} />}
            </React.Fragment>
          )} */}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Qualification
