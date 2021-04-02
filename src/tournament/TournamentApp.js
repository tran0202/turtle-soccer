import React from 'react'
import Competitions from '../data/Competitions.json'
import TournamentDataCurrent from '../data/tournamentData/TournamentDataCurrent.json'
import QualificationTournamentDataCurrent from '../data/qualTournamentData/QualificationTournamentDataCurrent.json'
import Page from '../core/Page'
import { Style } from '../core/Utilities'
import Header from './Header'
import About from './About'
// import Matches from './Matches'
// import Groups from './Groups'
// import FinalStandings from './FinalStandings'
// import Qualification from './Qualification'
import {
  getCurrentTournament,
  getTournamentArray,
  getTournamentDataArray,
  getQualificationTournamentArray,
  getQualificationTournamentDataArray,
  setCompetitionDetails,
  setTournamentDetails,
  setTournamentConfig,
} from '../core/DataHelper'
import { Container } from 'reactstrap'

class TournamentApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tournament: {
        config: {},
        details: {
          host: [],
          final_host: [],
          final_standings: {},
          awards: {
            golden_boot: [],
            silver_boot: [],
            bronze_boot: [],
            golden_ball: [],
            golden_glove: [],
            best_defender: [],
            best_midfielder: [],
            best_forward: [],
            fair_play_team: [],
          },
          qualified: [],
        },
        leagues: [],
        next_tournament: {},
        previous_tournament: {},
        qualification: {},
        stages: [],
      },
      competition: { config: {}, details: {} },
    }
  }

  getSortedTournamentArray = (competition_id) => {
    const ta = getTournamentArray().filter((t) => t.competition_id === competition_id || (t.config && t.config.competition_id === competition_id))
    ta.sort((a, b) => {
      return a > b ? 1 : -1
    })
    return ta
  }

  getPreviousTournament = (competition_id, current_id) => {
    const ta = this.getSortedTournamentArray(competition_id)
    const current_tournament_index = ta.findIndex((t) => t.id === current_id)
    return current_tournament_index !== -1 && current_tournament_index !== 0
      ? { id: ta[current_tournament_index - 1].id, year: ta[current_tournament_index - 1].year }
      : {}
  }

  getNextTournament = (competition_id, current_id) => {
    const ta = this.getSortedTournamentArray(competition_id)
    const current_tournament_index = ta.findIndex((t) => t.id === current_id)
    return current_tournament_index !== -1 && current_tournament_index !== ta.length - 1
      ? { id: ta[current_tournament_index + 1].id, year: ta[current_tournament_index + 1].year }
      : {}
  }

  getCompetition = (competition_id) => {
    const comp = Competitions.find((c) => c.id === competition_id)
    if (comp) {
      setCompetitionDetails(comp)
      this.setState({ competition: comp })
    } else {
      console.log("Can't find competition", comp)
    }
  }

  getQualificationTournamentData = () => {
    const qtd = getQualificationTournamentDataArray().find((qtd) => qtd.id === `${this.props.query.id}_${this.props.query.cid}`)
    if (qtd) {
      return qtd
    } else if (`${this.props.query.id}_${this.props.query.cid}` === getCurrentTournament().qualificationTournament) {
      return QualificationTournamentDataCurrent
    } else {
      console.log("Can't find qualification tournament data", qtd)
      return {}
    }
  }

  getQualificationTournament = () => {
    const qta = getQualificationTournamentArray().filter((qt) => qt.tournament_id === this.props.query.id)
    const confed_names = []
    qta.forEach((qt) => {
      confed_names.push(qt.confederation_id)
    })
    const qt = getQualificationTournamentArray().find((qt) => qt.tournament_id === this.props.query.id && qt.confederation_id === this.props.query.cid)
    // console.log('qt', qt)
    if (qt) {
      setTournamentDetails(qt)
      setTournamentConfig(qt)
    }
    const existed = qt ? true : false
    return { existed, ...qt, stages: this.getQualificationTournamentData().stages || [], confed_names }
  }

  getTournamentData = () => {
    const td = getTournamentDataArray().find((td) => td.id === this.props.query.id)
    if (td) {
      return td
    } else if (this.props.query.id === getCurrentTournament().tournament) {
      return TournamentDataCurrent
    } else {
      console.log("Can't find tournament data", this.props.query.id)
      return {}
    }
  }

  getTournament = () => {
    const t = getTournamentArray().find((t) => t.id === this.props.query.id)
    if (t) {
      setTournamentDetails(t)
      setTournamentConfig(t)
      // console.log('Tournament', t)
      this.setState({
        tournament: {
          ...t,
          previous_tournament: this.getPreviousTournament(t.config.competition_id, this.props.query.id),
          next_tournament: this.getNextTournament(t.config.competition_id, this.props.query.id),
          stages: this.getTournamentData().stages || [],
          leagues: this.getTournamentData().leagues || [],
          qualification: this.getQualificationTournament(),
        },
      })
      this.getCompetition(t.config.competition_id)
    } else {
      console.log('Tournament error', t)
    }
  }

  getData = () => {
    this.getTournament()
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    document.title = `${this.state.tournament.details.name} - Turtle Soccer`
    window.tournamentStore = this.state
  }

  render() {
    const { tournament, competition } = this.state
    const { query } = this.props
    const { page } = query
    return (
      <Page>
        <Style competition={competition} />
        <Container>
          <Header state={this.state} query={query} />
          {page === 'about' && <About tournament={tournament} />}
          {/* {page === 'matches' && <Matches tournament={tournament} tournamentType={tournamentType} />}
              {page === 'groups' && <Groups tournament={tournament} tournamentType={tournamentType} />}
              {page === 'finalstandings' && <FinalStandings tournament={tournament} tournamentType={tournamentType} />}
              {page === 'qualification' && <Qualification tournament={tournament} tournamentType={tournamentType} query={query} />} */}
        </Container>
      </Page>
    )
  }
}

export default TournamentApp
