import React from 'react'
import Confederations from './data/Confederations.json'
import Competitions from './data/Competitions.json'
import { setCompetitionDetails, setCompetitionConfig } from './core/DataHelper'
import Page from './core/Page'
import { Container, Row, Col } from 'reactstrap'

class ConfederationsApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Confederations - Turtle Soccer'

    this.state = { confederations: [] }
  }

  setConfederationDetails = (conf) => {
    conf.details = { descriptions: conf.descriptions, logo_filename: conf.logo_filename, name: conf.name }
    delete conf.descriptions
    delete conf.logo_filename
    delete conf.name
    // console.log('conf', conf)
  }

  getCompetitions = (conf) => {
    const compArray = []
    if (conf.competitions) {
      conf.competitions.forEach((c) => {
        const comp = Competitions.find((x) => x.id === c.id)
        setCompetitionDetails(comp)
        setCompetitionConfig(comp)
        compArray.push(comp)
      })
      conf.competitions = compArray
    }
  }

  getData = () => {
    Confederations.forEach((c) => {
      this.setConfederationDetails(c)
      c && this.getCompetitions(c)
    })
    this.setState({ confederations: Confederations })
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    window.confederationsStore = this.state
  }

  render() {
    return (
      <Page>
        <Container>
          <h1 className="h1-ff5 text-center mt-3 mb-3">FIFA &amp; 6 Regional Confederations</h1>
          {Confederations.map((c) => {
            return (
              <Row className="mt-3 mb-3 text-left conf-box" key={c.id}>
                <Col sm="12" md="2" className="mb-2">
                  {c.details && c.details.logo_filename && (
                    <img src={`/images/logos/${c.details.logo_filename}`} alt={`${c.details.name}`} title={`${c.details.name}`} className="conf-logo" />
                  )}
                </Col>
                <Col sm="12" md="10">
                  <Row>
                    <Col xs="12">{c.details && c.details.descriptions && c.details.descriptions.map((d) => <p key={d}>{d}</p>)}</Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <h2>Competitions</h2>
                      <ul className="list-group">
                        {c.competitions &&
                          c.competitions.map((x) => (
                            <li className="list-group-item" key={x.id} style={{ color: x.details && x.details.color ? x.details.color : '' }}>
                              {x.details && x.details.name ? x.details.name : ''}
                            </li>
                          ))}
                      </ul>
                    </Col>
                    <Col xs="12"></Col>
                  </Row>
                </Col>
              </Row>
            )
          })}
        </Container>
      </Page>
    )
  }
}

export default ConfederationsApp
