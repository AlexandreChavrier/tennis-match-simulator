import express from 'express';
import { TennisService } from '../services/tennis.service';

const router = express.Router();
const tennisService = new TennisService();

router.post('/calculate-score', async (req, res) => {
    try {
        const { player1, player2, points } = req.body;
        const matchResult = tennisService.calculateMatchScore(player1, player2, points);
        res.json(matchResult);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export const tennisRouter = router;