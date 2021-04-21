import React, { useState } from 'react'
import Format from './Format'
import GroupStandings from './GroupStandings'
// import GroupMdStandings from './GroupMdStandings'
// import GroupLeagueMdStandings from './GroupLeagueMdStandings'
import { getDefaultStageTab, getAllRoundRobinStages, getDefaultLeagueTab, collectMdMatches } from '../../core/Helper'
import {
  calculateGroupRankings,
  calculateProgressRankings,
  createGroupFinalRankings,
  hasWildCardAdvancement,
  collectWildCardRankings,
  isGroupPlayoffTiebreaker,
  isLotGroupPlayoffTiebreaker,
} from '../rankings/RankingsHelper'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

const getFormat = (stage) => {
  if (isEmpty(stage)) return {}
  const { groups } = stage
  const groupCount = !isEmpty(groups) ? groups.length : 0
  const teamCount = !isEmpty(groups) && !isEmpty(groups[0]) && !isEmpty(groups[0].teams) ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount }
}

const getDisplayStageConfig = (state, stage) => {
  const { tournament, competition } = state
  const _config = { ...competition.config, ...tournament.config, ...stage.config, ...getFormat(stage) }
  return stage.tiebreakers ? { ..._config, tiebreakers: stage.tiebreakers } : _config
}

const calculateStageRankings = (tournament, stage) => {
  const config = { ...tournament.config, ...tournament.details }
  const { groups } = stage
  groups &&
    groups.forEach((g) => {
      if (stage.config.type === 'roundrobinmatchday') {
        collectMdMatches(g)
      }
      calculateGroupRankings(g.teams, g, config)
      let matchDay = g.teams ? (stage.config.home_and_away ? (g.teams.length - 1) * 2 : g.teams.length - 1) : 3
      matchDay = isGroupPlayoffTiebreaker(config) ? 3 : matchDay
      matchDay = isLotGroupPlayoffTiebreaker(config) ? 2 : matchDay
      createGroupFinalRankings(tournament, g, matchDay, false)
      calculateProgressRankings(tournament, g)
    })
  stage.wild_card = groups && hasWildCardAdvancement(stage.config) ? collectWildCardRankings(stage) : {}
}

const DisplayStage = (props) => {
  const { state, stage } = props
  if (isEmpty(stage)) return
  const config = getDisplayStageConfig(state, stage)
  const { tournament } = state
  return (
    <React.Fragment>
      {tournament && <Format config={config} details={tournament.details} />}
      {stage.config.type === 'roundrobin' && <GroupStandings stage={stage} config={config} />}
      {/* {stage.type === 'roundrobinmatchday' && <GroupMdStandings config={config} stage={stage} />}
      {stage.type === 'roundrobinleaguematchday' && <GroupLeagueMdStandings config={config} stage={stage} />} */}
    </React.Fragment>
  )
}

const Groups = (props) => {
  const { state } = props
  const { tournament } = state
  const { stages, leagues } = tournament
  const rrStages = getAllRoundRobinStages(stages)
  if (!tournament.calculated) {
    !isEmpty(rrStages) &&
      rrStages.forEach((s) => {
        calculateStageRankings(tournament, s)
        tournament.calculated = true
      })
    !isEmpty(leagues) &&
      leagues.forEach((l) => {
        if (l.stages) {
          const rrlStages = getAllRoundRobinStages(l.stages)
          rrlStages &&
            rrlStages.forEach((s) => {
              if (s.groups) {
                s.groups.forEach((g) => {
                  g.matchdays &&
                    g.matchdays.forEach((md) => {
                      if (!g.matches) {
                        g.matches = []
                      }
                      if (md.matches) {
                        g.matches = g.matches.concat(md.matches)
                      }
                    })
                })
                calculateStageRankings(tournament, s)
                tournament.calculated = true
              }
            })
        }
      })
  }
  const defaultTab = !isEmpty(stages) ? getDefaultStageTab(rrStages) : getDefaultLeagueTab(leagues)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {!isEmpty(rrStages) && rrStages.length === 1 && <DisplayStage state={state} stage={rrStages[0]} />}
      {!isEmpty(rrStages) && rrStages.length > 1 && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {rrStages.map((s) => (
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
            {rrStages.map((s) => (
              <React.Fragment key={s.details.name}>
                {s.details.name && (
                  <TabPane tabId={s.details.name.replace(/ /g, '-')}>
                    <DisplayStage state={state} stage={s} />
                  </TabPane>
                )}
              </React.Fragment>
            ))}
          </TabContent>
        </React.Fragment>
      )}
      {!isEmpty(leagues) && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {leagues.map((l) => (
              <NavItem key={l.details.name}>
                {l.details.name && (
                  <NavLink
                    className={classnames({ active: activeTab === `${l.details.name.replace(/ /g, '-')}` })}
                    onClick={() => {
                      toggle(`${l.details.name.replace(/ /g, '-')}`)
                    }}
                  >
                    {l.details.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {leagues.map((l) => (
              <React.Fragment key={l.details.name}>
                {l.details.name && l.stages && (
                  <TabPane tabId={l.details.name.replace(/ /g, '-')}>
                    <DisplayStage state={state} stage={l.stages[0]} />
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

export default Groups
