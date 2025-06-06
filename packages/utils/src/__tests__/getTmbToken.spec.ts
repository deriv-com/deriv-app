import { requestSessionActive } from '@deriv-com/auth-client';

import getTmbTokens from '../getTmbToken';

jest.mock('@deriv-com/auth-client');

const mockRequestSessionActive = requestSessionActive as jest.MockedFunction<typeof requestSessionActive>;

// Mock window properties
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/traders-hub',
        search: '',
        hash: '',
    },
    writable: true,
});

Object.defineProperty(window, 'history', {
    value: {
        replaceState: jest.fn(),
    },
    writable: true,
});

describe('getTmbTokens', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        localStorage.clear();

        // Reset location search
        window.location.search = '';

        // Mock URLSearchParams
        delete (window as any).URLSearchParams;
        (window as any).URLSearchParams = class {
            private params = new Map();

            constructor(searchString: string) {
                let search = searchString;
                if (search.startsWith('?')) search = search.slice(1);
                search.split('&').forEach(param => {
                    const [key, value] = param.split('=');
                    if (key) this.params.set(key, value || '');
                });
            }

            get(key: string) {
                return this.params.get(key) || null;
            }

            set(key: string, value: string) {
                this.params.set(key, value);
            }

            toString() {
                const pairs: string[] = [];
                this.params.forEach((value, key) => {
                    pairs.push(`${key}=${value}`);
                });
                return pairs.join('&');
            }
        };
    });

    describe('when session is not active', () => {
        beforeEach(() => {
            mockRequestSessionActive.mockResolvedValue({
                active: false,
                tokens: [],
                exp: (Date.now() + 3600000).toString(),
            });
        });

        it('should return the provided token when session is not active', async () => {
            const inputToken = 'provided_token';
            const result = await getTmbTokens(inputToken);

            expect(result).toBe(inputToken);
        });

        it('should return undefined when no token provided and session is not active', async () => {
            const result = await getTmbTokens();

            expect(result).toBeUndefined();
        });
    });

    describe('when session is active', () => {
        const mockTokens = [
            { loginid: 'CR123', token: 'real_token', cur: 'USD' },
            { loginid: 'VRTC456', token: 'demo_token', cur: 'USD' },
            { loginid: 'CRW789', token: 'real_wallet_token', cur: 'USD' },
            { loginid: 'VRW101', token: 'demo_wallet_token', cur: 'USD' },
            { loginid: 'MF999', token: 'mf_token', cur: 'EUR' },
            { loginid: 'MFW888', token: 'mf_wallet_token', cur: 'EUR' },
        ];

        beforeEach(() => {
            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: mockTokens,
                exp: (Date.now() + 3600000).toString(),
            });
        });

        describe('demo account handling', () => {
            it('should return demo account token for demo account', async () => {
                window.location.search = '?account=demo';

                const result = await getTmbTokens();

                expect(result).toBe('demo_token');
            });

            it('should return demo wallet token when requesting wallet token for demo', async () => {
                window.location.search = '?account=demo';

                const result = await getTmbTokens(undefined, true);

                expect(result).toBe('demo_wallet_token');
            });

            it('should fallback to demo account token if wallet token not found', async () => {
                const tokensWithoutWallet = [{ loginid: 'VRTC456', token: 'demo_token', cur: 'USD' }];

                mockRequestSessionActive.mockResolvedValue({
                    active: true,
                    tokens: tokensWithoutWallet,
                    exp: (Date.now() + 3600000).toString(),
                });

                window.location.search = '?account=demo';

                const result = await getTmbTokens(undefined, true);

                expect(result).toBe('demo_token');
            });

            it('should remove session storage when demo wallet account not found', async () => {
                const tokensWithoutDemoWallet = [{ loginid: 'VRTC456', token: 'demo_token', cur: 'USD' }];

                mockRequestSessionActive.mockResolvedValue({
                    active: true,
                    tokens: tokensWithoutDemoWallet,
                    exp: (Date.now() + 3600000).toString(),
                });

                sessionStorage.setItem('active_wallet_loginid', 'old_wallet');
                localStorage.setItem('active_wallet_loginid', 'old_wallet');

                window.location.search = '?account=demo';

                await getTmbTokens();

                expect(sessionStorage.getItem('active_wallet_loginid')).toBeNull();
                expect(localStorage.getItem('active_wallet_loginid')).toBeNull();
            });
        });

        describe('real account handling', () => {
            it('should return real account token for USD currency', async () => {
                window.location.search = '?account=USD';

                const result = await getTmbTokens();

                expect(result).toBe('real_token');
            });

            it('should return real wallet token when requesting wallet token for USD', async () => {
                window.location.search = '?account=USD';

                const result = await getTmbTokens(undefined, true);

                expect(result).toBe('real_wallet_token');
            });

            it('should return MF account token for EUR currency', async () => {
                window.location.search = '?account=EUR';

                const result = await getTmbTokens();

                expect(result).toBe('mf_token');
            });

            it('should return MF wallet token when requesting wallet token for EUR', async () => {
                window.location.search = '?account=EUR';

                const result = await getTmbTokens(undefined, true);

                expect(result).toBe('mf_wallet_token');
            });

            it('should fallback to real account token if wallet token not found', async () => {
                const tokensWithoutWallet = [{ loginid: 'CR123', token: 'real_token', cur: 'USD' }];

                mockRequestSessionActive.mockResolvedValue({
                    active: true,
                    tokens: tokensWithoutWallet,
                    exp: (Date.now() + 3600000).toString(),
                });

                window.location.search = '?account=USD';

                const result = await getTmbTokens(undefined, true);

                expect(result).toBe('real_token');
            });

            it('should remove session storage when real account not found', async () => {
                const tokensWithoutReal = [{ loginid: 'VRTC456', token: 'demo_token', cur: 'USD' }];

                mockRequestSessionActive.mockResolvedValue({
                    active: true,
                    tokens: tokensWithoutReal,
                    exp: (Date.now() + 3600000).toString(),
                });

                sessionStorage.setItem('active_loginid', 'old_loginid');
                localStorage.setItem('active_loginid', 'old_loginid');

                window.location.search = '?account=USD';

                await getTmbTokens();

                expect(sessionStorage.getItem('active_loginid')).toBeNull();
                expect(localStorage.getItem('active_loginid')).toBeNull();
            });

            it('should remove session storage when real wallet account not found', async () => {
                const tokensWithoutRealWallet = [{ loginid: 'CR123', token: 'real_token', cur: 'USD' }];

                mockRequestSessionActive.mockResolvedValue({
                    active: true,
                    tokens: tokensWithoutRealWallet,
                    exp: (Date.now() + 3600000).toString(),
                });

                sessionStorage.setItem('active_wallet_loginid', 'old_wallet');
                localStorage.setItem('active_wallet_loginid', 'old_wallet');

                window.location.search = '?account=USD';

                await getTmbTokens();

                expect(sessionStorage.getItem('active_wallet_loginid')).toBeNull();
                expect(localStorage.getItem('active_wallet_loginid')).toBeNull();
            });
        });

        describe('account auto-selection', () => {
            it('should auto-select account when no account param is provided', async () => {
                window.location.search = '';

                const result = await getTmbTokens();

                expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/traders-hub?account=USD');
                expect(result).toBe('real_token');
            });

            it('should auto-select demo when first account is virtual', async () => {
                const virtualFirstTokens = [
                    { loginid: 'VRTC456', token: 'demo_token', cur: 'USD' },
                    { loginid: 'CR123', token: 'real_token', cur: 'USD' },
                ];

                mockRequestSessionActive.mockResolvedValue({
                    active: true,
                    tokens: virtualFirstTokens,
                    exp: (Date.now() + 3600000).toString(),
                });

                window.location.search = '';

                const result = await getTmbTokens();

                expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/traders-hub?account=demo');
                expect(result).toBe('demo_token');
            });
        });

        describe('case insensitive currency matching', () => {
            it('should handle lowercase currency parameter', async () => {
                window.location.search = '?account=usd';

                const result = await getTmbTokens();

                expect(result).toBe('real_token');
            });

            it('should handle mixed case currency parameter', async () => {
                window.location.search = '?account=uSd';

                const result = await getTmbTokens();

                expect(result).toBe('real_token');
            });
        });

        it('should handle null/undefined account parameter', async () => {
            // Set up mock tokens for this test
            const mockTokens = [
                { loginid: 'CR123', token: 'real_token', cur: 'USD' },
                { loginid: 'VRTC456', token: 'demo_token', cur: 'USD' },
            ];

            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: mockTokens,
                exp: (Date.now() + 3600000).toString(),
            });

            // Mock URLSearchParams to return null for account
            (window as any).URLSearchParams = class {
                get() {
                    return null;
                }
                set() {}
                toString() {
                    return '';
                }
            };

            const result = await getTmbTokens();

            expect(result).toBeDefined(); // Should return some token from first account
            expect(result).toBe('real_token'); // Should return the first account's token
        });
    });

    describe('error handling', () => {
        it('should handle requestSessionActive failure and return provided token', async () => {
            mockRequestSessionActive.mockRejectedValue(new Error('API Error'));
            const inputToken = 'fallback_token';

            const result = await getTmbTokens(inputToken);

            expect(result).toBe(inputToken);
        });

        it('should handle requestSessionActive failure and return undefined when no token provided', async () => {
            mockRequestSessionActive.mockRejectedValue(new Error('API Error'));

            const result = await getTmbTokens();

            expect(result).toBeUndefined();
        });
    });

    describe('edge cases', () => {
        it('should handle empty tokens array', async () => {
            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: [],
                exp: (Date.now() + 3600000).toString(),
            });

            window.location.search = '?account=USD';

            const result = await getTmbTokens();

            expect(result).toBeUndefined();
        });
    });
});
