import { useAccountLimits, useAccountStatus, useActiveAccount } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import { getAccountLimitValues } from '../../utils/accountLimitsUtils';
import { useAccountLimitsData } from '../useAccountLimitsData';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAccountLimits: jest.fn(),
    useAccountStatus: jest.fn(),
    useActiveAccount: jest.fn(),
}));

jest.mock('../../utils/accountLimitsUtils', () => ({
    getAccountLimitValues: jest.fn(),
}));

const mockAccountLimitsResponse = {
    data: {
        account_balance: 300000000,
        open_positions: 100,
        payout: 50000,
        remainder: 9350.86,
    },
    isLoading: false,
};

const mockAccountStatusResponse = {
    data: { is_authenticated: true },
    isLoading: false,
};

const mockActiveAccountResponse = {
    data: {
        currency: 'USD',
        is_virtual: false,
    },
    isLoading: false,
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('useAccountLimitsData', () => {
    it('should return isLoading true if useAccountLimits is loading', () => {
        (useAccountLimits as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
        });
        (useAccountStatus as jest.Mock).mockReturnValue(mockAccountStatusResponse);
        (useActiveAccount as jest.Mock).mockReturnValue(mockActiveAccountResponse);

        const { result } = renderHook(() => useAccountLimitsData());
        const { isLoading } = result.current;
        expect(isLoading).toBeTruthy();
        expect(getAccountLimitValues).not.toHaveBeenCalled();
    });

    it('should return isLoading true if useAccountStatus is loading', () => {
        (useAccountLimits as jest.Mock).mockReturnValue(mockAccountLimitsResponse);
        (useAccountStatus as jest.Mock).mockReturnValue({ data: undefined, isLoading: true });
        (useActiveAccount as jest.Mock).mockReturnValue(mockActiveAccountResponse);

        const { result } = renderHook(() => useAccountLimitsData());
        const { isLoading } = result.current;
        expect(isLoading).toBeTruthy();
        expect(getAccountLimitValues).not.toHaveBeenCalled();
    });

    it('should return isLoading true if useActiveAccount is loading', () => {
        (useAccountLimits as jest.Mock).mockReturnValue(mockAccountLimitsResponse);
        (useAccountStatus as jest.Mock).mockReturnValue(mockAccountStatusResponse);
        (useActiveAccount as jest.Mock).mockReturnValue({ data: undefined, isLoading: true });

        const { result } = renderHook(() => useAccountLimitsData());
        const { isLoading } = result.current;
        expect(isLoading).toBeTruthy();
        expect(getAccountLimitValues).not.toHaveBeenCalled();
    });

    it('should return isVirtual true if useActiveAccount is demo account', () => {
        (useAccountLimits as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        (useAccountStatus as jest.Mock).mockReturnValue(mockAccountStatusResponse);
        (useActiveAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true }, isLoading: true });

        const { result } = renderHook(() => useAccountLimitsData());
        const { isVirtual } = result.current;
        expect(isVirtual).toBeTruthy();
        expect(getAccountLimitValues).not.toHaveBeenCalled();
    });

    it('should return empty array  if account limits is undefined', () => {
        (useAccountLimits as jest.Mock).mockReturnValue({ data: undefined, isLoading: false });
        (useAccountStatus as jest.Mock).mockReturnValue(mockAccountStatusResponse);
        (useActiveAccount as jest.Mock).mockReturnValue(mockActiveAccountResponse);

        const { result } = renderHook(() => useAccountLimitsData());
        const { accountLimits } = result.current;
        expect(accountLimits).toEqual([]);
        expect(getAccountLimitValues).not.toHaveBeenCalled();
    });
    it('should call getAccountLimitValues with the correct arguments', () => {
        (useAccountLimits as jest.Mock).mockReturnValue(mockAccountLimitsResponse);
        (useAccountStatus as jest.Mock).mockReturnValue(mockAccountStatusResponse);
        (useActiveAccount as jest.Mock).mockReturnValue(mockActiveAccountResponse);
        renderHook(() => useAccountLimitsData());
        expect(getAccountLimitValues).toBeCalledWith(
            mockAccountLimitsResponse.data,
            mockActiveAccountResponse.data.currency,
            mockAccountStatusResponse.data.is_authenticated
        );
    });
});
