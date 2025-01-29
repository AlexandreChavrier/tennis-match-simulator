import { MatchState } from '../../types/types';
import { SetManager } from './set-manager';  // Ajouter cet import

// Classe pour la gestion de l'état du match
export class MatchStateManager {
    constructor(private setManager: SetManager) {}  // Injection de SetManager

    public createInitialMatchState(): MatchState {
        return {
            player1: {
                sets: [],
                currentSet: {
                    games: 0,
                    points: {
                        currentGame: "0",
                        points: 0
                    }
                }
            },
            player2: {
                sets: [],
                currentSet: {
                    games: 0,
                    points: {
                        currentGame: "0",
                        points: 0
                    }
                }
            },
            isComplete: false
        };
    }

    public handleGameWin(matchState: MatchState, winner: 1 | 2): void {

        // Incrémententation des points des jeux des joueurs
        if (winner === 1) {
            matchState.player1.currentSet.games++;
        } else {
            matchState.player2.currentSet.games++;
        }

        // Mis à jour du score du jeu en cours à 0 pour prochains jeux
        matchState.player1.currentSet.points = { currentGame: "0" , points: 0 };
        matchState.player2.currentSet.points = { currentGame: "0" , points: 0 };

        const setStatus = this.setManager.isSetComplete(matchState.player1.currentSet.games, matchState.player2.currentSet.games);

        // Vérifie si le set est terminé
        if (setStatus.complete) {
            this.handleSetWin(matchState);
        }
    }

    public handleSetWin(matchState: MatchState): void {

        // Pousse le score des set terminé pour chacun des joueurs 
        matchState.player1.sets.push({ ...matchState.player1.currentSet });
        matchState.player2.sets.push({ ...matchState.player2.currentSet });

        // Mis à jour du score du set en cours à 0 pour prochains sets
        matchState.player1.currentSet = { games: 0, points: { currentGame: "0", points: 0 }};
        matchState.player2.currentSet = { games: 0, points: { currentGame: "0", points: 0 }};
    }

    public checkMatchComplete(matchState: MatchState, player1Name: string, player2Name: string): void {
        const setsWon = this.setManager.countSetsWon(matchState.player1.sets, matchState.player2.sets);
        
        // Vérifie si le match est terminé : au moins 3 sets gagnés
        if (setsWon.p1Sets >= 3) {
            matchState.isComplete = true;
            matchState.winner = player1Name;
        } else if (setsWon.p2Sets >= 3) {
            matchState.isComplete = true;
            matchState.winner = player2Name;
        }
    }
}