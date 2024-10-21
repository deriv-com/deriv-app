import { useTradingPlatformStatus } from '@deriv/api-v2';
import { cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { getMarketTypeDetails } from '../../../../../constants';
import { TAddedMT5Account } from '../../../../../types';
import useAddedMT5Account from '../useAddedMT5Account';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useTradingPlatformStatus: jest.fn(),
}));

jest.mock('../../../../../constants', () => ({
    ...jest.requireActual('../../../../../constants'),
    getMarketTypeDetails: jest.fn(),
}));

const mockAccount = {
    market_type: 'financial',
    product: 'financial',
    status: '',
} as TAddedMT5Account;

describe('useAddedMT5Account', () => {
    beforeEach(() => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(),
        });
    });
    afterEach(cleanup);

    it('provides correct account details based on the market type', () => {
        (getMarketTypeDetails as jest.Mock).mockReturnValue({ financial: 'mock-account-details' });

        const { result } = renderHook(() => useAddedMT5Account(mockAccount));

        expect(result.current.accountDetails).toEqual('mock-account-details');
    });

    it('isServerMaintenance is `true` when trading platform status is `maintenance`', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'maintenance'),
        });

        const { result } = renderHook(() => useAddedMT5Account(mockAccount));

        expect(result.current.isServerMaintenance).toEqual(true);
    });

    it('isServerMaintenance is `true` when account status is `under_maintenance`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'under_maintenance' }));

        expect(result.current.isServerMaintenance).toEqual(true);
    });

    it('kycStatus is `failed` when status received for account is `proof_failed`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'proof_failed' }));

        expect(result.current.kycStatus).toEqual('failed');
    });

    it('kycStatus is `failed` when status received for account is `poa_failed`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'poa_failed' }));

        expect(result.current.kycStatus).toEqual('failed');
    });

    it('kycStatus is `in_review` when status received for account is `verification_pending`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'verification_pending' }));

        expect(result.current.kycStatus).toEqual('in_review');
    });

    it('kycStatus is `needs_verification` when status received for account is `needs_verification`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'needs_verification' }));

        expect(result.current.kycStatus).toEqual('needs_verification');
    });

    it('showMT5TradeModal is `true` when platform status is `active`', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'active'),
        });

        const { result } = renderHook(() => useAddedMT5Account(mockAccount));

        expect(result.current.showMT5TradeModal).toEqual(true);
    });

    it('showPlatformStatus is `true` when account status is `unavailable`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'unavailable' }));

        expect(result.current.showPlatformStatus).toEqual(true);
    });

    it('showPlatformStatus is `true` when account status is `under_maintenance`', () => {
        const { result } = renderHook(() => useAddedMT5Account({ ...mockAccount, status: 'under_maintenance' }));

        expect(result.current.showPlatformStatus).toEqual(true);
    });

    it('showPlatformStatus is `true` when trading platform status is `maintenance`', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'maintenance'),
        });

        const { result } = renderHook(() => useAddedMT5Account(mockAccount));

        expect(result.current.showPlatformStatus).toEqual(true);
    });
});
