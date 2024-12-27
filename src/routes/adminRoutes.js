import express from 'express'
import { store } from '../store/index.js'

const router = express.Router();

router.post('/discount/generate', (req, res) => {
    const code = store.generateDiscountCode();
    res.json({ code});
});

router.get('/stats', (req, res) => {
    const stats = store.getStats();
    res.json(stats);
})

export default router