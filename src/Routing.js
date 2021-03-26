import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from './App'
import ConfederationsApp from './ConfederationsApp'
// import CompetitionApp from './soccer/CompetitionApp'
// import TournamentApp from './soccer/TournamentApp'

// function TournamentRoute(props) {
//   const page = props.page ? props.page : 'about'
//   const qPage = props.qPage ? props.qPage : 'about'
//   const { id, cid } = useParams()
//   const _cid = cid ? cid : 'QUALIFIED'
//   const query = { id, cid: _cid, page, qPage }
//   return <TournamentApp query={query} />
// }

// function CompetitionRoute(props) {
//   const page = props.page ? props.page : 'about'
//   const { id } = useParams()
//   const query = { id, page }
//   return <CompetitionApp query={query} />
// }

export default function Routing() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<App />} />
        <Route exact path="/confederations" children={<ConfederationsApp />} />
        {/* <Route exact path="/soccer/competition/:id" children={<CompetitionRoute />} />
        <Route path="/soccer/competition/:id/alltimestandings" children={<CompetitionRoute page="alltimestandings" />} />
        <Route exact path="/soccer/tournament/:id" children={<TournamentRoute />} />
        <Route path="/soccer/tournament/:id/matches" children={<TournamentRoute page="matches" />} />
        <Route path="/soccer/tournament/:id/groups" children={<TournamentRoute page="groups" />} />
        <Route path="/soccer/tournament/:id/finalstandings" children={<TournamentRoute page="finalstandings" />} />
        <Route exact path="/soccer/tournament/:id/qualification" children={<TournamentRoute page="qualification" />} />
        <Route exact path="/soccer/tournament/:id/qualification/:cid" children={<TournamentRoute page="qualification" />} />
        <Route path="/soccer/tournament/:id/qualification/:cid/matches" children={<TournamentRoute page="qualification" qPage="matches" />} />
        <Route path="/soccer/tournament/:id/qualification/:cid/groups" children={<TournamentRoute page="qualification" qPage="groups" />} />
        <Route path="/soccer/tournament/:id/qualification/:cid/standings" children={<TournamentRoute page="qualification" qPage="standings" />} /> */}
      </Switch>
    </Router>
  )
}
