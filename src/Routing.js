import React from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import App from './App'
import ConfederationsApp from './ConfederationsApp'
import CompetitionsApp from './CompetitionsApp'
import AssociationsApp from './AssociationsApp'
import CompetitionApp from './competition/CompetitionApp'
import TournamentApp from './tournament/TournamentApp'

function TournamentRoute(props) {
  const page = props.page ? props.page : 'about'
  const qPage = props.qPage ? props.qPage : 'about'
  const { id, cid } = useParams()
  const _cid = cid ? cid : 'QUALIFIED'
  const query = { id, cid: _cid, page, qPage }
  return <TournamentApp query={query} />
}

function CompetitionRoute(props) {
  const page = props.page ? props.page : 'about'
  const { id } = useParams()
  const query = { id, page }
  return <CompetitionApp query={query} />
}

export default function Routing() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<App />} />
        <Route exact path="/confederations" children={<ConfederationsApp />} />
        <Route exact path="/competitions" children={<CompetitionsApp />} />
        <Route exact path="/competition/:id" children={<CompetitionRoute />} />
        <Route path="/competition/:id/alltimestandings" children={<CompetitionRoute page="alltimestandings" />} />
        <Route exact path="/associations" children={<AssociationsApp />} />
        <Route exact path="/tournament/:id" children={<TournamentRoute />} />
        <Route path="/tournament/:id/matches" children={<TournamentRoute page="matches" />} />
        <Route path="/tournament/:id/groups" children={<TournamentRoute page="groups" />} />
        <Route path="/tournament/:id/finalstandings" children={<TournamentRoute page="finalstandings" />} />
        <Route exact path="/tournament/:id/qualification" children={<TournamentRoute page="qualification" />} />
        <Route exact path="/tournament/:id/qualification/:cid" children={<TournamentRoute page="qualification" />} />
        <Route path="/tournament/:id/qualification/:cid/matches" children={<TournamentRoute page="qualification" qPage="matches" />} />
        <Route path="/tournament/:id/qualification/:cid/groups" children={<TournamentRoute page="qualification" qPage="groups" />} />
        <Route path="/tournament/:id/qualification/:cid/standings" children={<TournamentRoute page="qualification" qPage="standings" />} />
      </Switch>
    </Router>
  )
}
