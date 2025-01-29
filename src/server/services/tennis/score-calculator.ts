// Classe pour la logique de calcul des scores
export class TennisScoreCalculator {

    public pointsToScore(points: number): string {
        // Conversion des points en score tennis
        switch (points) {
            case 0: return "0";
            case 1: return "15";
            case 2: return "30";
            case 3: return "40";
            default: return "40";
        }
    }

    public calculateGameScore(player1Points: number, player2Points: number): { player1Score: string, player2Score: string } {
        if (player1Points === player2Points && player1Points >= 3) {
            return { player1Score: "40", player2Score: "40" };
        }

        // Lorsqu'un joueur à au moins 4 points
        if (Math.max(player1Points, player2Points) >= 4) {
            const diff = player1Points - player2Points;

            // Cas normaux lorsque le jeu est gagné avec au moins 2 points d'écarts
            if (diff >= 2) {
                return { player1Score: "Game", player2Score: "0" };
            }
            if (diff <= -2) {
                return { player1Score: "0", player2Score: "Game" };
            }

            // Cas pour les avantages lorsqu'il y a égalité dans un jeu
            if (diff === 1) {
                return { player1Score: "AV", player2Score: "-" }
            }
            if (diff === -1) {
                return { player1Score: "-", player2Score: "AV" }
            }
        }
        // Sinon retourne le jeu en cours avec la conversion en score tennis
        return { player1Score: this.pointsToScore(player1Points), player2Score: this.pointsToScore(player2Points) };
    }

    public calculateTieBreakScore(player1Points: number, player2Points: number): { player1Score: string, player2Score: string, complete: boolean, winner?: 1 | 2 } {

        // Cas de victoire du tiebreak
        if (player1Points >= 7 && player1Points - player2Points >= 2) {
            return { player1Score: player1Points.toString(), player2Score: player2Points.toString(), complete: true, winner: 1 };
        }
        if (player2Points >= 7 && player2Points - player1Points >= 2) {
            return { player1Score: player1Points.toString(), player2Score: player2Points.toString(), complete: true, winner: 2 };
        }
        // Si pas de victoire, retourne le score du tiebreak en cours
        return { player1Score: player1Points.toString(), player2Score: player2Points.toString(), complete: false };
    }

}