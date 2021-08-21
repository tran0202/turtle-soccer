import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import { isEmpty } from 'lodash'

const Format = (props) => {
  const { config, details } = props
  const init_tiebreakers_collapsed = config.tiebreakers_collapsed !== true ? true : false
  const init_tiebreakers_status = config.tiebreakers_collapsed !== true ? 'Opened' : 'Closed'
  const [collapse, setCollapse] = useState(init_tiebreakers_collapsed)
  const [status, setStatus] = useState(init_tiebreakers_status)
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
            Format &amp; Tiebreakers&nbsp;
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        <FormatContent config={config} details={details} />
      </Collapse>
    </React.Fragment>
  )
}

const FormatContent = (props) => {
  const { config, details } = props
  // console.log('config', config)
  return (
    config.teamCount !== 0 && (
      <Row className="mt-3 mb-3 text-left tournament-format">
        <Col xs="9">
          <Row>
            <Col xs="12">
              <p>
                <strong>Format:&nbsp;</strong>
                {config.groupCount > 1 && (
                  <React.Fragment>
                    {config.id === 'WC1930' && (
                      <React.Fragment>13 teams were drawn into 4 groups, with Group 1 containing 4 teams and the others containing 3.&nbsp;</React.Fragment>
                    )}
                    {config.id === 'WOFT2004' && (
                      <React.Fragment>
                        10 teams were drawn into 3 groups, with Group E &amp; F containing 3 teams and Group G containing 4.&nbsp;
                      </React.Fragment>
                    )}
                    {config.id === 'GC1998' && (
                      <React.Fragment>
                        10 teams were drawn into 3 groups, with Group A containing 4 teams and Group B &amp; C containing 3.&nbsp;
                      </React.Fragment>
                    )}
                    {config.id === 'GC1963' && (
                      <React.Fragment>9 teams were drawn into 2 groups, with Group A containing 5 teams and Group B containing 4.&nbsp;</React.Fragment>
                    )}
                    {config.id === 'UNL201819' && (
                      <React.Fragment>
                        55 UEFA national teams were divided into 4 leagues: 12 teams in League A, 12 teams in League B, 15 teams in League C, and 16 teams in
                        League D. Each league was drawn into 4 groups of 3 or 4 teams.&nbsp;
                      </React.Fragment>
                    )}
                    {config.id === 'UNL202021' && (
                      <React.Fragment>
                        55 UEFA national teams were divided into 4 leagues: 16 teams in League A, B, and C, and 7 teams in League D. Leagues A, B and C was
                        drawn into 4 groups of 4 teams. League D was drawn into 2 groups, with one containing 4 teams and the other containing 3.&nbsp;
                      </React.Fragment>
                    )}
                    {config.id !== 'WC1930' &&
                      config.id !== 'WOFT2004' &&
                      config.id !== 'GC1998' &&
                      config.id !== 'GC1963' &&
                      config.id !== 'UNL201819' &&
                      config.id !== 'UNL202021' && (
                        <React.Fragment>
                          {config.totalCount} teams were drawn into {config.groupCount} groups of {config.teamCount} teams.&nbsp;
                        </React.Fragment>
                      )}
                    {config.id === 'WC1950' && <React.Fragment>(13 teams eventually participated after several withdrawals.)&nbsp;</React.Fragment>}
                    {config.id === 'AFCON2010' && (
                      <React.Fragment>
                        (The withdrawal of Togo in group B after a terrorist attack on their bus reduced the number of participating nations to 15.)&nbsp;
                      </React.Fragment>
                    )}
                    {config.id === 'AFCON1996' && (
                      <React.Fragment> (Nigeria withdrew from the tournament at the final moment, reducing the field to 15.)&nbsp; </React.Fragment>
                    )}
                    {!config.odd_format && (
                      <React.Fragment>Each group played a {config.home_and_away ? 'home-and-away ' : ''}round-robin schedule.</React.Fragment>
                    )}
                    {config.odd_format}
                  </React.Fragment>
                )}
                {config.groupCount === 1 && (
                  <React.Fragment>
                    {config.totalCount} teams played a {config.home_and_away ? 'home-and-away ' : ''}round-robin schedule.
                  </React.Fragment>
                )}
                &nbsp;
                {config.advancement && config.advancement.teams && config.advancement.teams.text
                  ? config.advancement.teams.text
                  : 'The top 2 teams would advance to the knockout stage.'}
                &nbsp;{config.advancement ? config.advancement.extra : ''}
              </p>
            </Col>
            <Col xs="12">
              <p className="no-margin-bottom">
                <strong>Tiebreakers:</strong> The ranking of teams was determined as follows:
              </p>
              <ul className="no-margin-bottom">
                {config.tiebreakers &&
                  config.tiebreakers.map((tb, index) => {
                    if (tb === 'points') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'pointslot') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Drawing lots</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'goaldifferenceandgoalscored') {
                      return (
                        <React.Fragment key={index}>
                          <li>Goal difference in all group matches</li>
                          <li>Goals scored in all group matches</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'goaldifferencegoalscoredwins') {
                      return (
                        <React.Fragment key={index}>
                          <li>Goal difference in all group matches</li>
                          <li>Goals scored in all group matches</li>
                          <li>Wins in all group matches</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'awaygoalswinsawaywins') {
                      return (
                        <React.Fragment key={index}>
                          <li>Away goals in all group matches</li>
                          <li>Wins in all group matches</li>
                          <li>Away wins in all group matches</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'team') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Goal difference in all group matches</li>
                          <li>Goals scored in all group matches</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'pointtiedtopstandings') {
                      return (
                        <React.Fragment key={index}>
                          <li>If points tied at the top of the standings, a playoff match would be held to determine the champion.</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'pointandgoaldifference') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Goal difference in all group matches</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'goalratio') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Goal ratio in all group matches</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'goalratiogroupplayoff') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Goal ratio in all group matches if the top 2 teams on equal points</li>
                          <li>Playoff match if the 2nd and 3rd placed teams on equal points</li>
                          <li>Goal ratio in all group matches if the playoff match ends with a draw</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'lotgroupplayoff') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Drawing lots if the top 2 teams on equal points</li>
                          <li>Playoff match if the 2nd and 3rd placed teams on equal points</li>
                        </React.Fragment>
                      )
                    } else if (tb === '1stplaceplayoff') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points ({config.points_for_win} points/W - 1 points/D - 0 points/L)</li>
                          <li>Playoff match if the top 2 teams on equal points</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'firstroundposition') {
                      return (
                        <React.Fragment key={index}>
                          <li>Higher finishing position in the first round table</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'firstroundfirstsecond') {
                      return (
                        <React.Fragment key={index}>
                          <li>Whether the team finished first or second in their first round group</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2head') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points in head-to-head matches between tied teams</li>
                          <li>Goal difference in head-to-head matches between tied teams</li>
                          <li>Goals scored in head-to-head matches between tied teams</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2headpoints') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points in matches between tied teams</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2headresults') {
                      return (
                        <React.Fragment key={index}>
                          <li>Head-to-head results</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2headmatch') {
                      return (
                        <React.Fragment key={index}>
                          <li>Winner of heah-to-head match between tied teams</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2headawaygoals') {
                      return (
                        <li key={index}>
                          Away goals scored in matches between tied teams (if the tie is only between two teams in home-and-away league format)
                        </li>
                      )
                    } else if (tb === 'head2headreapply') {
                      return (
                        <React.Fragment key={index}>
                          <li>
                            If more than two teams were tied, and after applying all head-to-head criteria above, a subset of teams were still tied, all
                            head-to-head criteria above were reapplied exclusively to this subset of teams.
                          </li>
                        </React.Fragment>
                      )
                    } else if (tb === 'penalty') {
                      return <li key={index}>Penalty shoot-out if only 2 teams were tied and they met in the last round of the group stage</li>
                    } else if (tb === 'fairplaylight') {
                      return <li key={index}>Fair play points: Yellow -1. Indirect Red -3. Direct Red -3. Yellow and Direct Red -4.</li>
                    } else if (tb === 'fairplay') {
                      return <li key={index}>Fair play points: Yellow -1. Indirect Red -3. Direct Red -4. Yellow and Direct Red -5.</li>
                    } else if (tb === 'coefficient') {
                      return <li key={index}>Position in the coefficient ranking system.</li>
                    } else if (tb === 'lot') {
                      return <li key={index}>Drawing lots</li>
                    } else {
                      return null
                    }
                  })}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col xs="3">
          {!isEmpty(details) && details.mascot_filename && (
            <img
              src={`/images/${config.logo_path}/${details.mascot_filename}`}
              alt={`Mascot ${details.name}`}
              title={`Mascot ${details.name}`}
              className="tournament-mascot"
            />
          )}
        </Col>
      </Row>
    )
  )
}

export default Format
