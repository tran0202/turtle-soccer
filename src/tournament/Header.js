import React from 'react'
import { getAllRoundRobinStages, getRoundRobinLeagueMdStages, getTournamentTitleFont } from '../core/Helper'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'
import { isEmpty } from 'lodash'

const HeaderLinks = (props) => {
  const { state, query } = props
  const { page } = query
  const { tournament, competition } = state
  const { id, config, qualification, stages, leagues, details } = tournament
  const { previous_tournament, next_tournament } = details
  const showGroupsLink =
    (!config.multi_league && !isEmpty(getAllRoundRobinStages(stages))) || (config.multi_league && !isEmpty(getRoundRobinLeagueMdStages(leagues)))
  return (
    <Nav className="justify-content-center">
      {qualification.config.existed && config.active && (
        <NavItem>
          <NavLink disabled={page === 'qualification'} href={`/tournament/${id}/qualification`}>
            Qualification
          </NavLink>
        </NavItem>
      )}
      {(!isEmpty(stages) || !isEmpty(leagues)) && (
        <React.Fragment>
          <NavItem>
            <NavLink disabled={page === 'matches'} href={`/tournament/${id}/matches`}>
              Matches
            </NavLink>
          </NavItem>
          {showGroupsLink && (
            <NavItem>
              <NavLink disabled={page === 'groups'} href={`/tournament/${id}/groups`}>
                Groups
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink disabled={page === 'finalstandings'} href={`/tournament/${id}/finalstandings`}>
              Final standings
            </NavLink>
          </NavItem>
        </React.Fragment>
      )}
      {qualification.config.existed && !config.active && (
        <NavItem>
          <NavLink disabled={page === 'qualification'} href={`/tournament/${id}/qualification`}>
            Qualification
          </NavLink>
        </NavItem>
      )}
      {previous_tournament.year && (
        <NavItem>
          <NavLink href={`/tournament/${previous_tournament.id}`}>
            <i className="icofont-long-arrow-left"></i>
            {previous_tournament.year}
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink href={`/competition/${competition.id}`}>More {competition.details.name}</NavLink>
      </NavItem>
      {next_tournament.year && (
        <NavItem>
          <NavLink href={`/tournament/${next_tournament.id}`}>
            {next_tournament.year}
            <i className="icofont-long-arrow-right"></i>
          </NavLink>
        </NavItem>
      )}
    </Nav>
  )
}

class Header extends React.Component {
  render() {
    const { state, query } = this.props
    const { tournament, competition } = state
    const { details } = tournament
    const {
      name,
      logo_filename,
      color,
      start_date,
      end_date,
      start_league_date,
      end_league_date,
      start_final_date,
      end_final_date,
      start_qualifying_date,
      end_qualifying_date,
      start_competition_date,
      end_competition_date,
    } = details
    return (
      <Row className="mt-3 text-center">
        <Col lg={{ size: 2, offset: 1 }} md={{ size: 2 }} sm="3" className="mt-3 mb-2">
          <a href={`/tournament/${tournament.id}`}>
            <img className="card-img-top-height-100" src={`/images/${competition.config.logo_path}/${logo_filename}`} alt={name} title={name} />
          </a>
        </Col>
        <Col lg="9" md="10" sm="9">
          <h1 className={`text-center mt-3 mb-2 ${getTournamentTitleFont(competition)}`} style={{ color: color }}>
            {name}
          </h1>
          {start_date && (
            <React.Fragment>
              {moment(start_date).format('MMMM D, YYYY')} &mdash; {moment(end_date).format('MMMM D, YYYY')}
            </React.Fragment>
          )}
          {start_league_date && (
            <React.Fragment>
              <b>League:</b> {moment(start_league_date).format('MMMM D, YYYY')} &mdash; {moment(end_league_date).format('MMMM D, YYYY')}
              &nbsp;&nbsp;<i className="icofont-football-alt"></i>&nbsp;&nbsp;
            </React.Fragment>
          )}
          {start_final_date && (
            <React.Fragment>
              <b>Finals:</b> {moment(start_final_date).format('MMMM D, YYYY')} &mdash; {moment(end_final_date).format('MMMM D, YYYY')}
            </React.Fragment>
          )}
          {start_qualifying_date && (
            <React.Fragment>
              <b>Qualifying:</b> {moment(start_qualifying_date).format('MMMM D, YYYY')} &mdash; {moment(end_qualifying_date).format('MMMM D, YYYY')}
              &nbsp;&nbsp;<i className="icofont-football-alt"></i>&nbsp;&nbsp;
            </React.Fragment>
          )}
          {start_competition_date && (
            <React.Fragment>
              <b>Competition:</b> {moment(start_competition_date).format('MMMM D, YYYY')} &mdash; {moment(end_competition_date).format('MMMM D, YYYY')}
            </React.Fragment>
          )}
          <HeaderLinks state={state} query={query} />
        </Col>
      </Row>
    )
  }
}

export default Header
