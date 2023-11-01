import { displayBalanceFormat } from '../display-balance-format';

describe('displayBalanceFormat', () => {
    it('should work for en-US, USD', async () => {
        const preferred_language = 'en-US';
        const display_balance = displayBalanceFormat(1234.56, 'USD', { preferred_language });

        expect(display_balance).toBe('1,234.56 USD');
    });

    it('should work for en-US, USD; round decimals up', async () => {
        const preferred_language = 'en-US';
        const display_balance = displayBalanceFormat(1234.56789, 'USD', { preferred_language });

        expect(display_balance).toBe('1,234.57 USD');
    });

    it('should work for de-GE, USD', async () => {
        const preferred_language = 'de-GE';
        const display_balance = displayBalanceFormat(1234.56123, 'USD', { preferred_language });

        expect(display_balance).toBe('1.234,56 USD');
    });

    it('should work for en-IN, USD', async () => {
        const preferred_language = 'en-IN';
        const display_balance = displayBalanceFormat(123456.781, 'USD', { preferred_language });

        expect(display_balance).toBe('1,23,456.78 USD');
    });

    it('should work for en-US, BTC', async () => {
        const preferred_language = 'en-US';
        const fractional_digits = 8;
        const display_balance = displayBalanceFormat(0.1234, 'BTC', { preferred_language, fractional_digits });

        expect(display_balance).toBe('0.12340000 BTC');
    });

    it('should work for de-GE, BTC', async () => {
        const preferred_language = 'de-GE';
        const fractional_digits = 8;
        const display_balance = displayBalanceFormat(0.1234, 'BTC', { preferred_language, fractional_digits });

        expect(display_balance).toBe('0,12340000 BTC');
    });

    it('should work for en_US, USD (invalid locale)', async () => {
        const preferred_language = 'en_US';
        const display_balance = displayBalanceFormat(1234, 'USD', { preferred_language });

        expect(display_balance).toBe('1234 USD');
    });
});
