import React from 'react'
// import React, { useState } from 'react'
// import TournamentFormat from './TournamentFormat'
// import GroupStandings from './GroupStandings'
// import GroupMdStandings from './GroupMdStandings'
// import GroupLeagueMdStandings from './GroupLeagueMdStandings'
// import {
//   getTournamentConfig,
//   getTournamentTypeConfig,
//   getStageConfig,
//   getDefaultStageTab,
//   getAllRoundRobinStages,
//   getDefaultLeagueTab,
//   collectMdMatches,
// } from './Helper'
// import {
//   calculateGroupRankings,
//   calculateProgressRankings,
//   createGroupFinalRankings,
//   hasWildCardAdvancement,
//   collectWildCardRankings,
//   isGroupPlayoffTiebreaker,
//   isLotGroupPlayoffTiebreaker,
// } from './RankingsHelper'
import { Row } from 'reactstrap'
// import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
// import classnames from 'classnames'

// const calculateStageRankings = (tournament, config, stage) => {
//   const { groups } = stage
//   groups &&
//     groups.forEach((group) => {
//       if (stage.type === 'roundrobinmatchday') {
//         collectMdMatches(group)
//       }
//       group.teams && group.matches && calculateGroupRankings(group.teams, group.teams, group.matches, config)
//       // let matchDay = group.matches ? Math.ceil(group.matches.length / Math.floor(group.teams.length / 2)) : 0
//       let matchDay = group.teams ? (stage.home_and_away ? (group.teams.length - 1) * 2 : group.teams.length - 1) : 3
//       matchDay = isGroupPlayoffTiebreaker(tournament) ? 3 : matchDay
//       matchDay = isLotGroupPlayoffTiebreaker(tournament) ? 2 : matchDay
//       createGroupFinalRankings(tournament, group, matchDay, false)
//       group.teams && group.matches && calculateProgressRankings(tournament, group.teams, group.matches, config)
//     })
//   stage.wild_card = groups && hasWildCardAdvancement(stage) ? collectWildCardRankings(stage) : {}
// }

// const DisplayStage = (props) => {
//   const { tournament, tournamentType, stage } = props
//   if (!stage) return
//   const config = { ...getStageConfig(tournament, stage), ...getTournamentTypeConfig(tournamentType) }
//   return (
//     <React.Fragment>
//       <TournamentFormat config={config} tournamentType={tournamentType} />
//       {stage.type === 'roundrobin' && <GroupStandings config={config} stage={stage} />}
//       {stage.type === 'roundrobinmatchday' && <GroupMdStandings config={config} stage={stage} />}
//       {stage.type === 'roundrobinleaguematchday' && <GroupLeagueMdStandings config={config} stage={stage} />}
//     </React.Fragment>
//   )
// }

const Groups = (props) => {
  // const { tournament, tournamentType } = props
  // const { stages, leagues } = tournament
  // const rrStages = getAllRoundRobinStages(stages)
  // if (!tournament.calculated) {
  //   rrStages &&
  //     rrStages.forEach((stage) => {
  //       calculateStageRankings(tournament, getTournamentConfig(tournament), stage)
  //       tournament.calculated = true
  //     })
  //   leagues &&
  //     leagues.forEach((l) => {
  //       if (l.stages) {
  //         const rrlStages = getAllRoundRobinStages(l.stages)
  //         rrlStages &&
  //           rrlStages.forEach((s) => {
  //             if (s.groups) {
  //               s.groups.forEach((g) => {
  //                 g.matchdays &&
  //                   g.matchdays.forEach((md) => {
  //                     if (!g.matches) {
  //                       g.matches = []
  //                     }
  //                     if (md.matches) {
  //                       g.matches = g.matches.concat(md.matches)
  //                     }
  //                   })
  //               })
  //               calculateStageRankings(tournament, getTournamentConfig(tournament), s)
  //               tournament.calculated = true
  //             }
  //           })
  //       }
  //     })
  // }
  // const defaultTab = stages ? getDefaultStageTab(rrStages) : getDefaultLeagueTab(leagues)
  // const [activeTab, setActiveTab] = useState(defaultTab)
  // const toggle = (tab) => {
  //   if (activeTab !== tab) setActiveTab(tab)
  // }

  return (
    <React.Fragment>
      <Row className="mt-3"></Row>Groups
      {/* {rrStages && rrStages.length === 1 && <DisplayStage tournament={tournament} tournamentType={tournamentType} stage={rrStages[0]} />}
      {rrStages && rrStages.length > 1 && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {rrStages.map((stage) => (
              <NavItem key={stage.name}>
                {stage.name && (
                  <NavLink
                    className={classnames({ active: activeTab === `${stage.name.replace(' ', '-')}` })}
                    onClick={() => {
                      toggle(`${stage.name.replace(' ', '-')}`)
                    }}
                  >
                    {stage.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {rrStages.map((stage) => (
              <React.Fragment key={stage.name}>
                {stage.name && (
                  <TabPane tabId={stage.name.replace(' ', '-')}>
                    <DisplayStage tournament={tournament} tournamentType={tournamentType} stage={stage} />
                  </TabPane>
                )}
              </React.Fragment>
            ))}
          </TabContent>
        </React.Fragment>
      )}
      {leagues && leagues.length > 0 && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {leagues.map((l) => (
              <NavItem key={l.name}>
                {l.name && (
                  <NavLink
                    className={classnames({ active: activeTab === `${l.name.replace(' ', '-')}` })}
                    onClick={() => {
                      toggle(`${l.name.replace(' ', '-')}`)
                    }}
                  >
                    {l.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {leagues.map((l) => (
              <React.Fragment key={l.name}>
                {l.name && l.stages && (
                  <TabPane tabId={l.name.replace(' ', '-')}>
                    <DisplayStage tournament={tournament} tournamentType={tournamentType} stage={l.stages[0]} />
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

export default Groups
