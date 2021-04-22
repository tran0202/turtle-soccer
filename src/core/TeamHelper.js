import React from 'react'
import NationArray from '../data/Nations.json'
import { getTeamArray } from './DataHelper'

export const getFlagSrc = (id) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    const nation = NationArray.find((n) => n.id === team.nation_id)
    if (nation) {
      return '/images/flags/' + nation.flag_filename
    } else {
      console.log('Nation error', nation)
    }
  } else {
    console.log('Team error', team)
  }
}

export const getNationSmallFlagImg = (id) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    const nation = NationArray.find((n) => n.id === team.nation_id)
    if (nation) {
      return (
        <React.Fragment>
          <img className="flag-xs-2 flag-sm-3" src={`/images/flags/${nation.flag_filename}`} alt={nation.id} title={nation.id} />
        </React.Fragment>
      )
    } else {
      console.log('Nation error', nation)
    }
  } else {
    console.log('Team error', team)
  }
}

export const getClubLogoImg = (id, config) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    return (
      <React.Fragment>
        <img className="flag-club-sm flag-club-md" src={`/images/${config.logo_path}/${team.logo_filename}`} alt={id} title={id} />
      </React.Fragment>
    )
  } else {
    console.log('Team error', team)
  }
}

export const getTeamFlag = (id, config) => {
  if (!id) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
      {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id)}
      {config.team_type_id !== 'CLUB' && (
        <img className="flag-sm flag-md" src={getFlagSrc(id)} alt={`${id} ${getNationOfficialName(id)}`} title={`${id} ${getNationOfficialName(id)}`} />
      )}
    </React.Fragment>
  )
}

export const getTeamFlagName = (id, config) => {
  if (!id) return
  return (
    <React.Fragment>
      {getTeamFlag(id, config)}
      <span className="padding-top-xs">&nbsp;{getTeamName(id)}</span>
    </React.Fragment>
  )
}

export const getNationOfficialName = (id) => {
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    const nation = NationArray.find((n) => n.id === team.nation_id)
    if (nation) {
      return nation.official_name
    } else {
      console.log('Nation error', nation)
    }
  } else {
    console.log('Team error', team)
  }
}

export const getTeamName = (id) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    return team.name
  } else {
    console.log('Team error', team)
  }
}

export const getShortTeamName = (id) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    if (team.short_name) {
      return team.short_name
    } else {
      return team.name
    }
  } else {
    console.log('Team error', team)
  }
}

export const getBracketTeamName = (id) => {
  return getShortTeamName(id)
}

export const getParentTeam = (id) => {
  const team = getTeamArray().find((t) => t.id === id)
  return getTeamArray().find((t) => t.id === team.parent_team_id)
}

export const getBracketTeamCode = (id, config) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (!team) {
    console.log('Team error', team)
    return
  }
  if (config.team_type_id === 'CLUB') {
    return team.id
  }
  const nation = NationArray.find((n) => n.id === team.nation_id)
  if (!nation) {
    console.log('Nation error', nation)
  } else if (!nation.code) {
    return team.nation_id
  } else {
    return nation.code
  }
}

export const isSuccessor = (id) => {
  const team = getTeamArray().find((t) => t.id === id)
  return !team.successor ? false : team.successor
}
