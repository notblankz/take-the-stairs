import express from 'express'

const router = express.Router()

router.get("/events", (req, res) => {
    res.render("events")
})

export default router
