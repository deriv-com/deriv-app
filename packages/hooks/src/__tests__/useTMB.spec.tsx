import React from 'react';
import Cookies from 'js-cookie';

import { removeCookies } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { Chat } from '@deriv/utils';
import { requestSessionActive } from '@deriv-com/auth-client';
import { renderHook } from '@testing-library/react-hooks';

import useTMB from '../useTMB';

// Mock dependencies
jest.mock('js-cookie');
jest.mock('@deriv-com/auth-client');
jest.mock('@deriv/shared');
jest.mock('@deriv/utils');

// Mock window.location
const mockLocation = {
    pathname: '/home',
    hostname: 'app.deriv.com',
    search: '',
    hash: '',
    origin: 'https://app.deriv.com',
    href: 'https://app.deriv.com/home',
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

// Mock window.history
Object.defineProperty(window, 'history', {
    value: {
        replaceState: jest.fn(),
    },
    writable: true,
});

// Mock chat APIs
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

describe('useTMB', () => {
    const mockInit = jest.fn();
    const mockSetIsLoggingIn = jest.fn();
    const mockShowErrorModal = jest.fn();

    // Mock localStorage
    const mockLocalStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };

    // Mock sessionStorage
    const mockSessionStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };

    const mockStoreData = mockStore({
        client: {
            init: mockInit,
            setIsLoggingIn: mockSetIsLoggingIn,
            is_logged_in: true,
        },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockStoreData}>{children}</StoreProvider>
    );

    const mockActiveSessions = {
        active: true,
        tokens: [
            { loginid: 'CR123456', token: 'token1', cur: 'USD' },
            { loginid: 'VRW123456', token: 'token2', cur: 'USD' },
            { loginid: 'VRTC123456', token: 'token3', cur: 'USD' },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock localStorage and sessionStorage
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true,
        });

        Object.defineProperty(window, 'sessionStorage', {
            value: mockSessionStorage,
            writable: true,
        });

        // Reset mocks
        mockLocalStorage.clear.mockClear();
        mockSessionStorage.clear.mockClear();

        // Reset localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Reset location
        mockLocation.pathname = '/home';
        mockLocation.search = '';
        mockLocation.hash = '';

        // Mock requestSessionActive to return active sessions by default
        (requestSessionActive as jest.Mock).mockResolvedValue(mockActiveSessions);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('handleLogout', () => {
        it('should clear storage and cookies when user is logged in', async () => {
            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.handleLogout();

            expect(removeCookies).toHaveBeenCalledWith(
                'affiliate_token',
                'affiliate_tracking',
                'utm_data',
                'onfido_token',
                'gclid'
            );
            expect(Chat.clear).toHaveBeenCalled();
            expect(Cookies.set).toHaveBeenCalledWith('logged_state', 'false', {
                domain: 'deriv.com',
                expires: 30,
                path: '/',
                secure: true,
            });
        });

        it('should close chat widgets during logout', async () => {
            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.handleLogout();

            expect(window.LC_API?.close_chat).toHaveBeenCalled();
            expect(window.LiveChatWidget?.call).toHaveBeenCalledWith('hide');
            expect(window.fcWidget?.close).toHaveBeenCalled();
        });
    });

    describe('onRenderTMBCheck', () => {
        it('should handle active sessions and initialize client store', async () => {
            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(mockSetIsLoggingIn).toHaveBeenCalledWith(true);
            expect(requestSessionActive).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'clientAccounts',
                JSON.stringify(mockActiveSessions.tokens)
            );
            expect(mockInit).toHaveBeenCalled();
        });

        it('should handle logout when no active sessions', async () => {
            (requestSessionActive as jest.Mock).mockResolvedValue({ active: false });

            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(mockSetIsLoggingIn).toHaveBeenCalledWith(false);
            expect(removeCookies).toHaveBeenCalled();
        });

        it('should set demo account when account param is "demo"', async () => {
            mockLocation.search = '?account=demo';

            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(sessionStorage.setItem).toHaveBeenCalledWith('active_loginid', 'VRTC123456');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('active_wallet_loginid', 'VRW123456');
        });

        it('should set real account when account param is a currency', async () => {
            mockLocation.search = '?account=USD';

            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(sessionStorage.setItem).toHaveBeenCalledWith('active_loginid', 'CR123456');
        });

        it('should determine account from first available when no account param', async () => {
            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(window.history.replaceState).toHaveBeenCalled();
        });

        it('should handle redirect page logic', async () => {
            mockLocation.pathname = '/redirect';
            mockLocation.search = '?from=tradershub';
            (Cookies.get as jest.Mock).mockReturnValue('test-token');

            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token');
            expect(Cookies.remove).toHaveBeenCalledWith('authtoken');
        });

        it('should call showErrorModal when getActiveSessions fails', async () => {
            (requestSessionActive as jest.Mock).mockRejectedValue(new Error('API Error'));

            const { result } = renderHook(() => useTMB({ showErrorModal: mockShowErrorModal }), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(mockShowErrorModal).toHaveBeenCalled();
        });
        it('should not reinitialize client store when tokens are the same', async () => {
            // Mock localStorage to return the same tokens that will be fetched
            mockLocalStorage.getItem.mockImplementation(key => {
                if (key === 'clientAccounts') {
                    return JSON.stringify(mockActiveSessions.tokens);
                }
                return null;
            });

            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(mockInit).not.toHaveBeenCalled();
            expect(mockSetIsLoggingIn).toHaveBeenCalledWith(false);
        });

        it('should set logged_state cookie for supported domains', async () => {
            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(Cookies.set).toHaveBeenCalledWith('logged_state', 'true', {
                domain: 'deriv.com',
                expires: 30,
                path: '/',
                secure: true,
            });
        });
    });

    describe('convertedResult formatting', () => {
        it('should format tokens correctly for client store', async () => {
            // Mock localStorage to return different tokens to trigger reinitialization
            mockLocalStorage.getItem.mockImplementation(key => {
                if (key === 'clientAccounts') {
                    return JSON.stringify([{ loginid: 'OLD123', token: 'oldtoken', cur: 'EUR' }]);
                }
                return null;
            });
            const { result } = renderHook(() => useTMB(), { wrapper });

            await result.current.onRenderTMBCheck();

            expect(mockInit).toHaveBeenCalledWith({
                acct1: 'CR123456',
                token1: 'token1',
                cur1: 'USD',
                acct2: 'VRW123456',
                token2: 'token2',
                cur2: 'USD',
                acct3: 'VRTC123456',
                token3: 'token3',
                cur3: 'USD',
            });
        });
    });
});
