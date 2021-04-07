import React from 'react'
import { DisplaySchedule, getRoundMatches, hasReplay, getBracketStage, getFinalPathStage, getConsolationPathStage } from './MatchHelper'
// import { hasReplay } from './RankingsHelper'
// import Bracket from './Bracket'

const Knockout = (props) => {
  const { stage, config } = props
  // const final_path_bracket_stage = getBracketStage(getFinalPathStage(stage))
  // const consolation_path_bracket_stage = getBracketStage(getConsolationPathStage(stage))
  // const consolationBracketName = stage.rounds && stage.rounds.find((r) => r.name === 'Playoff First Round') !== undefined ? 'Playoff' : 'Consolation'
  // const bracketConfig = {
  //   tournamentTypeId: config.tournament_type_id,
  //   goldenGoal: config.golden_goal_rule,
  //   silverGoal: config.silver_goal_rule,
  //   logo_path: config.logo_path,
  //   team_type_id: config.team_type_id,
  //   showMatchYear: config.show_match_year,
  // }
  // const bracketConsolationConfig = {
  //   consolation_bracket: true,
  //   consolation_bracket_name: consolationBracketName,
  //   ...bracketConfig,
  // }
  const displayScheduleConfig = {
    knockout_match: true,
    ...config,
    ...stage.config,
  }
  return (
    <React.Fragment>
      {/* {!stage.hide_bracket && <Bracket stage={final_path_bracket_stage} config={bracketConfig} />}
      {stage.consolation_round && <Bracket stage={consolation_path_bracket_stage} config={bracketConsolationConfig} />} */}
      {stage.rounds.map((r) => {
        const matchArray = getRoundMatches(r, true)
        // console.log('matchArray', matchArray)
        if (!hasReplay(r)) {
          return (
            <DisplaySchedule round={matchArray} config={displayScheduleConfig} details={r.details} key={r.name} />
            // <DisplaySchedule round={{ name: r.name, ...matchArray, consolation_notes: r.consolation_notes }} config={displayScheduleConfig} key={r.name} />
          )
        } else {
          return (
            <React.Fragment key={r.name}>
              {/* <DisplaySchedule round={{ name: r.name, ...matchArray[0], consolation_notes: r.consolation_notes }} config={displayScheduleConfig} />
              <DisplaySchedule round={{ ...matchArray[1], consolation_notes: r.consolation_notes }} config={displayScheduleConfig} /> */}
            </React.Fragment>
          )
        }
      })}
    </React.Fragment>
  )
}

export default Knockout
