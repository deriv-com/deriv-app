import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useKycAuthStatus } from '../useKycAuthStatus';
import { useQuery } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

describe('useKycAuthStatus', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return kyc_auth_status', () => {
        const mock_response = {
            data: {
                kyc_auth_status: {
                    identity: {
                        status: 'none',
                    },
                    document: {
                        status: 'none',
                    },
                },
            },
        };

        const mock = mockStore({
            client: {
                is_authorize: true,
            },
        });

        (useQuery as jest.Mock).mockReturnValue(mock_response);

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useKycAuthStatus({ country: 'in' }), { wrapper });
        expect(result.current.kyc_auth_status).toEqual(mock_response.data.kyc_auth_status);
    });
});
