import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import useAccountSettingsRedirect from '../useAccountSettingsRedirect';
import useIsHubRedirectionEnabled from '../useIsHubRedirectionEnabled';

// Mock process.env
const originalNodeEnv = process.env.NODE_ENV;

// Mock the dependencies
jest.mock('@deriv/stores', () => ({
    useStore: jest.fn(),
}));

jest.mock('../useIsHubRedirectionEnabled', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useAccountSettingsRedirect', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Set NODE_ENV to something other than 'production' to ensure we get staging URLs in tests
        process.env.NODE_ENV = 'development';

        // Default mock implementations
        (useStore as jest.Mock).mockReturnValue({
            client: {
                loginid: 'CR123456',
                has_wallet: false,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: false,
        });
    });

    afterAll(() => {
        // Restore the original NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;
    });

    it('should return personal_details route when user has no wallet and hub redirection is not enabled', () => {
        const { result } = renderHook(() => useAccountSettingsRedirect());

        expect(result.current.redirect_url).toBe(routes.personal_details);
    });

    it('should return hub URL when user has wallet', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                loginid: 'CR123456',
                has_wallet: true,
            },
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // In test environment, we should always get the staging URL
        const expectedUrl =
            'https://hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=home&account=CR123456';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should return hub URL when hub redirection is enabled', () => {
        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // In test environment, we should always get the staging URL
        const expectedUrl =
            'https://hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=home&account=CR123456';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should return hub URL when both conditions are true', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                loginid: 'CR123456',
                has_wallet: true,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // In test environment, we should always get the staging URL
        const expectedUrl =
            'https://hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=home&account=CR123456';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });
});
