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
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </Container>
      </Page>
    )
  }
}

export default App
