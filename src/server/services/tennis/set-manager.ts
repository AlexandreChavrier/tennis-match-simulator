import { SetState } from '../../types/types';

// Classe pour la gestion des sets
export class SetManager {

    public isSetComplete(player1Games: number, player2Games: number): { complete: boolean, winner?: 1 | 2 } {
        // Cas général des sets gagnés avec 6 jeux et au moins 2 jeux d'écart
        if (player1Games >= 6 && player1Games - player2Games >= 2) {
            return { complete: true, winner: 1 };
        }
        if (player2Games >= 6 && player2Games - player1Games >= 2) {
            return { complete: true, winner: 2 };
        }

        // Cas spécial du score 6 - 5 puis 7 - 5 
        if (player1Games === 7 && player2Games === 5) {
            return { complete: true, winner: 1 };
        }
        if (player2Games === 7 && player1Games === 5) {
            return { complete: true, winner: 2 };
        }

        // Cas spécial du tiebreak avec victoire 7 - 6
        if (player1Games === 7 && player2Games === 6) {
            return { complete: true, winner: 1 };
        }
        if (player2Games === 7 && player1Games === 6) {
            return { complete: true, winner: 2 };
        }
        // Si aucun des cas, le set n'est pas terminé
        return { complete: false };
    }

    public isTieBreak(player1Games: number, player2Games: number): boolean {
        return player1Games === 6 && player2Games === 6;
    }

    public countSetsWon(player1Sets: SetState[], player2Sets: SetState[]): { p1Sets: number, p2Sets: number } {
        // Compte les sets gagnés du joueur en filtrant les différents sets : au moins 6 jeux et écart de 2 jeux ou 7 jeux 
        const p1SetsWon = player1Sets.filter((set, index) =>
            set.games >= 6 && (
                set.games >= 7 ||
                set.games - player2Sets[index].games >= 2
            )
        ).length;

        const p2SetsWon = player2Sets.filter((set, index) =>
            set.games >= 6 && (
                set.games >= 7 ||
                set.games - player1Sets[index].games >= 2
            )
        ).length;

        return { p1Sets: p1SetsWon, p2Sets: p2SetsWon };
    }
}