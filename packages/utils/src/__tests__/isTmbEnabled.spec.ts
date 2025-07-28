import isTmbEnabled from '../isTmbEnabled';

describe('isTmbEnabled', () => {
    const originalLocation = window.location;
    const originalReferrer = document.referrer;
    const originalSessionStorage = { ...sessionStorage };
    const originalLocalStorage = { ...localStorage };

    beforeEach(() => {
        // @ts-expect-error: We are redefining window.location for test isolation
        delete window.location;
        window.location = { search: '' } as any;
        Object.defineProperty(document, 'referrer', { value: '', configurable: true });
        sessionStorage.clear();
        localStorage.clear();
    });

    afterAll(() => {
        window.location = originalLocation;
        Object.defineProperty(document, 'referrer', { value: originalReferrer, configurable: true });
        sessionStorage.clear();
        localStorage.clear();
        Object.assign(sessionStorage, originalSessionStorage);
        Object.assign(localStorage, originalLocalStorage);
    });

    it('returns false if sessionStorage is_disable_tmb is true', async () => {
        sessionStorage.setItem('is_disable_tmb', 'true');
        const result = await isTmbEnabled();
        expect(result).toBe(false);
    });

    it('returns false if platform=derivgo in URL', async () => {
        window.location.search = '?platform=derivgo';
        const result = await isTmbEnabled();
        expect(result).toBe(false);
        expect(sessionStorage.getItem('is_disable_tmb')).toBe('true');
    });

    it('returns true if localStorage is_tmb_enabled is true', async () => {
        localStorage.setItem('is_tmb_enabled', 'true');
        const result = await isTmbEnabled();
        expect(result).toBe(true);
    });

    it('returns false if localStorage is_tmb_enabled is false', async () => {
        localStorage.setItem('is_tmb_enabled', 'false');
        const result = await isTmbEnabled();
        expect(result).toBe(false);
    });

    it('returns true by default if nothing disables TMB', async () => {
        const result = await isTmbEnabled();
        expect(result).toBe(true);
    });
});
