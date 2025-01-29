import { MatchStateManager } from '../match-state-manager';
import { MatchState } from '../../../types/types';
import { SetManager } from '../set-manager';
import { match } from 'assert';
import exp from 'constants';

describe('MatchStateManager', () => {
    let matchStateManager: MatchStateManager;
    let mockSetManager: jest.Mocked<SetManager>;
    let mockMatchState: MatchState;

    beforeEach(() => {
        mockSetManager = {
            isSetComplete: jest.fn(),
            countSetsWon: jest.fn(),
        } as any;

        mockMatchState = {
            player1: {
                sets: [],
                currentSet: {
                    games: 0,
                    points: {
                        points: 0,
                        currentGame: '0'
                    }
                }
            },
            player2: {
                sets: [],
                currentSet: {
                    games: 0,
                    points: {
                        points: 0,
                        currentGame: '0'
                    }
                }
            },
            isComplete: false
        } as MatchState;

        matchStateManager = new MatchStateManager(
            mockSetManager
        );
    });

    describe('createInitialMatchState', () => {
        it('should create a new match state with initial values', () => {
            const initialMatchState = matchStateManager.createInitialMatchState();

            expect(initialMatchState.player1.sets).toEqual([]);
            expect(initialMatchState.player1.currentSet.games).toBe(0);
            expect(initialMatchState.player1.currentSet.points.currentGame).toBe('0');
            expect(initialMatchState.player1.currentSet.points.points).toBe(0);

            expect(initialMatchState.player2.sets).toEqual([]);
            expect(initialMatchState.player2.currentSet.games).toBe(0);
            expect(initialMatchState.player2.currentSet.points.currentGame).toBe('0');
            expect(initialMatchState.player2.currentSet.points.points).toBe(0);

            expect(initialMatchState.isComplete).toBe(false);
        });
    });

    describe('handleGameWin', () => {
        it('should increment games for the winner', () => {
            mockSetManager.isSetComplete.mockReturnValue({ complete: false });

            matchStateManager.handleGameWin(mockMatchState, 1);

            expect(mockMatchState.player1.currentSet.games).toBe(1);
            expect(mockMatchState.player1.currentSet.points.currentGame).toBe("0");
            expect(mockMatchState.player1.currentSet.points.points).toBe(0);

            matchStateManager.handleGameWin(mockMatchState, 2);

            expect(mockMatchState.player2.currentSet.games).toBe(1);
            expect(mockMatchState.player2.currentSet.points.currentGame).toBe("0");
            expect(mockMatchState.player2.currentSet.points.points).toBe(0);
        });
    });

    describe('handleSetWin', () => {
        it("should push set's completed score for each players", () => {
            mockMatchState.player1.currentSet.games = 6;
            mockMatchState.player1.currentSet.points = { points: 3, currentGame: '40' };

            matchStateManager.handleSetWin(mockMatchState);

            expect(mockMatchState.player1.sets.length).toBe(1);
            expect(mockMatchState.player1.sets[0].games).toBe(6);
            expect(mockMatchState.player1.currentSet.games).toBe(0);
            expect(mockMatchState.player1.currentSet.points.points).toBe(0);
            expect(mockMatchState.player1.currentSet.points.currentGame).toBe('0');
        });
    });

    describe('checkMatchComplete', () => {
        it('should mark match as complete when player1 wins 3 sets', () => {
            mockSetManager.countSetsWon.mockReturnValue({ p1Sets: 3, p2Sets: 0 });

            matchStateManager.checkMatchComplete(mockMatchState, 'Player1', 'Player2');

            expect(mockMatchState.isComplete).toBe(true);
            expect(mockMatchState.winner).toBe('Player1');
        });

        it('should mark match as complete when player2 wins 3 sets', () => {
            mockSetManager.countSetsWon.mockReturnValue({ p1Sets: 0, p2Sets: 3 });

            matchStateManager.checkMatchComplete(mockMatchState, 'Player1', 'Player2');

            expect(mockMatchState.isComplete).toBe(true);
            expect(mockMatchState.winner).toBe('Player2');
        });
    });
});