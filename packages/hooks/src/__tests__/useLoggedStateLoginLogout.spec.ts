import Cookies from 'js-cookie';

import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { renderHook } from '@testing-library/react-hooks';

import useLoggedStateLoginAndLogout from '../useLoggedStateLoginAndLogout';

jest.mock('js-cookie', () => ({
    get: jest.fn(),
}));

jest.mock('@deriv-com/auth-client', () => ({
    requestOidcAuthentication: jest.fn(),
}));

describe('useLoggedStateLoginAndLogout', () => {
    const mockOAuthLogout = jest.fn();

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

        renderHook(() =>
            useLoggedStateLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
                oAuthLogout: mockOAuthLogout,
            })
        );

        expect(requestOidcAuthentication).toHaveBeenCalledWith({
            redirectCallbackUri: `${window.location.origin}/callback`,
        });
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });

    it('should skip silent login if loggedState is not "true"', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'false');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({}));

        renderHook(() =>
            useLoggedStateLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
                oAuthLogout: mockOAuthLogout,
            })
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

        renderHook(() =>
            useLoggedStateLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
                oAuthLogout: mockOAuthLogout,
            })
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });

    it('should call oAuthLogout if conditions for single logout are met', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'false');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({ account1: {}, account2: {} }));

        renderHook(() =>
            useLoggedStateLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
                oAuthLogout: mockOAuthLogout,
            })
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).toHaveBeenCalled();
    });

    it('should skip both silent login and logout if conditions are not met', () => {
        (Cookies.get as jest.Mock).mockImplementation(() => 'true');

        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({ account1: {}, account2: {} }));

        renderHook(() =>
            useLoggedStateLoginAndLogout({
                is_client_store_initialized: true,
                isOAuth2Enabled: true,
                oAuthLogout: mockOAuthLogout,
            })
        );

        expect(requestOidcAuthentication).not.toHaveBeenCalled();
        expect(mockOAuthLogout).not.toHaveBeenCalled();
    });
});
