import React from 'react';
import Cookies from 'js-cookie';

import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { renderHook } from '@testing-library/react-hooks';

import useSilentLoginAndLogout from '../useSilentLoginAndLogout';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('js-cookie', () => ({
    get: jest.fn(),
}));

jest.mock('@deriv-com/auth-client', () => ({
    requestOidcAuthentication: jest.fn(),
}));

describe('useSilentLoginAndLogout', () => {
    const mockOAuthLogout = jest.fn();
    const mockStoreData = mockStore({
        client: { prevent_single_login: false, is_single_logging_in: false, setIsSingleLoggingIn: jest.fn() },
    });
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockStoreData}>{children}</StoreProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            if (key === 'client.accounts') {
                return JSON.stringify({});
            }
            return null;
        });

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { pathname: '/home' },
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should call requestOidcAuthentication for silent login if conditions are met', () => {
        // Mock `loggedState` to 'true'
        (Cookies.get as jest.Mock).mockImplementation(() => 'true');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({}));

        renderHook(
            () =>
                useSilentLoginAndLogout({
                    is_client_store_initialized: true,
                    oAuthLogout: mockOAuthLogout,
                }),
            { wrapper }
        );

        expect(requestOidcAuthentication).toHaveBeenCalledWith({
            redirectCallbackUri: `${window.location.origin}/callback`,
            postLoginRedirectUri: window.location.href,
        });
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });

    it('should skip silent login if loggedState is not "true"', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'false');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({}));

        renderHook(
            () =>
                useSilentLoginAndLogout({
                    is_client_store_initialized: true,
                    oAuthLogout: mockOAuthLogout,
                }),
            { wrapper }
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });

    it('should skip silent login if the current pathname is "/callback"', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'true');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({}));

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { pathname: '/callback' },
        });

        renderHook(
            () =>
                useSilentLoginAndLogout({
                    is_client_store_initialized: true,
                    oAuthLogout: mockOAuthLogout,
                }),
            { wrapper }
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });

    it('should call oAuthLogout if conditions for single logout are met', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'false');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({ account1: {}, account2: {} }));

        renderHook(
            () =>
                useSilentLoginAndLogout({
                    is_client_store_initialized: true,
                    oAuthLogout: mockOAuthLogout,
                }),
            { wrapper }
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).toHaveBeenCalled();
    });

    it('should skip both silent login and logout if conditions are not met', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'true');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({ account1: {}, account2: {} }));

        renderHook(
            () =>
                useSilentLoginAndLogout({
                    is_client_store_initialized: true,
                    oAuthLogout: mockOAuthLogout,
                }),
            { wrapper }
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });
});
