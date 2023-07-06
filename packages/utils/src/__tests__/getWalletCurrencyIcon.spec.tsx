import getWalletCurrencyIcon from '../getWalletCurrencyIcon';

describe('getWalletCurrencyIcon', () => {
    describe('Should return proper icons for cashier modal', () => {
        it('should return proper icon for demo currency', () => {
            expect(getWalletCurrencyIcon('demo', false, true)).toBe('IcWalletDerivDemoLight');
        });

        it('should return proper icon for USDT, eUSDT, tUSDT, UST currency in dark mode', () => {
            const currencies = ['USDT', 'eUSDT', 'tUSDT', 'UST'];
            currencies.forEach(currency => {
                expect(getWalletCurrencyIcon(currency, true, true)).toBe('IcWalletModalTetherDark');
            });
        });

        it('should return proper icon for USDT, eUSDT, tUSDT, UST currency in light mode', () => {
            const currencies = ['USDT', 'eUSDT', 'tUSDT', 'UST'];
            currencies.forEach(currency => {
                expect(getWalletCurrencyIcon(currency, false, true)).toBe('IcWalletModalTetherLight');
            });
        });
    });

    describe('Should return proper icons for other components', () => {
        it('should return proper icon for demo currency in dark mode', () => {
            expect(getWalletCurrencyIcon('demo', false)).toBe('IcWalletDerivDemoLight');
        });

        it('should return proper icon for demo currency in light mode', () => {
            expect(getWalletCurrencyIcon('demo', true)).toBe('IcWalletDerivDemoDark');
        });

        it('should return proper icon for USD currency in dark/light mode', () => {
            expect(getWalletCurrencyIcon('USD')).toBe('IcWalletCurrencyUsd');
        });

        it('should return proper icon for EUR currency in dark/light mode', () => {
            expect(getWalletCurrencyIcon('EUR')).toBe('IcWalletCurrencyEur');
        });

        it('should return proper icon for AUD currency in dark/light mode', () => {
            expect(getWalletCurrencyIcon('AUD')).toBe('IcWalletCurrencyAud');
        });

        it('should return proper icon for GBP currency in dark/light mode', () => {
            expect(getWalletCurrencyIcon('GBP')).toBe('IcWalletCurrencyGbp');
        });

        it('should return proper icon for BTC currency in dark mode', () => {
            expect(getWalletCurrencyIcon('BTC', false)).toBe('IcWalletBitcoinLight');
        });

        it('should return proper icon for BTC currency in light mode', () => {
            expect(getWalletCurrencyIcon('BTC', true)).toBe('IcWalletBitcoinDark');
        });

        it('should return proper icon for ETH currency in dark mode', () => {
            expect(getWalletCurrencyIcon('ETH', false)).toBe('IcWalletEthereumLight');
        });

        it('should return proper icon for ETH currency in light mode', () => {
            expect(getWalletCurrencyIcon('ETH', true)).toBe('IcWalletEthereumDark');
        });

        it('should return proper icon for USDT, eUSDT, tUSDT, UST currency in dark mode', () => {
            const currencies = ['USDT', 'eUSDT', 'tUSDT', 'UST'];
            currencies.forEach(currency => {
                expect(getWalletCurrencyIcon(currency, true)).toBe('IcWalletTetherDark');
            });
        });

        it('should return proper icon for USDT, eUSDT, tUSDT, UST currency in light mode', () => {
            const currencies = ['USDT', 'eUSDT', 'tUSDT', 'UST'];
            currencies.forEach(currency => {
                expect(getWalletCurrencyIcon(currency, false)).toBe('IcWalletTetherLight');
            });
        });

        it('should return proper icon for LTC currency in dark mode', () => {
            expect(getWalletCurrencyIcon('LTC', false)).toBe('IcWalletLiteCoinLight');
        });

        it('should return proper icon for LTC currency in light mode', () => {
            expect(getWalletCurrencyIcon('LTC', true)).toBe('IcWalletLiteCoinDark');
        });

        it('should return proper icon for USDC currency in dark mode', () => {
            expect(getWalletCurrencyIcon('USDC', false)).toBe('IcWalletUsdCoinLight');
        });

        it('should return proper icon for USDC currency in light mode', () => {
            expect(getWalletCurrencyIcon('USDC', true)).toBe('IcWalletUsdCoinDark');
        });
    });
});
