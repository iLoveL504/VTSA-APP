import express from 'express'
const router = express.Router()
import { getEmployees, findEmployee, updateEmployee, getDesignatedProject} from "../../controllers/employeesController.js"

router.route('/')
    .get(getEmployees)

router.route('/:id/designated-project')
    .get(getDesignatedProject)

router.route('/:id')
    .get(findEmployee)
    .put(updateEmployee)



export { router }


















