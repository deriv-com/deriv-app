import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useOAuth2 } from '@deriv-com/auth-client';
import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useOauth2 from '../useOauth2';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv-com/auth-client', () => ({
    useIsOAuth2Enabled: jest.fn(),
    useOAuth2: jest.fn(),
}));
jest.mock('../useGrowthbookGetFeatureValue', () => jest.fn());

describe('useOauth2', () => {
    beforeEach(() => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([[], true]);
        (useOAuth2 as jest.Mock).mockReturnValue({
            OAuth2Logout: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return oAuthLogout', () => {
        const handleLogout = jest.fn().mockResolvedValue(undefined);

        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useOauth2({ handleLogout }), { wrapper });
        expect(typeof result.current.oAuthLogout).toBe('function');
    });
});
