import React from 'react'
import GroupPlay from './GroupPlay'
import Rankings from '../rankings/Rankings'
import { hasWildCardAdvancement } from '../rankings/RankingsHelper'
import { Row, Col } from 'reactstrap'
import ordinalize from 'ordinalize'

const GroupStandings = (props) => {
  const { stage, config } = props
  const { groups } = stage
  const wildCardPos = groups && hasWildCardAdvancement(stage.config) ? config.advancement.teams.wild_card.pos : 3
  return (
    <React.Fragment>
      {groups && groups.map((g) => <GroupPlay group={g} config={config} key={g.details.name} />)}
      {groups && hasWildCardAdvancement(stage.config) && (
        <React.Fragment>
          <Row>
            <Col>
              <div className="h2-ff1 margin-top-md">Rankings of {ordinalize(wildCardPos)}-placed teams</div>
            </Col>
          </Row>
          <Rankings rounds={[stage.wild_card]} config={config} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default GroupStandings
