import React, { useState } from 'react'
// import RoundRobin from './RoundRobin'
// import RoundRobinMatchDay from './RoundRobinMatchDay'
// import RoundRobinLeagueMatchDay from './RoundRobinLeagueMatchDay'
// import Knockout from './Knockout'
// import Knockout2Legged from './Knockout2Legged'
// import KnockoutMultiple2Legged from './KnockoutMultiple2Legged'
import { getTournamentConfig, getTournamentTypeConfig, getDefaultStageTab, getDefaultMdTab } from '../core/Helper'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

const collectLeagueMatchdays = (leagues) => {
  if (!leagues) return null
  let matchdays = []
  leagues.forEach((l) => {
    l.stages &&
      l.stages.forEach((s) => {
        if (s.type === 'roundrobinleaguematchday') {
          s.groups &&
            s.groups.forEach((g) => {
              g.matchdays &&
                g.matchdays.forEach((md) => {
                  const _matches = []
                  md.matches &&
                    md.matches.forEach((m) => {
                      m.league_name = l.name
                      m.group = g.name
                      _matches.push({ ...m })
                    })
                  const _md = matchdays.find((x) => x.name === md.name)
                  if (_md === undefined) {
                    matchdays.push({ name: md.name, type: s.type, matches: _matches })
                  } else {
                    _md.matches = _md.matches.concat(_matches)
                  }
                })
            })
        } else if (s.type === 'knockout' || s.type === 'knockout2legged') {
          const _md = matchdays.find((x) => x.name === s.name)
          if (_md === undefined) {
            matchdays.push({ name: s.name, type: s.type, stage: s })
          }
        }
      })
  })
  // console.log('matchdays', matchdays)
  return matchdays
}

const Matches = (props) => {
  const { state } = props
  const { tournament, competition } = state
  const { stages, leagues } = tournament
  const stageArray = tournament.config.multi_league ? collectLeagueMatchdays(leagues) : stages
  // const config = { ...getTournamentConfig(tournament), ...getTournamentTypeConfig(tournamentType) }
  const defaultTab = !isEmpty(stages) ? getDefaultStageTab(stages) : 'Group-Stage' // && tournament.config.multi_league ? getDefaultMdTab(leagues) : getDefaultStageTab(stages)
  console.log('tournament', tournament)
  console.log('stages', stages)
  console.log('defaultTab', defaultTab)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {!isEmpty(stageArray) && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {stageArray.map((s) => (
              <NavItem key={s.details.name}>
                {s.details.name && (
                  <NavLink
                    className={classnames({ active: activeTab === `${s.details.name.replace(' ', '-')}` })}
                    onClick={() => {
                      toggle(`${s.details.name.replace(' ', '-')}`)
                    }}
                  >
                    {s.details.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            Tab
            {/* {stages.map((stage) => (
              <React.Fragment key={stage.name}>
                {stage.name && (
                  <TabPane tabId={stage.name.replace(' ', '-')}>
                    {(stage.type === 'roundrobin' || stage.type === 'allocation') && <RoundRobin stage={stage} config={config} />}
                    {stage.type === 'roundrobinmatchday' && <RoundRobinMatchDay stage={stage} config={config} />}
                    {stage.type === 'knockout' && <Knockout stage={stage} config={config} />}
                    {stage.type === 'knockout2legged' && <Knockout2Legged stage={stage} config={config} />}
                    {stage.type === 'knockoutmultiple2legged' && <KnockoutMultiple2Legged stage={stage} config={config} />}
                  </TabPane>
                )}
              </React.Fragment>
            ))} */}
          </TabContent>
        </React.Fragment>
      )}
      {/* {matchdays && matchdays.length > 0 && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {matchdays.map((md) => (
              <NavItem key={md.name}>
                {md.name && (
                  <NavLink
                    className={classnames({ active: activeTab === `${md.name.replace(' ', '-')}` })}
                    onClick={() => {
                      toggle(`${md.name.replace(' ', '-')}`)
                    }}
                  >
                    {md.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {matchdays.map((md) => (
              <React.Fragment key={md.name}>
                {md.name && (
                  <TabPane tabId={md.name.replace(' ', '-')}>
                    {md.type === 'roundrobinleaguematchday' && <RoundRobinLeagueMatchDay matchday={md} config={config} />}
                    {md.type === 'knockout' && <Knockout stage={md.stage} config={config} />}
                    {md.type === 'knockout2legged' && <Knockout2Legged stage={md.stage} config={config} />}
                  </TabPane>
                )}
              </React.Fragment>
            ))}
          </TabContent>
        </React.Fragment>
      )} */}
    </React.Fragment>
  )
}

export default Matches
