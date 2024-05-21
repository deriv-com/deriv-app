import { renderHook } from '@testing-library/react-hooks';
import useAvailableCTraderAccounts from '../useAvailableCTraderAccounts';
import useQuery from '../../useQuery';
import useAuthorize from '../useAuthorize';

// Mock useQuery and useAuthorize hooks
jest.mock('../../useQuery');
jest.mock('../useAuthorize');

describe('useAvailableCTraderAccounts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an empty data array when not authorized', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        (useQuery as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });

        const { result } = renderHook(() => useAvailableCTraderAccounts());

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should return transformed accounts data when authorized', () => {
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useQuery as jest.Mock).mockReturnValue({
            data: {
                trading_platform_available_accounts: [
                    { market_type: 'gaming', balance: 1000 },
                    { market_type: 'financial', balance: 2000 },
                ],
            },
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useAvailableCTraderAccounts());

        expect(result.current.data).toEqual([
            { market_type: 'synthetic', platform: 'ctrader', leverage: 500, balance: 1000 },
            { market_type: 'financial', platform: 'ctrader', leverage: 1000, balance: 2000 },
        ]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });
});
