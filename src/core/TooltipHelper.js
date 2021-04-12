import React, { useState } from 'react'
import { getFlagSrc, getTeamName } from './TeamHelper'
import { Tooltip } from 'reactstrap'

export const AetTooltip = (props) => {
  const { target, anchor } = props
  const content = 'After extra time'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const AwayGoalsTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Won on away goals'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const GoldenGoalTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Golden goal'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const SilverGoalTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Silver goal'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const PenTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Penalty shoot-out'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const ReplayTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Replay'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const CoinTossTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Coin toss'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const ByeTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Bye${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const WithdrewTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Withdrew'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const MatchPostponedTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Match postponed ${notes ? notes : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const MatchVoidedTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Match voided${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const ReplacementTooltip = (props) => {
  const { target, notes } = props
  const content = `Replacement${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const PlayoffWinTooltip = (props) => {
  const { target, notes } = props
  const content = `Playoff${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const DisqualifiedTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Disqualified${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const FairPlayTooltip = (props) => {
  const { target, fp_notes } = props
  const content = `Fair play points: ${fp_notes}`
  return <TopTooltip target={target} content={content} />
}

export const Head2HeadTooltip = (props) => {
  const { target, h2h_notes, group_playoff } = props
  const content = group_playoff ? `Playoff: ${h2h_notes}` : `Head-to-head: ${h2h_notes}`
  return <TopTooltip target={target} content={content} />
}

export const DrawLotTooltip = (props) => {
  const { target, draw_lot_notes } = props
  const content = `Drawing lots: ${draw_lot_notes}`
  return <TopTooltip target={target} content={content} />
}

export const AwardedTooltip = (props) => {
  const { target, content } = props
  return <TopTooltip target={target} content={content} anchor="(awd)" />
}

export const SharedBronzeTooltip = (props) => {
  const { target, notes } = props
  return <TopTooltip target={target} content={notes} />
}

export const GoldenBallRejectedTooltip = (props) => {
  const { target, notes } = props
  const content = `Award Rejected${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const ConsolationTooltip = (props) => {
  const { target, notes } = props
  const content = notes
  return <TopTooltip target={target} content={content} />
}

export const SemifinalistsTooltip = (props) => {
  const { target } = props
  const content = `No third-place match was played. Semi-finalists are listed in alphabetical order.`
  return <TopTooltip target={target} content={content} />
}

export const Extra140Tooltip = (props) => {
  const { target } = props
  const content = `After 120 minutes expired with the score tied at 1-1, both captains and the referee agreed to play a second extra time of 2x10 minutes, meaning this match lasted 140 minutes.`
  return <TopTooltip target={target} content={content} />
}

export const WalkoverTooltip = (props) => {
  const { target, content, anchor } = props
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const CancelledTooltip = (props) => {
  const { target, notes } = props
  const content = `Cancelled${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const WildCardTooltip = (props) => {
  const { target, content } = props
  return <TopTooltip target={target} content={content} />
}

export const ExcludedFourthPlaceTooltip = (props) => {
  const { target } = props
  const content = `Excluded the results against the fourth-placed teams.`
  return <TopTooltip target={target} content={content} />
}

export const ExcludedQualfyingRoundsTooltip = (props) => {
  const { target } = props
  const content = `Excluded the results in the qualifying rounds.`
  return <TopTooltip target={target} content={content} />
}

export const SuccessorTooltip = (props) => {
  const { target, children_teams, parent_team } = props
  let content = () => {
    if (!children_teams) {
      // console.log('parent_team', parent_team)
      return (
        <React.Fragment>
          As a successor, {parent_team}'s rankings might include ones' that it succeeded.&nbsp;
          <a href={`#successor_${parent_team.replace(' ', '_')}`}>See breakdown below.</a>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        As a successor, {parent_team}'s rankings include participation as&nbsp;
        {children_teams.reverse().map((ct, index) => {
          return (
            <React.Fragment key={index}>
              <img className="flag-xxs" src={getFlagSrc(ct.id)} alt={ct.id} title={ct.id} />
              &nbsp;
              {getTeamName(ct.id)}
              {ct.year && ct.year.length === 1 && <React.Fragment>&nbsp;in {ct.year[0]}</React.Fragment>}
              {ct.year && ct.year.length > 1 && (
                <React.Fragment>
                  &nbsp;from {ct.year[ct.year.length - 1]} to {ct.year[0]}
                </React.Fragment>
              )}
              {index < children_teams.length - 2 && <React.Fragment>,&nbsp;</React.Fragment>}
              {index === children_teams.length - 2 && <React.Fragment>&nbsp;and&nbsp;</React.Fragment>}
              {index === children_teams.length - 1 && <React.Fragment>.</React.Fragment>}
            </React.Fragment>
          )
        })}
        &nbsp;<a href={`#successor_${parent_team.replace(' ', '_')}`}>See breakdown below.</a>
      </React.Fragment>
    )
  }
  return <TopTooltip target={target} content={content()} />
}

export const TopTooltip = (props) => {
  const { target, content, anchor } = props
  return (
    <TurtleTooltip target={target} placement="top" content={content}>
      <span className="box-tip-text" href="#" id={target}>
        {anchor ? anchor : '(*)'}
      </span>
    </TurtleTooltip>
  )
}

export const TurtleTooltip = (props) => {
  const { target, placement, content } = props
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <React.Fragment>
      {props.children}
      <Tooltip
        target={target}
        placement={placement}
        isOpen={tooltipOpen}
        autohide={false}
        toggle={toggle}
        delay={{ hide: 500 }}
        innerClassName="successor-tooltip"
      >
        {content}
      </Tooltip>
    </React.Fragment>
  )
}
