import React from 'react'
import Qualified from './Qualified'
import { SharedBronzeTooltip, GoldenBallRejectedTooltip } from '../core/TooltipHelper'
import { isWinner } from '../core/Helper'
import { getFlagSrc, getNationSmallFlagImg, getClubLogoImg, getTeamFlagName, getNationOfficialName } from '../core/TeamHelper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import { isEmpty, isNumber } from 'lodash'

const findFinalStandings = (tournament) => {
  if (!tournament.stages) {
    return {}
  }
  const koStage = tournament.stages.find((s) => s.type === 'knockout')
  if (koStage && koStage.rounds) {
    const final = koStage.rounds.find((r) => r.name === 'Final')
    const third_place_game = koStage.rounds.find((r) => r.name === 'Third-place')
    let champions, runners_up, third_place, fourth_place
    if (final && final.matches) {
      if (isWinner('H', final.matches[0])) {
        champions = final.matches[0].home_team
        runners_up = final.matches[0].away_team
      } else if (isWinner('A', final.matches[0])) {
        champions = final.matches[0].away_team
        runners_up = final.matches[0].home_team
      }
    }
    if (third_place_game && third_place_game.matches) {
      if (isWinner('H', third_place_game.matches[0])) {
        third_place = third_place_game.matches[0].home_team
        fourth_place = third_place_game.matches[0].away_team
      } else if (isWinner('A', third_place_game.matches[0])) {
        third_place = third_place_game.matches[0].away_team
        fourth_place = third_place_game.matches[0].home_team
      }
    }
    return { fs1: champions, fs2: runners_up, fs3: third_place, fs4: fourth_place }
  }
  return {}
}

const getGoldenBootDetails = (player) => {
  let details = ``
  details = player.goals ? `(${player.goals} goals)` : details
  if (player.assists && player.minutes) {
    details = `(${player.goals} goals, ${player.assists} assists, ${player.minutes} minutes)`
  } else if (player.assists && !player.minutes) {
    details = `(${player.goals} goals, ${player.assists} assists)`
  } else if (!player.assists && player.minutes) {
    details = `(${player.goals} goals, ${player.minutes} minutes)`
  }
  return details
}

const getTopScorerLabel = (tournament, position) => {
  // console.log('tournament', tournament)
  if (!tournament.details.year || !tournament.config.competition_id || !tournament.details.awards || !position) return
  if (position === 1) {
    if (!tournament.details.awards.golden_boot) return
    if (tournament.config.competition_id === 'WC') {
      if (tournament.details.year <= '1978') {
        return tournament.details.awards.golden_boot.length > 1 ? 'Top scorers' : 'Top scorer'
      } else if (tournament.details.year <= '2006') {
        return tournament.details.awards.golden_boot.length > 1 ? 'Golden Shoes' : 'Golden Shoe'
      }
      return 'Golden Boot'
    } else if (tournament.config.competition_id === 'MOFT' || tournament.config.competition_id === 'WOFT' || tournament.config.competition_id === 'AFCON') {
      return tournament.details.awards.golden_boot.length > 1 ? 'Top scorers' : 'Top scorer'
    }
    return 'Golden Boot'
  } else if (position === 2) {
    if (!tournament.details.awards.silver_boot) return
    if (tournament.config.competition_id === 'WC') {
      if (tournament.details.year <= '1978') {
        return tournament.details.awards.silver_boot.length > 1 ? 'Runners-up' : 'Runner-up'
      } else if (tournament.details.year <= '2006') {
        return tournament.details.awards.silver_boot.length > 1 ? 'Silver Shoes' : 'Silver Shoe'
      }
      return 'Silver Boot'
    }
    return 'Silver Boot'
  } else {
    if (!tournament.details.awards.bronze_boot) return
    if (tournament.config.competition_id === 'WC') {
      if (tournament.details.year <= '1978') {
        return 'Third-place'
      } else if (tournament.details.year <= '2006') {
        return tournament.details.awards.bronze_boot.length > 1 ? 'Bronze Shoes' : 'Bronze Shoe'
      }
      return 'Bronze Boot'
    }
    return 'Bronze Boot'
  }
}

const getHostLabel = (host) => {
  return host.length > 1 ? 'Hosts' : 'Host'
}

const getGoldenBallLabel = (tournament) => {
  if (tournament.config.competition_id === 'EURO') {
    return 'Player of the Tournament'
  } else if (tournament.config.competition_id === 'AFCON') {
    return 'Man of the Competition'
  }
  return 'Golden Ball'
}

const getGoldenGloveLabel = (tournament) => {
  if (tournament.config.competition_id === 'AFCON') {
    return 'Best Goalkeeper'
  }
  return 'Golden Glove'
}

const getPlayerClubNationName = (p, config) => {
  if (!p) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && (
        <React.Fragment>
          {!p.club2 && getClubLogoImg(p.club, config)}
          {p.club2 && (
            <React.Fragment>
              [{getClubLogoImg(p.club, config)}/{getClubLogoImg(p.club2, config)}]
            </React.Fragment>
          )}
          {getNationSmallFlagImg(p.team)}
        </React.Fragment>
      )}
      {config.team_type_id !== 'CLUB' && p.team && (
        <img
          className="flag-sm flag-md "
          src={getFlagSrc(p.team)}
          alt={`${p.team} ${getNationOfficialName(p.team)}`}
          title={`${p.team} ${getNationOfficialName(p.team)}`}
        />
      )}
      <span className="padding-top-xs">
        &nbsp;{p.player} {getGoldenBootDetails(p)}
      </span>
    </React.Fragment>
  )
}

const DisplayDetails = (props) => {
  const { field, label, showDivider, children } = props
  // console.log('children', children)
  return (
    <React.Fragment>
      {(!isEmpty(field) || (isNumber(field) && field !== 0)) && (
        <React.Fragment>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
              {label}
            </Col>
            <Col md="6" sm="7">
              {children}
            </Col>
          </Row>
          {showDivider && (
            <Row className="margin-top-xs mb-3">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award"></Col>
              <Col md="5" sm="7" className="tournament-award-receiver"></Col>
            </Row>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const About = (props) => {
  const { tournament } = props
  const { id, details } = tournament
  const {
    host,
    team_count,
    confed_count,
    venue_count,
    city_count,
    final_host,
    start_date,
    end_date,
    start_league_date,
    end_league_date,
    start_final_date,
    end_final_date,
    start_relegation_date,
    end_relegation_date,
    start_qualifying_date,
    end_qualifying_date,
    start_competition_date,
    end_competition_date,
    final_team_count,
    final_venue_count,
    final_city_count,
    tournament_team_count,
    transfer_team_count,
    total_team_count,
    total_transfer_team_count,
    association_count,
    hero_images,
    final_standings,
    statistics,
    awards,
    qualified,
    original_name,
  } = details
  const { fs1, fs2, fs3, fs4 } = findFinalStandings(tournament)
  const champions = fs1 ? fs1 : final_standings ? final_standings.champions : null
  const runners_up = fs2 ? fs2 : final_standings ? final_standings.runners_up : null
  const third_place = fs3 ? fs3 : final_standings ? final_standings.third_place : null
  const fourth_place = fs4 ? fs4 : final_standings ? final_standings.fourth_place : null
  return (
    <React.Fragment>
      {!isEmpty(hero_images) && (
        <section id="hero" className="mt-3">
          <div className="hero-container">
            <div id="heroCarousel" className="carousel slide carousel-fade" data-ride="carousel">
              <ol className="carousel-indicators" id="hero-carousel-indicators"></ol>
              <div className="carousel-inner" role="listbox">
                {hero_images.map((i, index) => (
                  <div
                    key={index}
                    className={`carousel-item${index === 0 ? ' active' : ''}`}
                    style={{
                      backgroundImage: `url('/images/tournaments/${id}/${i.filename}')`,
                    }}
                  >
                    <div className="carousel-container">
                      <div className="carousel-content container">
                        <h2 className="animated fadeInDown h2-ff8">{i.name}</h2>
                        <p className="animated fadeInUp">{i.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a className="carousel-control-prev" href="#heroCarousel" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#heroCarousel" role="button" data-slide="next">
                <span className="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </section>
      )}
      <Row className="mt-3">
        <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
          <h2 className="h2-ff5 mt-3">Tournament details</h2>
        </Col>
        <Col sm={{ size: 10, offset: 1 }}>
          <DisplayDetails field={original_name} label="Original Name">
            {original_name}
          </DisplayDetails>
          <DisplayDetails field={host} label={getHostLabel(host)}>
            {host.map((h) => (
              <Row className="no-margin-lr margin-bottom-xs" key={h}>
                {getTeamFlagName(h, tournament.config)}
              </Row>
            ))}
          </DisplayDetails>
          <DisplayDetails field={start_date} label="Dates">
            {start_date ? moment(start_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
            {end_date ? moment(end_date).format('MMMM D, YYYY') : ''}
          </DisplayDetails>
          <DisplayDetails field={start_league_date} label="League Phase">
            {start_league_date ? moment(start_league_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
            {end_league_date ? moment(end_league_date).format('MMMM D, YYYY') : ''}
          </DisplayDetails>
          <DisplayDetails field={start_final_date} label="Nations League Finals">
            {start_final_date ? moment(start_final_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
            {end_final_date ? moment(end_final_date).format('MMMM D, YYYY') : ''}
          </DisplayDetails>
          <DisplayDetails field={start_relegation_date} label="Relegation play-outs">
            {start_relegation_date ? moment(start_relegation_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
            {end_relegation_date ? moment(end_relegation_date).format('MMMM D, YYYY') : ''}
          </DisplayDetails>
          <DisplayDetails field={start_qualifying_date} label="Qualifying Dates">
            {start_qualifying_date ? moment(start_qualifying_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
            {end_qualifying_date ? moment(end_qualifying_date).format('MMMM D, YYYY') : ''}
          </DisplayDetails>
          <DisplayDetails field={start_competition_date} label="Competition Dates">
            {start_competition_date ? moment(start_competition_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
            {end_competition_date ? moment(end_competition_date).format('MMMM D, YYYY') : ''}
          </DisplayDetails>
          <DisplayDetails field={team_count} label="Teams">
            {team_count}&nbsp;
            {confed_count && (
              <React.Fragment>
                (from {confed_count} confederation{confed_count !== 1 ? 's' : ''})
              </React.Fragment>
            )}
          </DisplayDetails>
          <DisplayDetails field={tournament_team_count} label="Competition Teams">
            {tournament_team_count}&nbsp;
            {transfer_team_count && <React.Fragment>+ {transfer_team_count} (transferred from UCL)</React.Fragment>}
          </DisplayDetails>
          <DisplayDetails field={final_host} label="Final Host">
            {final_host.map((fh) => (
              <Row className="no-margin-lr margin-bottom-xs" key={fh}>
                {getTeamFlagName(fh, tournament.config)}
              </Row>
            ))}
          </DisplayDetails>
          <DisplayDetails field={final_team_count} label="Final Teams">
            {final_team_count}&nbsp;
          </DisplayDetails>
          <DisplayDetails field={total_team_count} label="Total Teams">
            {total_team_count}&nbsp;
            {total_transfer_team_count && <React.Fragment>+ {total_transfer_team_count} (transferred from UCL)&nbsp;</React.Fragment>}
            {association_count && (
              <React.Fragment>
                (from {association_count} association{association_count !== 1 ? 's' : ''})
              </React.Fragment>
            )}
          </DisplayDetails>
          <DisplayDetails field={venue_count} label="Venues">
            {venue_count} (in {city_count} host cit{city_count !== 1 ? 'ies' : 'y'})
          </DisplayDetails>
          <DisplayDetails field={final_venue_count} label="Final Venues">
            {final_venue_count} (in {final_city_count} host cit{final_city_count !== 1 ? 'ies' : 'y'})
          </DisplayDetails>
        </Col>
        {champions && (
          <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
            <h2 className="h2-ff5 mt-3">Final Standings</h2>
          </Col>
        )}
        <Col sm={{ size: 10, offset: 1 }}>
          <DisplayDetails
            field={champions}
            label={tournament.config.competition_id === 'MOFT' || tournament.config.competition_id === 'WOFT' ? 'Gold medal' : 'Champions'}
          >
            {getTeamFlagName(champions, tournament.config)}
          </DisplayDetails>
          <DisplayDetails
            field={runners_up}
            label={tournament.config.competition_id === 'MOFT' || tournament.config.competition_id === 'WOFT' ? 'Silver medal' : 'Runners-up'}
          >
            {getTeamFlagName(runners_up, tournament.config)}
          </DisplayDetails>
          <DisplayDetails
            field={third_place}
            label={tournament.config.competition_id === 'MOFT' || tournament.config.competition_id === 'WOFT' ? 'Bronze medal' : 'Third-place'}
          >
            {typeof third_place === 'string' && <React.Fragment>{getTeamFlagName(third_place, tournament.config)}</React.Fragment>}
            {typeof third_place === 'object' && (
              <React.Fragment>
                {getTeamFlagName(third_place[0], tournament.config)}
                <SharedBronzeTooltip target="sharedTooltip" notes={final_standings.third_place_text} />
                <br></br>
                {getTeamFlagName(third_place[1], tournament.config)}
                <SharedBronzeTooltip target="sharedTooltip" notes={final_standings.third_place_text} />
              </React.Fragment>
            )}
          </DisplayDetails>
          <DisplayDetails field={fourth_place} label="Fourth-place">
            {getTeamFlagName(fourth_place, tournament.config)}
          </DisplayDetails>
        </Col>
        {!isEmpty(statistics) && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Tournament Statistics</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              <DisplayDetails field={statistics.total_matches} label="Matches played">
                {statistics.total_matches}
              </DisplayDetails>
              <DisplayDetails field={statistics.total_goals} label="Goals scored">
                <NumberFormat value={statistics.total_goals} displayType={'text'} />
                &nbsp;(
                <NumberFormat value={(statistics.total_goals / statistics.total_matches).toFixed(2)} displayType={'text'} /> per match)
              </DisplayDetails>
              <DisplayDetails field={statistics.attendance} label="Attendance">
                <NumberFormat value={statistics.attendance} displayType={'text'} thousandSeparator={true} />
                &nbsp;(
                <NumberFormat value={(statistics.attendance / statistics.total_matches).toFixed(0)} displayType={'text'} thousandSeparator={true} /> per match)
              </DisplayDetails>
              <DisplayDetails field={statistics.final_matches} label="Final Matches played">
                {statistics.final_matches}
              </DisplayDetails>
              <DisplayDetails field={statistics.final_goals} label="Final Goals scored">
                <NumberFormat value={statistics.final_goals} displayType={'text'} />
                &nbsp;(
                <NumberFormat value={(statistics.final_goals / statistics.final_matches).toFixed(2)} displayType={'text'} /> per match)
              </DisplayDetails>
              <DisplayDetails field={statistics.final_attendance} label="Final Attendance">
                <NumberFormat value={statistics.final_attendance} displayType={'text'} thousandSeparator={true} />
                &nbsp;(
                <NumberFormat value={(statistics.final_attendance / statistics.final_matches).toFixed(0)} displayType={'text'} thousandSeparator={true} /> per
                match)
              </DisplayDetails>
            </Col>
          </React.Fragment>
        )}
        {!isEmpty(awards) && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Tournament Awards</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              <DisplayDetails field={awards.golden_boot} label={getTopScorerLabel(tournament, 1)}>
                {awards.golden_boot.map((p) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={p.player}>
                    {getPlayerClubNationName(p, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.silver_boot} label={getTopScorerLabel(tournament, 2)}>
                {awards.silver_boot.map((p) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={p.player}>
                    {getPlayerClubNationName(p, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.bronze_boot} label={getTopScorerLabel(tournament, 3)}>
                {awards.bronze_boot.map((p) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={p.player}>
                    {getPlayerClubNationName(p, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              {(awards.golden_boot || awards.silver_boot || awards.bronze_boot) && (
                <Row className="margin-top-xs mb-3">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award"></Col>
                  <Col md="5" sm="7" className="tournament-award-receiver"></Col>
                </Row>
              )}
              <DisplayDetails field={awards.golden_ball[0]} label={getGoldenBallLabel(tournament)}>
                {getPlayerClubNationName(awards.golden_ball[0], tournament.config)}
                {awards.golden_ball[0] && awards.golden_ball[0].rejected && (
                  <GoldenBallRejectedTooltip target="goldenBallTooltip" notes={awards.golden_ball[0].rejected_notes} />
                )}
              </DisplayDetails>
              <DisplayDetails field={awards.golden_ball[1]} label="Silver Ball">
                {getPlayerClubNationName(awards.golden_ball[1], tournament.config)}
              </DisplayDetails>
              <DisplayDetails field={awards.golden_ball[2]} label="Bronze Ball">
                {getPlayerClubNationName(awards.golden_ball[2], tournament.config)}
              </DisplayDetails>
              {!isEmpty(awards.golden_ball) && (
                <Row className="margin-top-xs mb-3">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award"></Col>
                  <Col md="5" sm="7" className="tournament-award-receiver"></Col>
                </Row>
              )}
              <DisplayDetails field={awards.best_young_player} label="Best Young Player" showDivider={true}>
                {getPlayerClubNationName(awards.best_young_player, tournament.config)}
              </DisplayDetails>
              <DisplayDetails field={awards.golden_glove} label={getGoldenGloveLabel(tournament)} showDivider={true}>
                {awards.golden_glove.map((gg) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={gg.player}>
                    {getPlayerClubNationName(gg, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.best_defender} label="Best Defender" showDivider={true}>
                {awards.best_defender.map((bd) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={bd.player}>
                    {getPlayerClubNationName(bd, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.best_midfielder} label="Best Midfielder" showDivider={true}>
                {awards.best_midfielder.map((bm) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={bm.player}>
                    {getPlayerClubNationName(bm, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.best_forward} label="Best Forward" showDivider={true}>
                {awards.best_forward.map((bf) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={bf.player}>
                    {getPlayerClubNationName(bf, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.final_top_scorer} label="Final Top Scorer" showDivider={true}>
                {awards.final_top_scorer.map((fts) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={fts.player}>
                    {getPlayerClubNationName(fts, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.final_best_player} label="Final Best Player" showDivider={true}>
                {awards.final_best_player.map((fbp) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={fbp.player}>
                    {getPlayerClubNationName(fbp, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.final_best_young_player} label="Final Best Young Player" showDivider={true}>
                {awards.final_best_young_player.map((fbyp) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={fbyp.player}>
                    {getPlayerClubNationName(fbyp, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
              <DisplayDetails field={awards.fair_play_team} label="Fair play" showDivider={true}>
                {awards.fair_play_team.map((t) => (
                  <Row className="no-margin-lr margin-bottom-xs display-block" key={t}>
                    {getTeamFlagName(t, tournament.config)}
                  </Row>
                ))}
              </DisplayDetails>
            </Col>
          </React.Fragment>
        )}
        {!isEmpty(qualified) && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Qualified Teams</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              <Qualified teams={qualified} />
            </Col>
          </React.Fragment>
        )}
      </Row>
    </React.Fragment>
  )
}

export default About
