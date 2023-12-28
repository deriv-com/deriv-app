import { user_browser } from '../browser_detect';

describe('user_browser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            configurable: true,
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should detect Chrome browser', () => {
        expect(user_browser.isChrome()).toBe(true);
    });

    it('should detect Safari browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
            configurable: true,
        });

        expect(user_browser.isSafari()).toBe(true);
    });

    it('should detect FireFox browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
            configurable: true,
        });

        expect(user_browser.isFirefox()).toBe(true);
    });

    it('should detect Opera browser', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Opera/121.0',
            configurable: true,
        });

        expect(user_browser.isOpera()).toBe(true);
    });
});
