import getTruncatedString from '../getTruncatedString';

describe('getTruncatedString', () => {
    test('should truncate string in the beginning', () => {
        const result = getTruncatedString('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet', {
            type: 'head',
            length: 10,
        });

        expect(result).toEqual('...r sit amet');
    });

    test('should truncate string in the middle', () => {
        const result = getTruncatedString('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet', {
            type: 'middle',
            length: 10,
        });

        expect(result).toEqual('Neque... amet');
    });

    test('should truncate string in the end', () => {
        const result = getTruncatedString('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet', {
            type: 'tail',
            length: 10,
        });

        expect(result).toEqual('Neque porr...');
    });

    test('should return the same string if length is greater than input length', () => {
        const result = getTruncatedString('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet', {
            type: 'tail',
            length: 100,
        });

        expect(result).toEqual('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet');
    });
});
