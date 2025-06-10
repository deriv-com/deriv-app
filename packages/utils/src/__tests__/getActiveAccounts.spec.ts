import Cookies from 'js-cookie';

import { requestSessionActive } from '@deriv-com/auth-client';

import Chat from '../chat';
import getActiveAccounts from '../getActiveAccounts';
import isTmbEnabled from '../isTmbEnabled';

jest.mock('js-cookie');
jest.mock('@deriv-com/auth-client');
jest.mock('../chat');
jest.mock('../isTmbEnabled');

// Mock the entire window.location at the module level before importing the module under test
const mockLocation = {
    hostname: 'app.deriv.com',
    pathname: '/traders-hub',
    search: '',
    hash: '',
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
    configurable: true,
});

const mockRequestSessionActive = requestSessionActive as jest.MockedFunction<typeof requestSessionActive>;
const mockCookiesSet = Cookies.set as jest.MockedFunction<typeof Cookies.set>;
const mockChatClear = Chat.clear as jest.MockedFunction<typeof Chat.clear>;
const mockIsTmbEnabled = isTmbEnabled as jest.MockedFunction<typeof isTmbEnabled>;

// Mock window.LC_API and LiveChatWidget
Object.defineProperty(window, 'LC_API', {
    value: {
        close_chat: jest.fn(),
    },
    writable: true,
});

Object.defineProperty(window, 'LiveChatWidget', {
    value: {
        call: jest.fn(),
    },
    writable: true,
});

Object.defineProperty(window, 'fcWidget', {
    value: {
        close: jest.fn(),
    },
    writable: true,
});

Object.defineProperty(window, 'history', {
    value: {
        replaceState: jest.fn(),
    },
    writable: true,
});

describe('getActiveAccounts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();

        // Reset location properties
        mockLocation.hostname = 'app.deriv.com';
        mockLocation.pathname = '/traders-hub';
        mockLocation.search = '';
        mockLocation.hash = '';

        // Mock isTmbEnabled to return true by default
        mockIsTmbEnabled.mockResolvedValue(true);

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

        it('should handle logout and return undefined', async () => {
            localStorage.setItem('active_loginid', 'CR123');
            sessionStorage.setItem('active_wallet_loginid', 'CRW456');

            const result = await getActiveAccounts();

            expect(result).toBeUndefined();
            expect(localStorage.getItem('active_loginid')).toBeNull();
            expect(sessionStorage.getItem('active_wallet_loginid')).toBeNull();
            expect(mockChatClear).toHaveBeenCalled();
            // Note: The domain is resolved at module import time,
            // so it will use whatever domain was set when the module was loaded
            expect(mockCookiesSet).toHaveBeenCalledWith(
                'logged_state',
                'false',
                expect.objectContaining({
                    expires: 30,
                    path: '/',
                    secure: true,
                })
            );
        });
    });

    describe('when session is active', () => {
        const mockTokens = [
            { loginid: 'CR123', token: 'token1', cur: 'USD' },
            { loginid: 'VRTC456', token: 'token2', cur: 'USD' },
            { loginid: 'CRW789', token: 'token3', cur: 'USD' },
            { loginid: 'VRW101', token: 'token4', cur: 'USD' },
        ];

        beforeEach(() => {
            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: mockTokens,
                exp: (Date.now() + 3600000).toString(),
            });
        });

        it('should handle demo account selection', async () => {
            mockLocation.search = '?account=demo';

            const result = await getActiveAccounts();

            expect(sessionStorage.getItem('active_loginid')).toBe('VRTC456');
            expect(sessionStorage.getItem('active_wallet_loginid')).toBe('VRW101');
            expect(localStorage.getItem('clientAccounts')).toBe(JSON.stringify(mockTokens));
            expect(result).toEqual({
                acct1: 'CR123',
                token1: 'token1',
                cur1: 'USD',
                acct2: 'VRTC456',
                token2: 'token2',
                cur2: 'USD',
                acct3: 'CRW789',
                token3: 'token3',
                cur3: 'USD',
                acct4: 'VRW101',
                token4: 'token4',
                cur4: 'USD',
            });
        });

        it('should handle real account selection with specific currency', async () => {
            mockLocation.search = '?account=USD';

            const result = await getActiveAccounts();

            expect(sessionStorage.getItem('active_loginid')).toBe('CR123');
            expect(sessionStorage.getItem('active_wallet_loginid')).toBe('CRW789');
            expect(localStorage.getItem('clientAccounts')).toBe(JSON.stringify(mockTokens));
        });

        it('should auto-select account when no account param is provided', async () => {
            mockLocation.search = '';

            const result = await getActiveAccounts();

            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/traders-hub?account=USD');
            expect(sessionStorage.getItem('active_loginid')).toBe('CR123');
            expect(sessionStorage.getItem('active_wallet_loginid')).toBe('CRW789');
        });

        it('should auto-select demo when first account is virtual', async () => {
            const virtualFirstTokens = [
                { loginid: 'VRTC456', token: 'token2', cur: 'USD' },
                { loginid: 'CR123', token: 'token1', cur: 'USD' },
            ];

            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: virtualFirstTokens,
                exp: (Date.now() + 3600000).toString(),
            });

            mockLocation.search = '';

            const result = await getActiveAccounts();

            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/traders-hub?account=demo');
        });

        it('should remove session storage when demo accounts are not found', async () => {
            const tokensWithoutDemo = [
                { loginid: 'CR123', token: 'token1', cur: 'USD' },
                { loginid: 'CRW789', token: 'token3', cur: 'USD' },
            ];

            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: tokensWithoutDemo,
                exp: (Date.now() + 3600000).toString(),
            });

            sessionStorage.setItem('active_loginid', 'old_loginid');
            sessionStorage.setItem('active_wallet_loginid', 'old_wallet_loginid');
            localStorage.setItem('active_loginid', 'old_loginid');
            localStorage.setItem('active_wallet_loginid', 'old_wallet_loginid');

            mockLocation.search = '?account=demo';

            await getActiveAccounts();

            expect(sessionStorage.getItem('active_loginid')).toBeNull();
            expect(sessionStorage.getItem('active_wallet_loginid')).toBeNull();
            expect(localStorage.getItem('active_loginid')).toBeNull();
            expect(localStorage.getItem('active_wallet_loginid')).toBeNull();
        });

        it('should remove session storage when real accounts are not found', async () => {
            const tokensWithoutReal = [
                { loginid: 'VRTC456', token: 'token2', cur: 'USD' },
                { loginid: 'VRW101', token: 'token4', cur: 'USD' },
            ];

            mockRequestSessionActive.mockResolvedValue({
                active: true,
                tokens: tokensWithoutReal,
                exp: (Date.now() + 3600000).toString(),
            });

            sessionStorage.setItem('active_loginid', 'old_loginid');
            sessionStorage.setItem('active_wallet_loginid', 'old_wallet_loginid');
            localStorage.setItem('active_loginid', 'old_loginid');
            localStorage.setItem('active_wallet_loginid', 'old_wallet_loginid');

            mockLocation.search = '?account=USD';

            await getActiveAccounts();

            expect(sessionStorage.getItem('active_loginid')).toBeNull();
            expect(sessionStorage.getItem('active_wallet_loginid')).toBeNull();
            expect(localStorage.getItem('active_loginid')).toBeNull();
            expect(localStorage.getItem('active_wallet_loginid')).toBeNull();
        });

        it('should not reinitialize when client accounts are the same', async () => {
            localStorage.setItem('clientAccounts', JSON.stringify(mockTokens));

            const result = await getActiveAccounts();

            expect(result).toBeUndefined();
            expect(localStorage.getItem('client.accounts')).toBeNull();
        });

        it('should remove client.accounts when reinitializing', async () => {
            localStorage.setItem('clientAccounts', JSON.stringify([{ different: 'tokens' }]));
            localStorage.setItem('client.accounts', 'old_accounts');

            const result = await getActiveAccounts();

            expect(localStorage.getItem('client.accounts')).toBeNull();
            expect(result).toBeDefined();
        });
    });

    describe('error handling', () => {
        it('should handle requestSessionActive failure', async () => {
            mockRequestSessionActive.mockRejectedValue(new Error('API Error'));

            const result = await getActiveAccounts();

            expect(result).toBeUndefined();
        });
    });

    describe('domain functionality', () => {
        it('should call logout which includes domain-based cookie management', async () => {
            mockRequestSessionActive.mockResolvedValue({
                active: false,
                tokens: [],
                exp: (Date.now() + 3600000).toString(),
            });

            await getActiveAccounts();

            // Verify that logout functionality is called (including storage cleanup)
            expect(localStorage.getItem('active_loginid')).toBeNull();
            expect(sessionStorage.getItem('active_wallet_loginid')).toBeNull();
            expect(mockChatClear).toHaveBeenCalled();

            // Cookie setting will depend on the domain that was resolved at module load time
            // In Jest environment, this is typically 'localhost'
            expect(mockCookiesSet).toHaveBeenCalledWith(
                'logged_state',
                'false',
                expect.objectContaining({
                    expires: 30,
                    path: '/',
                    secure: true,
                })
            );
        });
    });
});
