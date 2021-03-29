import React from 'react'
import Competitions from '../data/Competitions.json'
import TournamentDataCurrent from '../data/tournamentData/TournamentDataCurrent.json'
import Page from '../core/Page'
import { Style } from '../core/Utilities'
import CompetitionAbout from './CompetitionAbout'
import AlltimeStandings from './AlltimeStandings'
import {
  setCompetitionDetails,
  setCompetitionConfig,
  setTournamentDetails,
  setTournamentConfig,
  getCurrentTournament,
  getTournamentArray,
  getTournamentDataArray,
} from '../core/DataHelper'
import { getTournamentTitleFont } from '../core/Helper'
import { Row, Col, Nav, NavItem, NavLink, Container } from 'reactstrap'

const CompHeaderLinks = (props) => {
  const { query } = props
  const { page, id } = query
  return (
    <Nav className="justify-content-center">
      <NavItem>
        <NavLink disabled={page === 'about'} href={`/competition/${id}`}>
          About
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled={page === 'alltimestandings'} href={`/competition/${id}/alltimestandings`}>
          All-time Standings
        </NavLink>
      </NavItem>
    </Nav>
  )
}

class CompetitionApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      competition: {},
    }
  }

  getTournamentData = (id) => {
    const td = getTournamentDataArray().find((td) => td.id === id)
    if (td) {
      return td
    } else if (id === getCurrentTournament().tournament) {
      return TournamentDataCurrent
    } else {
      console.log("Can't find tournament", id)
      return {}
    }
  }

  getCompetition = () => {
    const comp = Competitions.find((c) => c.id === this.props.query.id)
    if (comp) {
      setCompetitionDetails(comp)
      setCompetitionConfig(comp)
      this.setState({ competition: comp })
      const ta = getTournamentArray().filter((t) => t.competition_id === this.props.query.id)
      if (ta) {
        ta.forEach((t) => {
          setTournamentDetails(t)
          setTournamentConfig(t, comp)
          const td = this.getTournamentData(t.id)
          t.stages = td.stages ? td.stages : []
          t.leagues = td.leagues ? td.leagues : []
        })
        this.setState({ competition: { ...comp, tournaments: ta } })
      } else {
        console.log('Tournaments error', ta)
      }
    } else {
      console.log('Competition error', comp)
    }
  }

  getData = () => {
    this.getCompetition()
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    const { competition } = this.state
    document.title = competition.details ? `${competition.details.name} - Turtle Soccer` : 'Turtle Soccer'
    window.competitionStore = this.state
  }

  render() {
    const { competition } = this.state
    const { query } = this.props
    const { page } = query
    return (
      <Page>
        <Style competition={competition} />
        <Container>
          <Row className="mt-3 text-center">
            <Col>
              <h1
                className={`text-center mt-3 mb-2 ${getTournamentTitleFont(competition)}`}
                style={{ color: competition.details ? competition.details.color : '' }}
              >
                {competition.details ? competition.details.name : ''}
              </h1>
              <CompHeaderLinks query={query} />
            </Col>
          </Row>
          {page === 'about' && <CompetitionAbout competition={competition} />}
          {page === 'alltimestandings' && <AlltimeStandings competition={competition} />}
        </Container>
      </Page>
    )
  }
}

export default CompetitionApp
