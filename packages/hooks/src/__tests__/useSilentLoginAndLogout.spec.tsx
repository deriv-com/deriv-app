import { requestOidcAuthentication, requestOidcSilentAuthentication } from '@deriv-com/auth-client';
import { renderHook } from '@testing-library/react-hooks';

import useSilentLoginAndLogout from '../useSilentLoginAndLogout';

jest.mock('@deriv-com/auth-client', () => ({
    requestOidcAuthentication: jest.fn(),
    requestOidcSilentAuthentication: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    isSafariBrowser: jest.fn().mockReturnValue(false),
}));

describe('useSilentLoginAndLogout', () => {
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

        renderHook(() =>
            useSilentLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
            })
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
