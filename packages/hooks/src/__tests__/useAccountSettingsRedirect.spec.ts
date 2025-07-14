import React from 'react';

import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useAccountSettingsRedirect from '../useAccountSettingsRedirect';
import useIsHubRedirectionEnabled from '../useIsHubRedirectionEnabled';

// Mock process.env
const originalNodeEnv = process.env.NODE_ENV;

// Mock the dependencies
jest.mock('@deriv/stores', () => ({
    useStore: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    getDomainUrl: jest.fn(() => 'deriv.com'),
    routes: {
        personal_details: '/account/personal-details',
        account: '/account',
        account_limits: '/account/account-limits',
    },
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

        // Mock window.location.search for URL parameters
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                pathname: '/account',
                search: '?account=demo',
                href: 'https://app.deriv.com/account?account=demo',
            },
        });

        // Default mock implementations
        (useStore as jest.Mock).mockReturnValue({
            client: {
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

    it('should return high code URL when user has wallet but feature is off', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: true,
            },
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // In test environment, we should always get the staging URL
        const expectedUrl = '/account/personal-details';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should return high code URL when hub redirection is enabled but feature flag is off', () => {
        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // In test environment, we should always get the staging URL
        const expectedUrl = '/account/personal-details';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should return hub URL with default redirect_to=home when both conditions are true', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: true,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // In test environment, we should always get the staging URL
        const expectedUrl =
            'https://staging-hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=home&account=demo';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should use custom redirect_to value when provided', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: true,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect('account-limits'));

        // In test environment, we should always get the staging URL with the custom redirect_to value
        const expectedUrl =
            'https://staging-hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=account-limits&account=demo';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should use different account ID from URL parameters', () => {
        // Set a different account ID in the URL
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {
                pathname: '/account',
                search: '?account=BTC',
                href: 'https://app.deriv.dev/account?account=BTC',
            },
        });
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: true,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect());

        // The URL should now contain the new account ID
        const expectedUrl =
            'https://staging-hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=home&account=BTC';

        expect(result.current.redirect_url).toBe(expectedUrl);
    });

    it('should set both redirect_url and mobile_redirect_url with custom redirect_to value', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: true,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: true,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect('account-limits'));

        // Both URLs should contain the custom redirect_to value
        const expectedUrl =
            'https://staging-hub.deriv.com/accounts/redirect?action=redirect_to&redirect_to=account-limits&account=demo';

        expect(result.current.redirect_url).toBe(expectedUrl);
        expect(result.current.mobile_redirect_url).toBe(expectedUrl);
    });

    it('should return deriv-app routes if isHubRedirectionEnabled is false', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: false,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: false,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect('home'));

        expect(result.current.redirect_url).toBe(routes.personal_details);
        expect(result.current.mobile_redirect_url).toBe(routes.account);
    });

    it('should map account-limits redirect_to to routes.account_limits when hub redirection is disabled', () => {
        (useStore as jest.Mock).mockReturnValue({
            client: {
                has_wallet: false,
            },
        });

        (useIsHubRedirectionEnabled as jest.Mock).mockReturnValue({
            isHubRedirectionEnabled: false,
        });

        const { result } = renderHook(() => useAccountSettingsRedirect('account-limits'));

        // Should map to account_limits route when hub redirection is disabled
        expect(result.current.redirect_url).toBe(routes.account_limits);
        expect(result.current.mobile_redirect_url).toBe(routes.account);
    });
});
