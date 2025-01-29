import { MatchState } from '../../types/types';
import { TennisScoreCalculator } from './score-calculator';
import { MatchStateManager } from './match-state-manager';

// Classe pour la gestion des points
export class PointHandler {
    constructor(
        private scoreCalculator: TennisScoreCalculator,
        private matchStateManager: MatchStateManager
    ) {}

    public handleRegularPoint(matchState: MatchState, winner: 1 | 2): void {
        // Incrémentation des points des joueurs
        if (winner === 1) {
            matchState.player1.currentSet.points.points++;
        } else {
            matchState.player2.currentSet.points.points++;
        }

        const p1Points = matchState.player1.currentSet.points.points;
        const p2Points = matchState.player2.currentSet.points.points;

        // Calcul le score du jeu en cours en fonction des points des joueurs
        const gameScore = this.scoreCalculator.calculateGameScore(p1Points, p2Points);

        matchState.player1.currentSet.points.currentGame = gameScore.player1Score;
        matchState.player2.currentSet.points.currentGame = gameScore.player2Score;

        // Vérifie s'il existe un gagnant pour le jeu en cours 
        if (gameScore.player1Score === "Game" || gameScore.player2Score === "Game") {
            this.matchStateManager.handleGameWin(matchState, winner);
        }
    }

    public handleTieBreakPoint(matchState: MatchState, winner: 1 | 2): void {
        // Incrémententation des points du tie-break
        if (winner === 1) {
            matchState.player1.currentSet.points.points++;
        } else {
            matchState.player2.currentSet.points.points++;
        }

        const p1Points = matchState.player1.currentSet.points.points;
        const p2Points = matchState.player2.currentSet.points.points;

        // Calcul le score du tiebreak en cours en fonction des points des joueurs
        const tieBreakScore = this.scoreCalculator.calculateTieBreakScore(p1Points, p2Points);

        matchState.player1.currentSet.points.currentGame = tieBreakScore.player1Score;
        matchState.player2.currentSet.points.currentGame = tieBreakScore.player2Score;

        // Vérifie s'il existe un gagnant pour le tiebreak en cours 
        if (tieBreakScore.complete && tieBreakScore.winner) {
            this.matchStateManager.handleGameWin(matchState, tieBreakScore.winner);
        }
    }
}