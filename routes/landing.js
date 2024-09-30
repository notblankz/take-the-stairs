import express from 'express';

const router = express.Router();

router.get("/landing", (req, res) => {
    const errorMessage = req.query.error;
    res.render("landing", {errorMessage});
})

export default router;
