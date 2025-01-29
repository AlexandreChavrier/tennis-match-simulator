import { TennisScoreCalculator } from "../score-calculator";

describe('TennisScoreCalculator', () => {
    let calculator: TennisScoreCalculator;

    beforeEach(() => {
        calculator = new TennisScoreCalculator;
    });

    describe('pointsToScore', () => {
        it('should convert points to tennis score notation', () => {
            expect(calculator['pointsToScore'](0)).toBe('0');
            expect(calculator['pointsToScore'](1)).toBe('15');
            expect(calculator['pointsToScore'](2)).toBe('30');
            expect(calculator['pointsToScore'](3)).toBe('40');
        });
    });

    describe('calculateGameScore', () => {
        it('should handle normal scoring', () => {
            const result = calculator.calculateGameScore(2, 1);
            expect(result).toEqual({
                player1Score: '30',
                player2Score: '15'
            });
        });

        it('should handle equality', () => {
            const result = calculator.calculateGameScore(3, 3);
            expect(result).toEqual({
                player1Score: '40',
                player2Score: '40'
            });
        });

        it('should handle advantage', () => {
            const result = calculator.calculateGameScore(4, 3);
            expect(result).toEqual({
                player1Score: 'AV',
                player2Score: '-'
            });
        });

        it('should handle game win', () => {
            const result = calculator.calculateGameScore(4, 2);
            const result2 = calculator.calculateGameScore(5, 3);
            expect(result).toEqual({
                player1Score: 'Game',
                player2Score: '0'
            });
            expect(result2).toEqual({
                player1Score: 'Game',
                player2Score: '0'
            });
        });
    });
});

