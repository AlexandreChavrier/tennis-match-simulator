import { PointHandler } from '../point-handler';
import { TennisScoreCalculator } from '../score-calculator';
import { MatchStateManager } from '../match-state-manager';
import { MatchState } from '../../../types/types';

describe('PointHandler', () => {
    let pointHandler: PointHandler;
    let mockScoreCalculator: jest.Mocked<TennisScoreCalculator>;
    let mockMatchStateManager: jest.Mocked<MatchStateManager>;
    let mockMatchState: MatchState;

    beforeEach(() => {
        mockScoreCalculator = {
            calculateGameScore: jest.fn(),
            calculateTieBreakScore: jest.fn()
        } as any;

        mockMatchStateManager = {
            handleGameWin: jest.fn()
        } as any;

        mockMatchState = {
            player1: {
                currentSet: {
                    points: {
                        points: 0,
                        currentGame: '0'
                    }
                }
            },
            player2: {
                currentSet: {
                    points: {
                        points: 0,
                        currentGame: '0'
                    }
                }
            }
        } as MatchState;

        pointHandler = new PointHandler(
            mockScoreCalculator,
            mockMatchStateManager
        );
    });

    describe('handleRegularPoint', () => {
        it('should increment points for the winning player', () => {
            // Préparer le mock du calcul de score
            mockScoreCalculator.calculateGameScore.mockReturnValue({
                player1Score: '15',
                player2Score: '0'
            });

            // Appeler la méthode avec le joueur 1 comme gagnant
            pointHandler.handleRegularPoint(mockMatchState, 1);

            // Vérifier que les points ont été incrémentés
            expect(mockMatchState.player1.currentSet.points.points).toBe(1);
            expect(mockMatchState.player1.currentSet.points.currentGame).toBe('15');
        });

        it('should call handleGameWin when a player wins the game', () => {
            // Préparer le mock du calcul de score pour une victoire du jeu
            mockScoreCalculator.calculateGameScore.mockReturnValue({
                player1Score: 'Game',
                player2Score: '0'
            });

            // Appeler la méthode avec le joueur 1 comme gagnant
            pointHandler.handleRegularPoint(mockMatchState, 1);

            // Vérifier que handleGameWin a été appelé
            expect(mockMatchStateManager.handleGameWin).toHaveBeenCalledWith(
                mockMatchState, 1
            );
        });
    });

    describe('handleTieBreakPoint', () => {
        it('should increment points for the winning player in tiebreak', () => {
            // Préparer le mock du calcul de score du tiebreak
            mockScoreCalculator.calculateTieBreakScore.mockReturnValue({
                player1Score: '1',
                player2Score: '0',
                complete: false,
                winner: 1,
            });

            // Appeler la méthode avec le joueur 1 comme gagnant
            pointHandler.handleTieBreakPoint(mockMatchState, 1);

            // Vérifier que les points ont été incrémentés
            expect(mockMatchState.player1.currentSet.points.points).toBe(1);
            expect(mockMatchState.player1.currentSet.points.currentGame).toBe('1');
        });

        it('should call handleGameWin when tiebreak is complete', () => {
            // Préparer le mock du calcul de score du tiebreak pour une victoire
            mockScoreCalculator.calculateTieBreakScore.mockReturnValue({
                player1Score: '7',
                player2Score: '5',
                complete: true,
                winner: 1
            });

            // Appeler la méthode avec le joueur 1 comme gagnant
            pointHandler.handleTieBreakPoint(mockMatchState, 1);

            // Vérifier que handleGameWin a été appelé
            expect(mockMatchStateManager.handleGameWin).toHaveBeenCalledWith(
                mockMatchState, 1
            );
        });
    });
});