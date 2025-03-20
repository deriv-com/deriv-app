import React from 'react';
import { requestOidcAuthentication, requestOidcSilentAuthentication } from '@deriv-com/auth-client';
import { renderHook } from '@testing-library/react-hooks';

import useSilentLoginAndLogout from '../useSilentLoginAndLogout';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv-com/auth-client', () => ({
    requestOidcAuthentication: jest.fn(),
    requestOidcSilentAuthentication: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    isSafariBrowser: jest.fn().mockReturnValue(false),
}));

describe('useSilentLoginAndLogout', () => {
    const mockStoreData = mockStore({
        client: { prevent_single_login: false },
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

    it('should call requestOidcSilentAuthentication for silent login if conditions are met', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({}));

        renderHook(
            () =>
                useSilentLoginAndLogout({
                    is_client_store_initialized: true,
                    isOAuth2Enabled: true,
                }),
            { wrapper }
        );

        expect(requestOidcSilentAuthentication).toHaveBeenCalledWith({
            redirectCallbackUri: `${window.location.origin}/callback`,
            redirectSilentCallbackUri: `${window.location.origin}/silent-callback.html`,
        });
    });

    it('should skip silent login if localStorage client.accounts is there', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({ account1: {}, account2: {} }));

        renderHook(() =>
            useSilentLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
            })
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
    });

    it('should skip silent login if the current pathname is "/callback"', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({}));

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { pathname: '/callback' },
        });

        renderHook(() =>
            useSilentLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
            })
        );

        expect(requestOidcSilentAuthentication).not.toHaveBeenCalled();
    });
});
