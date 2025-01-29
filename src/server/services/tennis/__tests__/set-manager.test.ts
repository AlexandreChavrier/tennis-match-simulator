import { SetManager } from '../set-manager';
import { SetState } from '../../../types/types';

describe('SetManager', () => {
    let setManager: SetManager;

    beforeEach(() => {
        setManager = new SetManager();
    });

    describe('isSetComplete', () => {
        it('should return set complete when player1 wins with 6-4', () => {
            const result = setManager.isSetComplete(6, 4);
            expect(result).toEqual({ complete: true, winner: 1 });
        });

        it('should return set complete when player1 wins 7-5', () => {
            const result = setManager.isSetComplete(7, 5);
            expect(result).toEqual({ complete: true, winner: 1 });
        });


        it('should return set complete when player1 wins 7-6', () => {
            const result = setManager.isSetComplete(7, 6);
            expect(result).toEqual({ complete: true, winner: 1 });
        });

        it('should return set complete when player2 wins with 6-4', () => {
            const result = setManager.isSetComplete(4, 6);
            expect(result).toEqual({ complete: true, winner: 2 });
        });

        it('should return set complete when player2 wins 7-5', () => {
            const result = setManager.isSetComplete(5, 7);
            expect(result).toEqual({ complete: true, winner: 2 });
        });

        it('should return set complete when player2 wins 7-6', () => {
            const result = setManager.isSetComplete(6, 7);
            expect(result).toEqual({ complete: true, winner: 2 });
        });

        it('should return set not complete for 5-5', () => {
            const result = setManager.isSetComplete(5, 5);
            expect(result).toEqual({ complete: false });
        });

        it('should return set not complete for 6-5', () => {
            const result = setManager.isSetComplete(6, 5);
            expect(result).toEqual({ complete: false });
        });
    });

    describe('isTieBreak', () => {
        it('should return true when both players have 6 games', () => {
            const result = setManager.isTieBreak(6, 6);
            expect(result).toBe(true);
        });

        it('should return false when players have different game counts', () => {
            const result = setManager.isTieBreak(6, 5);
            expect(result).toBe(false);
        });
    });

    describe('countSetsWon', () => {
        it('should count sets won correctly', () => {
            const player1Sets: SetState[] = [
                { games: 6, points: { currentGame: '0', points: 0 } },
                { games: 2, points: { currentGame: '0', points: 0 } },
                { games: 6, points: { currentGame: '0', points: 0 } }
            ];

            const player2Sets: SetState[] = [
                { games: 4, points: { currentGame: '0', points: 0 } },
                { games: 6, points: { currentGame: '0', points: 0 } },
                { games: 3, points: { currentGame: '0', points: 0 } }
            ];

            const result = setManager.countSetsWon(player1Sets, player2Sets);
            expect(result).toEqual({ p1Sets: 2, p2Sets: 1 });
        });

        it('should handle empty sets array', () => {
            const result = setManager.countSetsWon([], []);
            expect(result).toEqual({ p1Sets: 0, p2Sets: 0 });
        });

        it('should count sets with different winning conditions', () => {
            const player1Sets: SetState[] = [
                { games: 6, points: { currentGame: '0', points: 0 } },
                { games: 7, points: { currentGame: '0', points: 0 } }, 
                { games: 5, points: { currentGame: '0', points: 0 } }    
            ];

            const player2Sets: SetState[] = [
                { games: 7, points: { currentGame: '0', points: 0 } },
                { games: 5, points: { currentGame: '0', points: 0 } },
                { games: 7, points: { currentGame: '0', points: 0 } }
            ];

            const result = setManager.countSetsWon(player1Sets, player2Sets);
            expect(result).toEqual({ p1Sets: 1, p2Sets: 2 });
        });
    });
});