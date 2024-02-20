import React from 'react';
import { APIProvider, useGetAccountStatus } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import usePoiPoaStatus from '../usePoiPoaStatus';

const mockUseGetAccountStatus = useGetAccountStatus as jest.MockedFunction<typeof useGetAccountStatus>;
const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useGetAccountStatus: jest.fn().mockReturnValue({
        data: {
            authentication: {
                document: {
                    status: 'pending',
                },
                identity: {
                    status: 'pending',
                },
            },
            p2p_poa_required: true,
        },
    }),
}));

describe('usePoiPoaStatus', () => {
    it('should return the correct pending verification statuses', () => {
        const { result } = renderHook(() => usePoiPoaStatus(), { wrapper });

        expect(result.current.data).toStrictEqual({
            isP2PPoaRequired: true,
            isPoaPending: true,
            isPoaVerified: false,
            isPoiPending: true,
            isPoiVerified: false,
            poaStatus: 'pending',
            poiStatus: 'pending',
        });
    });
    it('should return the correct verified verification statuses', () => {
        mockUseGetAccountStatus.mockReturnValueOnce({
            data: {
                authentication: {
                    document: {
                        status: 'verified',
                    },
                    identity: {
                        status: 'verified',
                    },
                },
                p2p_poa_required: false,
            },
        });
        const { result } = renderHook(() => usePoiPoaStatus(), { wrapper });

        expect(result.current.data).toStrictEqual({
            isP2PPoaRequired: false,
            isPoaPending: false,
            isPoaVerified: true,
            isPoiPending: false,
            isPoiVerified: true,
            poaStatus: 'verified',
            poiStatus: 'verified',
        });
    });
    it('should return undefined if data is not available', () => {
        mockUseGetAccountStatus.mockReturnValueOnce({
            data: undefined,
        });
        const { result } = renderHook(() => usePoiPoaStatus(), { wrapper });

        expect(result.current.data).toBeUndefined();
    });
});
