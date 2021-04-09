import React from 'react'
import { DisplaySchedule, getRoundMatches, hasReplay, getBracketStage, getFinalPathStage, getConsolationPathStage } from './MatchHelper'
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
          return <DisplaySchedule round={matchArray} config={displayScheduleConfig} details={r.details} key={r.details.name} />
        } else {
          const replayDetails = { ...r.details, name: `${r.details.name} Replay` }
          return (
            <React.Fragment key={r.details.name}>
              <DisplaySchedule round={matchArray[0]} config={displayScheduleConfig} details={r.details} />
              <DisplaySchedule round={matchArray[1]} config={displayScheduleConfig} details={replayDetails} />
            </React.Fragment>
          )
        }
      })}
    </React.Fragment>
  )
}

export default Knockout
