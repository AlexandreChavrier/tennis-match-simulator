import { match } from 'node:assert';
import { Player, Point, MatchState } from '../../types/types';
import { SetManager, PointHandler, TennisScoreCalculator, MatchStateManager } from '../';

// Classe principale
export class TennisService {

    private scoreCalculator: TennisScoreCalculator;
    private setManager: SetManager;
    private pointHandler: PointHandler;
    private matchStateManager: MatchStateManager;

    constructor() {
        this.scoreCalculator = new TennisScoreCalculator();
        this.setManager = new SetManager();
        this.matchStateManager = new MatchStateManager(this.setManager);
        this.pointHandler = new PointHandler(
            this.scoreCalculator,
            this.matchStateManager
        );
    }

    // Méthode publique car utilisée dans tennis.routes.ts
    public calculateMatchScore(player1: Player, player2: Player, points: Point[]): MatchState {
        // Initialisation d'un match à zéro
        let matchState = this.matchStateManager.createInitialMatchState();

        points.forEach((point, index) => {
            const currentPlayer = point.winner === player1.name ? 1 : 2;

            // Vérification de l'état initial du match
            if (matchState.isComplete) {
                return;
            }

            const isTieBreak = this.setManager.isTieBreak(matchState.player1.currentSet.games, matchState.player2.currentSet.games);

            // Gestion du calcul du score du match s'il y a tiebreak ou non
            if (isTieBreak) {
                this.pointHandler.handleTieBreakPoint(matchState, currentPlayer);
            } else {
                this.pointHandler.handleRegularPoint(matchState, currentPlayer);
            }

            // Mis à jour de l'état actuel du match pour vérifier s'il est terminé ou non
            this.matchStateManager.checkMatchComplete(matchState, player1.name, player2.name);
        });

        return matchState;
    }
}