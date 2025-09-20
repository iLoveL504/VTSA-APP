import express from 'express'
const router = express.Router()
import { 
        getAllTeams, 
        getLastTeamId, 
        getTeamPerId, 
        getTeamDesignation, 
        forecastTeam, 
        getTeamsWithNoProject,
        getNotAssignedPE,
        assignTeam
    } from '../../controllers/teamsController.js'

router.route('/')
    .get(getAllTeams)

router.route('/latest-team')
    .get(getLastTeamId)

router.route('/team-designation/:id')   
    .get(getTeamDesignation)

router.route('/forecast-team')
    .post(forecastTeam)

router.route('/no-project')
    .get(getTeamsWithNoProject)

router.route('/not-assigned-PE')
    .get(getNotAssignedPE)

router.route('/assign')
    .post(assignTeam)

router.route('/:id')   
    .get(getTeamPerId)

export { router }