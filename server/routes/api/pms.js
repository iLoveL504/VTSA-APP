import express from 'express'
const router = express.Router()

import {
    makePMSEntry
} from '../../controllers/pmsController.js'

router.route('/:id')
    .put(makePMSEntry)

export {router}