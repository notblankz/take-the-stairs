import express from 'express';

const router = express.Router();

router.get("/landing", (req, res) => {
    res.render("landing");
})

export default router;
