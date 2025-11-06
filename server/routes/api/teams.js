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
        assignTeam,
        getProjectManpower,
        getCompositionPerId,
        editTeam,
        assignProjPIC,
        getTncTechProjects,
        getqaqcTechProjects
    } from '../../controllers/teamsController.js'

router.route('/')
    .get(getAllTeams)

router.route('/latest-team')
    .get(getLastTeamId)

router.route('/tnc-techs')
    .get(getTncTechProjects)
router.route('/qaqc-techs')
    .get(getqaqcTechProjects)

router.route('/edit/:id')
    .post(editTeam)

router.route('/assign-pic/:id')
    .put(assignProjPIC)

router.route('/project-manpower')
    .get(getProjectManpower)

router.route('/project-manpower/:id')
    .get(getCompositionPerId)

router.route('/team-designation/:id')   
    .get(getTeamDesignation)

router.route('/forecast-team')
    .get(forecastTeam)

router.route('/no-project')
    .get(getTeamsWithNoProject)

router.route('/not-assigned-PE')
    .get(getNotAssignedPE)

router.route('/assign/:id')
    .post(assignTeam)

router.route('/:id')   
    .get(getTeamPerId)

export { router }