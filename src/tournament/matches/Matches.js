import React, { useState } from 'react'
import RoundRobin from './RoundRobin'
import RoundRobinMatchDay from './RoundRobinMatchDay'
import RoundRobinLeagueMatchDay from './RoundRobinLeagueMatchDay'
import Knockout from './Knockout'
import { getDefaultStageTab, getDefaultMdTab } from '../../core/Helper'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

const collectLeagueMdStages = (leagues, tournament) => {
  if (!leagues) return null
  const stageArray = []
  leagues.forEach((l) => {
    l.stages &&
      l.stages.forEach((s) => {
        if (s.config.type === 'roundrobinleaguematchday') {
          s.groups &&
            s.groups.forEach((g) => {
              g.matchdays &&
                g.matchdays.forEach((md) => {
                  const _matches = []
                  md.matches &&
                    md.matches.forEach((m) => {
                      m.league_name = l.details.name
                      m.group = g.details.name
                      _matches.push({ ...m })
                    })
                  const _md = stageArray.find((x) => x.details.name === md.details.name)
                  if (_md === undefined) {
                    stageArray.push({ details: { name: md.details.name }, config: { type: s.config.type }, matches: _matches })
                  } else {
                    _md.matches = _md.matches.concat(_matches)
                  }
                })
            })
        } else if (s.config.type === 'knockout' || s.config.type === 'knockout2legged') {
          const _md = stageArray.find((x) => x.details.name === s.details.name)
          if (_md === undefined) {
            stageArray.push(s)
          }
        }
      })
  })
  tournament.matchdays = stageArray.filter((md) => md.config.type === 'roundrobinleaguematchday')
  return stageArray
}

const collectMdStages = (stages) => {
  if (!stages) return null
  const stageArray = []
  stages.forEach((s) => {
    if (s.config.type === 'roundrobinmatchday') {
      s.matchdays = []
      s.groups.forEach((g) => {
        g &&
          g.matchdays &&
          g.matchdays.forEach((md) => {
            if (md) {
              let found = s.matchdays.find((_md) => _md && _md.details && _md.details.name === md.details.name)
              if (found === undefined) {
                s.matchdays.push({ details: { name: md.details.name }, config: { type: s.config.type }, matches: [] })
                found = s.matchdays.find((_md) => _md.details.name === md.details.name)
                // console.log('found', found)
              }
              md.matches &&
                md.matches.forEach((m) => {
                  if (m) {
                    m.group = g.details.name
                    m.matchday = md.details.name
                    found.matches.push(m)
                  }
                })
            }
          })
      })
      s.matchdays.forEach((md) => {
        stageArray.push(md)
      })
    } else {
      stageArray.push(s)
    }
  })
  return stageArray
}

const Matches = (props) => {
  const { tournament } = props
  const { stages, leagues, config } = tournament
  const stageArray = config.multi_league ? collectLeagueMdStages(leagues, tournament) : collectMdStages(stages)
  // console.log('stageArray', stageArray)
  const defaultTab = config.multi_league ? getDefaultMdTab(leagues) : getDefaultStageTab(stages)
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
                    className={classnames({ active: activeTab === `${s.details.name.replace(/ /g, '-')}` })}
                    onClick={() => {
                      toggle(`${s.details.name.replace(/ /g, '-')}`)
                    }}
                  >
                    {s.details.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {stageArray.map((s) => (
              <React.Fragment key={s.details.name}>
                {s.details.name && (
                  <TabPane tabId={s.details.name.replace(/ /g, '-')}>
                    {(s.config.type === 'roundrobin' || s.config.type === 'allocation') && <RoundRobin stage={s} config={config} />}
                    {s.config.type === 'roundrobinmatchday' && <RoundRobinMatchDay matchday={s} config={config} />}
                    {s.config.type === 'roundrobinleaguematchday' && <RoundRobinLeagueMatchDay matchday={s} config={config} />}
                    {s.config.type === 'knockout' && <Knockout stage={s} config={config} />}
                  </TabPane>
                )}
              </React.Fragment>
            ))}
          </TabContent>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Matches
