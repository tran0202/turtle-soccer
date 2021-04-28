import React, { useState } from 'react'
import Rankings from '../rankings/Rankings'
import { DisplaySchedule, getRoundMatches, hasGroupPlayoff } from '../matches/MatchHelper'
import { Collapse, Row, Col, Button } from 'reactstrap'

const GroupCollapse = (props) => {
  const { group, config } = props
  const matchArray = getRoundMatches(group, true)
  const [collapse, setCollapse] = useState(false)
  const [status, setStatus] = useState('Closed')
  const onEntering = () => setStatus('Opening...')
  const onEntered = () => setStatus('Opened')
  const onExiting = () => setStatus('Closing...')
  const onExited = () => setStatus('Closed')
  const toggle = () => setCollapse(!collapse)

  return (
    <React.Fragment>
      <Row className="mt-3 text-center">
        <Col sm="12">
          <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse">
            {group.details.name}&nbsp;
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        {config.type === 'roundrobin' && !hasGroupPlayoff(group) && <DisplaySchedule round={matchArray} config={config} />}
        {config.type === 'roundrobin' && hasGroupPlayoff(group) && (
          <React.Fragment>
            <DisplaySchedule round={matchArray[0]} config={config} />
            <DisplaySchedule round={matchArray[1]} config={config} details={{ name: 'Playoff' }} />
          </React.Fragment>
        )}
        {(config.type === 'roundrobinmatchday' || config.type === 'roundrobinleaguematchday') && (
          <React.Fragment>
            {group.matchdays.map((md) => {
              const mdMatches = getRoundMatches(md, true)
              return <DisplaySchedule round={mdMatches} config={config} details={md.details} key={md.details.name} />
            })}
          </React.Fragment>
        )}
        <Row className="mb-5"></Row>
      </Collapse>
    </React.Fragment>
  )
}

const GroupPlay = (props) => {
  const { group, config } = props
  // console.log('group', group)
  return (
    <React.Fragment>
      <GroupCollapse group={group} config={config} />
      <Rankings rounds={[group]} config={config} />
    </React.Fragment>
  )
}

export default GroupPlay
