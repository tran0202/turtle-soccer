import React from 'react'
import Page from './core/Page'
import { Container } from 'reactstrap'

class App extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer'
  }

  render() {
    return (
      <Page>
        <Container>
          <section id="hero">
            <div className="hero-container">
              <div id="heroCarousel" className="carousel slide carousel-fade" data-ride="carousel">
                <ol className="carousel-indicators" id="hero-carousel-indicators"></ol>

                <div className="carousel-inner" role="listbox">
                  <div
                    className="carousel-item active"
                    style={{
                      backgroundImage: "url('/images/slide/soccer-ts1475731972.jpg')",
                    }}
                  >
                    <div className="carousel-container">
                      <div className="carousel-content container">
                        <h2 className="animated fadeInDown h2-ff8">
                          Welcome to <span>Turtle Soccer</span>
                        </h2>
                        <p className="animated fadeInUp">It's known as football for the rest of the world. In America, we call it Soccer!</p>
                        <a href="/soccer" className="btn-get-started animated fadeInUp scrollto">
                          Tournaments
                        </a>
                      </div>
                    </div>
                  </div>

                  <div
                    className="carousel-item"
                    style={{
                      backgroundImage: "url('/images/slide/France_champion_of_the_Football_World_Cup_Russia_2018.jpg')",
                    }}
                  >
                    <div className="carousel-container">
                      <div className="carousel-content container">
                        <h2 className="animated fadeInDown h2-ff8">
                          Welcome to <span>Turtle Soccer</span>
                        </h2>
                        <p className="animated fadeInUp">
                          Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos
                          quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                        </p>
                        <a href="/soccer" className="btn-get-started animated fadeInUp scrollto">
                          Tournaments
                        </a>
                      </div>
                    </div>
                  </div>

                  <div
                    className="carousel-item"
                    style={{
                      backgroundImage: "url('/images/slide/Brazil_mens_football_team_2016_Olympics.jpg')",
                    }}
                  >
                    <div className="carousel-container">
                      <div className="carousel-content container">
                        <h2 className="animated fadeInDown h2-ff8">
                          Welcome to <span>Turtle Soccer</span>
                        </h2>
                        <p className="animated fadeInUp">
                          Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia
                          ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto.
                        </p>
                        <a href="/tennis" className="btn-get-started animated fadeInUp scrollto">
                          Tournaments
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <a className="carousel-control-prev" href="#heroCarousel" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#heroCarousel" role="button" data-slide="next">
                  <span className="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </section>
        </Container>
      </Page>
    )
  }
}

export default App
