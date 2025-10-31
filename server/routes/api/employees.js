import express from 'express'
const router = express.Router()
import { getEmployees, findEmployee, updateEmployee, getDesignatedProject, createEmployee, deleteEmployee } from "../../controllers/employeesController.js"

router.route('/')
    .get(getEmployees)
    .post(createEmployee)

router.route('/:id/designated-project')
    .get(getDesignatedProject)

router.route('/:id')
    .get(findEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)



export { router }


















