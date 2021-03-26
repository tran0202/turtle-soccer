import React from 'react'
import Competitions from './data/Competitions.json'
import { getTournamentArray } from './core/DataHelper'
import Page from './core/Page'
import { Container, Row, Col } from 'reactstrap'

class CompetitionsApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Competitions - Turtle Soccer'

    this.state = { competitions: [] }
    this.tournamentCount = 5
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  getTournaments = (comp) => {
    if (!comp) return
    const randomTournaments = []
    const compTournaments = getTournamentArray().filter((t) => t.tournament_type_id === comp.id)
    if (compTournaments.length <= this.tournamentCount) {
      return compTournaments
    }
    while (randomTournaments.length < this.tournamentCount) {
      const randomIndex = this.getRandomInt(compTournaments.length)
      const found = randomTournaments.find((rt) => rt.id === compTournaments[randomIndex].id)
      if (found === undefined) {
        randomTournaments.push(compTournaments[randomIndex])
      }
    }
    // console.log('randomTournaments', randomTournaments)
    return randomTournaments
  }

  getCompetitions = (compArray) => {
    return compArray.filter((c) => c.id !== 'WCQ')
  }

  getData = () => {
    const filtered = this.getCompetitions(Competitions)
    filtered.forEach((c) => {
      c.tournaments = this.getTournaments(c)
    })
    this.setState({ competitions: filtered })
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    window.competitionsStore = this.state
  }

  render() {
    const _competitions = this.state.competitions
    return (
      <Page>
        <Container>
          <h1 className="h1-ff5 text-center mt-3 mb-3">Competitions</h1>
          {_competitions &&
            _competitions.map((c) => {
              return (
                <Row className="mt-3 mb-3 text-left conf-box" key={c.id}>
                  <Col sm="12" md="2" className="mb-2">
                    {c.trophy_filename && (
                      <img src={`/images/${c.logo_path}/${c.trophy_filename}`} alt={`${c.name}`} title={`${c.name}`} className="comp-logo" />
                    )}
                  </Col>
                  <Col sm="12" md="10">
                    <Row>
                      <Col xs="12">
                        <h2>{c.name}</h2>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">{c.description && c.description.map((d) => <p key={d}>{d}</p>)}</Col>
                    </Row>
                  </Col>
                  <Col sm="12" md="12">
                    <section className="tournaments section-bg">
                      <div className="container">
                        <div className="row">
                          {c.tournaments &&
                            c.tournaments.map((t) => (
                              <div key={t.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 text-center" data-aos="fade-up">
                                <div className="tournament-box">
                                  <a href={`/soccer/tournament/${t.id}`}>
                                    <img
                                      src={`/images/${c.logo_path}/${t.details.logo_filename}`}
                                      alt={t.name}
                                      title={t.name}
                                      className="card-img-top-height-100 mx-auto"
                                    />
                                  </a>
                                  <a href={`/soccer/tournament/${t.id}`}>
                                    <p className="text-center font-bold mt-3">{t.name}</p>
                                  </a>
                                </div>
                              </div>
                            ))}
                          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 text-center" data-aos="fade-up">
                            <div className="tournament-box">
                              <a href={`/soccer/competition/${c.id}`}>
                                <i className="icofont-football card-img-top-height-100 mx-auto"></i>
                              </a>
                              <a href={`/soccer/competition/${c.id}`}>
                                <p className="text-center font-bold mt-3">
                                  More <br></br>
                                  {c.name}
                                </p>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </Col>
                </Row>
              )
            })}
        </Container>
      </Page>
    )
  }
}

export default CompetitionsApp
