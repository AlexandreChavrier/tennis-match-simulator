// Définition d'un joueur
export interface Player {
    name: string;
    level: number;
}

// L'état d'un jeu en cours
export interface GameState {
    currentGame: string;
    points: number;
}

// L'état d'un set en cours
export interface SetState {
    games: number;
    points: GameState; // État du jeu en cours dans ce set
}


// L'état complet d'un match
export interface MatchState {
    player1: {
        sets: SetState[];
        currentSet: SetState;
    };
    player2: {
        sets: SetState[];
        currentSet: SetState;
    };
    isComplete: boolean;
    winner?: string;

}

// Représente un point joué
export interface Point {
    pointNumber: number;
    winner: string;
}

// Paramètres initiaux du match
export interface MatchSettings {
    player1: Player;
    player2: Player;
    points: Point[];
}
