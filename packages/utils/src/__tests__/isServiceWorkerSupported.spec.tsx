import isServiceWorkerSupported from '../isServiceWorkerSupported';

describe('unFormatLocaleString', () => {
    test('should return true when user browser version satisfy the minimum required version', () => {
        const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
        userAgentGetter.mockReturnValue(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
        );

        const result = isServiceWorkerSupported();

        expect(result).toBe(true);
    });

    test('should return false when user browser version does not satisfy the minimum required version', () => {
        const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
        userAgentGetter.mockReturnValue(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/9.1 Safari/605.1.15'
        );

        const result = isServiceWorkerSupported();

        expect(result).toBe(false);
    });

    test('should return false when detected user browser is not in the list of browsers that supports service workers', () => {
        // the default detected browser would be webKit which is not in the supported browsers list
        const result = isServiceWorkerSupported();

        expect(result).toBe(false);
    });
});
