import React from 'react'
import { getShortTeamName, getFlagSrc, getNationSmallFlagImg, getClubLogoImg } from '../core/TeamHelper'
import { SemifinalistsTooltip, SharedBronzeTooltip } from '../core/TooltipHelper'
import { Row, Col } from 'reactstrap'
import { isEmpty } from 'lodash'

const isOlympicTournaments = (id) => {
  return id === 'MOFT' || id === 'WOFT'
}

const TournamentHead = (props) => {
  const { config } = props
  const championLabel = !isOlympicTournaments(config.id) ? 'Champions' : 'Gold'
  const runnerupLabel = !isOlympicTournaments(config.id) ? 'Runners-up' : 'Silver'
  const thirdPlaceLabel = !isOlympicTournaments(config.id) ? 'Third-place' : 'Bronze'
  return (
    <Row className="competition-tbl team-header-row padding-tb-md text-center gray-striped">
      <Col className="col-1">No.</Col>
      <Col className="score-no-padding-right col-2">Edition</Col>
      <Col className="text-center score-no-padding-right col-2">{championLabel}</Col>
      <Col className="text-center score-no-padding-right col-2">{runnerupLabel}</Col>
      {!config.no_third_place && (
        <React.Fragment>
          <Col className="text-center score-no-padding-right col-2">{thirdPlaceLabel}</Col>
          <Col className="text-center score-no-padding-right col-2">Fourth-place</Col>
        </React.Fragment>
      )}
      {config.no_third_place && (
        <Col className="text-center score-no-padding-right col-4">
          Semi-finalists
          <SemifinalistsTooltip target="semifinalistsTooltip" />
        </Col>
      )}
    </Row>
  )
}

const TeamCell = (id, config) => {
  if (!id) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
      {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id)}
      {config.team_type_id !== 'CLUB' && <img className="flag-sm flag-md " src={getFlagSrc(id)} alt={id} title={id} />}
      <br></br>
      {getShortTeamName(id)}
    </React.Fragment>
  )
}

const TournamentRow = (props) => {
  const { row, count } = props
  const { details, config } = row
  // console.log('config.team_type_id', config.team_type_id)
  return (
    <React.Fragment>
      {details.era && (
        <Row className="competition-tbl team-header-row padding-tb-md text-center gray-striped">
          <Col>{details.era}</Col>
        </Row>
      )}
      {config.showHeader && <TournamentHead config={config} />}
      <Row className={`competition-tbl team-row padding-tb-md text-center${count % 2 !== 0 ? ' ltblue-striped' : ''}`}>
        <Col className="col-1">{count}</Col>
        <Col className="score-no-padding-right col-2">
          {!details.short_name && (
            <React.Fragment>
              {details.logo_filename && (
                <a href={`/tournament/${row.id}`}>
                  <img src={`/images/${config.logo_path}/${details.logo_filename}`} alt={details.name} title={details.name} className="tournament-logo" />
                </a>
              )}
            </React.Fragment>
          )}
          {details.short_name && (
            <React.Fragment>
              {details.logo_filename && (
                <React.Fragment>
                  <a href={`/tournament/${row.id}`}>
                    <img src={`/images/${config.logo_path}/${details.logo_filename}`} alt={details.name} title={details.name} className="tournament-logo-sm" />
                  </a>
                  <p className="competition-tbl-sm">{details.short_name}</p>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Col>
        <Col className="text-center score-no-padding-right col-2 word-break-all">
          {details.final_standings && TeamCell(details.final_standings.champions, config)}
        </Col>
        <Col className="text-center score-no-padding-right col-2 word-break-all">
          {details.final_standings && TeamCell(details.final_standings.runners_up, config)}
        </Col>
        {!config.no_third_place && (
          <React.Fragment>
            <Col className="text-center score-no-padding-right col-2 word-break-all">
              {typeof details.final_standings.third_place === 'string' && TeamCell(details.final_standings.third_place, config)}
              {typeof details.final_standings.third_place === 'object' && (
                <React.Fragment>
                  {TeamCell(details.final_standings.third_place[0], config)}
                  <SharedBronzeTooltip target="sharedTooltip" notes={details.final_standings.third_place_text} />
                  {TeamCell(details.final_standings.third_place[1], config)}
                  <SharedBronzeTooltip target="sharedTooltip" notes={details.final_standings.third_place_text} />
                </React.Fragment>
              )}
            </Col>
            <Col className="text-center score-no-padding-right col-2 word-break-all">
              {details.final_standings && TeamCell(details.final_standings.fourth_place, config)}
            </Col>
          </React.Fragment>
        )}
        {config.no_third_place && (
          <Col className="text-center score-no-padding-right col-4">
            <Row>
              <Col className="col-6 word-break-all">{TeamCell(details.final_standings.semi_finalist1, config)}</Col>
              <Col className="col-6 word-break-all">{TeamCell(details.final_standings.semi_finalist2, config)}</Col>
            </Row>
          </Col>
        )}
      </Row>
    </React.Fragment>
  )
}

const TournamentTable = (props) => {
  const { competition } = props
  if (!competition) return
  const { tournaments } = competition
  if (!tournaments || isEmpty(tournaments)) return null
  let showHeader = true
  let previousStatus = null
  return (
    <React.Fragment>
      <Row className="box-xl mb-5">
        <Col>
          <Row className="mt-4"></Row>
          {tournaments.map((t, index) => {
            // console.log('tournament', t)
            showHeader = t.config.no_third_place !== previousStatus ? true : false
            previousStatus = t.config.no_third_place
            t.config = { ...t.config, showHeader }
            const count = tournaments.length - index
            return <TournamentRow row={t} count={count} key={t.id}></TournamentRow>
          })}
        </Col>
      </Row>
    </React.Fragment>
  )
}

const CompetitionAbout = (props) => {
  const { competition } = props
  const { details, config } = competition
  return (
    <React.Fragment>
      <Row className="mt-3 mb-3 text-left tournament-format">
        <Col xs="9">
          <Row>
            <Col xs="12">
              {details.descriptions.map((d) => (
                <p key={d}>{d}</p>
              ))}
            </Col>
          </Row>
        </Col>
        <Col xs="3">
          {details.trophy_filename && (
            <img
              src={`/images/${config.logo_path}/${details.trophy_filename}`}
              alt={`Trophy ${details.name}`}
              title={`Trophy ${details.name}`}
              className="competition-trophy"
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="h2-ff1 margin-tb-md">Tournament Results</div>
        </Col>
      </Row>
      <TournamentTable competition={competition} />
    </React.Fragment>
  )
}

export default CompetitionAbout
