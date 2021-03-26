import React from 'react'
import { Container, Row, Col } from 'reactstrap'

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.turtleLogo = '/images/logos/Turtle_Soccer_logo.png'
  }
  render() {
    return (
      <React.Fragment>
        <header id="header">
          <Container>
            <Row>
              <Col sm="7" md="5">
                <div className="logo float-left">
                  <a href="/">
                    <img src={this.turtleLogo} alt="Turtle Soccer" className="img-fluid" title="Turtle Soccer" />
                  </a>
                </div>
              </Col>
              <Col md="7">
                <nav className="nav-menu float-right d-none d-md-block mt-3">
                  <ul>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/competitions">Competitions</a>
                    </li>
                    <li>
                      <a href="/confederations">Confederations</a>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
          </Container>
        </header>

        {this.props.children}

        <button className="back-to-top">
          <i className="icofont-simple-up"></i>
        </button>

        <footer id="footer">
          <div className="container mt-5 mb-3">
            <div className="copyright">
              &copy; Copyright <span className="font-bold">Turtle Soccer</span>. All Rights Reserved.
            </div>
          </div>
        </footer>
      </React.Fragment>
    )
  }
}

export default Page
