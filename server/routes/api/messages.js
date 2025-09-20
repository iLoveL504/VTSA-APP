import express from 'express'
const router = express.Router()

router.route('/send')
    .post((req, res) => {res.send(req.body)})

export {router}