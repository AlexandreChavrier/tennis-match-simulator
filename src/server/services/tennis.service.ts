import { match } from 'node:assert';
import { Player, Point, MatchState, SetState, GameState } from '../types/types';

export class TennisService {

    // Convertir les points en score tennis
    private pointsToScore(points: number): string {
        switch (points) {
            case 0: return "O";
            case 1: return "15";
            case 2: return "30";
            case 3: return "40";
            default: return "40";
        }
    }

    private isSetComplete(player1Games: number, player2Games: number): { complete: boolean, winner?: 1 | 2 } {

        // Cas général des sets gagnés avec 6 jeux et au moins 2 jeux d'écart
        if (player1Games >= 6 && player1Games - player2Games >= 2) {
            return { complete: true, winner: 1};
        }
        if (player2Games >= 6 && player2Games - player1Games >= 2) {
            return { complete: true, winner: 2};
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

    private isTieBreak(player1Games: number, player2Games: number): boolean {
        return player1Games === 6 && player2Games === 6;
    }

    private calculateTieBreakScore(player1Points: number, player2Points: number): { player1Score: string, player2Score: string, complete: boolean, winner?: 1 | 2 } {

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


    private calculateGameScore(player1Points: number, player2Points: number): { player1Score: string, player2Score: string} {

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

    // Méthode publique car utilisée dans tennis.routes.ts
    calculateMatchScore(player1: Player, player2: Player, points: Point[]): MatchState {

        // Initialisation d'un match à zéro
        let matchState = this.createInitialMatchState();

        points.forEach((point, index) => {
            const currentPlayer = point.winner === player1.name ? 1 : 2;

            // Vérification de l'état initial du match
            if (matchState.isComplete) {
                return;
            }

            const isTieBreak = this.isTieBreak(matchState.player1.currentSet.games, matchState.player2.currentSet.games);

            // Gestion du calcul du score du match s'il y a tiebreak ou non
            if (isTieBreak) {
                this.handleTieBreakPoint(matchState, currentPlayer);
            } else {
                this.handleRegularPoint(matchState, currentPlayer);
            }
            
            // Mis à jour de l'état actuel du match pour vérifier s'il est terminé ou non
            this.checkMatchComplete(matchState, player1.name, player2.name);
        });

        return matchState;
    }

    private handleRegularPoint(matchState: MatchState, winner: 1 | 2): void {

        // Incrémentation des points des joueurs
        if (winner === 1) {
            matchState.player1.currentSet.points.points++;
        } else {
            matchState.player2.currentSet.points.points++;
        }

        const p1Points = matchState.player1.currentSet.points.points++;
        const p2Points = matchState.player2.currentSet.points.points++;

        // Calcul le score du jeu en cours en fonction des points des joueurs
        const gameScore = this.calculateGameScore(p1Points, p2Points);

        matchState.player1.currentSet.points.currentGame = gameScore.player1Score;
        matchState.player2.currentSet.points.currentGame = gameScore.player2Score;

        // Vérifie s'il existe un gagnant pour le jeu en cours 
        if (gameScore.player1Score === "Game" || gameScore.player2Score === "Game") {
            this.handleGameWin(matchState, winner);
        }
    }

    private handleTieBreakPoint(matchState: MatchState, winner: 1 | 2): void {

        // Incrémententation des points du tie-break
        if (winner === 1) {
            matchState.player1.currentSet.points.points++;
        } else {
            matchState.player2.currentSet.points.points++;
        }

        const p1Points = matchState.player1.currentSet.points.points;
        const p2Points = matchState.player2.currentSet.points.points;

        // Calcul le score du tiebreak en cours en fonction des points des joueurs
        const tieBreakScore = this.calculateTieBreakScore(p1Points, p2Points);

        matchState.player1.currentSet.points.currentGame = tieBreakScore.player1Score;
        matchState.player2.currentSet.points.currentGame = tieBreakScore.player2Score;

        // Vérifie s'il existe un gagnant pour le tiebreak en cours 
        if (tieBreakScore.complete && tieBreakScore.winner) {
            this.handleGameWin(matchState, tieBreakScore.winner);
        }
    }

    private handleGameWin(matchState: MatchState, winner: 1 | 2): void {

        // Incrémententation des points des jeux des joueurs
        if (winner === 1) {
            matchState.player1.currentSet.games++;
        } else {
            matchState.player2.currentSet.games++;
        }

        // Mis à jour du score du jeu en cours à 0 pour prochains jeux
        matchState.player1.currentSet.points = { currentGame: "0" , points: 0 };
        matchState.player2.currentSet.points = { currentGame: "0" , points: 0 };

        const setStatus = this.isSetComplete(matchState.player1.currentSet.games, matchState.player2.currentSet.games);

        // Vérifie si le set est terminé
        if (setStatus.complete) {
            this.handleSetWin(matchState);
        }
    }

    private handleSetWin(matchState: MatchState): void {

        // Pousse le score des set terminé pour chacun des joueurs 
        matchState.player1.sets.push({ ...matchState.player1.currentSet });
        matchState.player2.sets.push({ ...matchState.player2.currentSet });

        // Mis à jour du score du set en cours à 0 pour prochains sets
        matchState.player1.currentSet = { games: 0, points: { currentGame: "0", points: 0 }};
        matchState.player2.currentSet = { games: 0, points: { currentGame: "0", points: 0 }};
    }

    private countSetsWon(player1Sets: SetState[], player2Sets: SetState[]): { p1Sets: number, p2Sets: number} {

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

    private checkMatchComplete(matchState: MatchState, player1Name: string, player2Name: string): void {
        const setsWon = this.countSetsWon(matchState.player1.sets, matchState.player2.sets);
        
        // Vérifie si le match est terminé : au moins 3 sets gagnés
        if (setsWon.p1Sets >= 3) {
            matchState.isComplete = true;
            matchState.winner = player1Name;
        } else if (setsWon.p2Sets >= 3) {
            matchState.isComplete = true;
            matchState.winner = player2Name;
        }
    }


    private createInitialMatchState(): MatchState {
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
}