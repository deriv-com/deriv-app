import { isSafariBrowser } from '../browser_detect';

describe('isSafariBrowser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return false for Chrome browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            configurable: true,
        });

        expect(isSafariBrowser()).toBe(false);
    });

    it('should detect Safari browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
            configurable: true,
        });

        expect(isSafariBrowser()).toBe(true);
    });

    it('should return false for FireFox browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
            configurable: true,
        });

        expect(isSafariBrowser()).toBe(false);
    });

    it('should return false for Opera browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Opera/121.0',
            configurable: true,
        });

        expect(isSafariBrowser()).toBe(false);
    });
});
