import React from 'react'
import Nations from './data/Nations.json'
import { setNationDetails } from './core/DataHelper'
import Page from './core/Page'
import { Container, Row, Col } from 'reactstrap'

class AssociationsApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Associations - Turtle Soccer'

    this.state = { associations: [] }
  }

  getData = () => {
    Nations.forEach((n) => {
      setNationDetails(n)
    })
    const filtered = Nations.filter((n) => n.parent_nation_id === '' && n.confederation_id !== undefined)
    this.setState({ associations: filtered })
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    window.associationsStore = this.state
  }

  render() {
    const _associations = this.state.associations
    return (
      <Page>
        <Container>
          <h1 className="h1-ff5 text-center mt-3 mb-3">National Associations</h1>
          <Row className="mt-3 mb-3 text-left conf-box">
            <Col sm="12" md="12">
              <section className="associations section-bg">
                <div className="container">
                  <div className="row">
                    {_associations &&
                      _associations.map((a) => (
                        <div key={a.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 text-center" data-aos="fade-up">
                          <div className="associations-box">
                            {a.details && a.details.flag_filename && (
                              <img
                                src={`/images/flags/${a.details.flag_filename}`}
                                alt={a.details.name}
                                title={a.details.name}
                                className="flag-xl mx-auto"
                                style={{ maxWidth: a.details && a.details.flag_max_width ? a.details.flag_max_width : '' }}
                              />
                            )}
                            <p className="text-center mt-3">
                              <span className="font-bold">
                                {a.id} - {a.details.name}
                              </span>
                              <br />({a.confederation_id})
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </section>
            </Col>
          </Row>
        </Container>
      </Page>
    )
  }
}

export default AssociationsApp
