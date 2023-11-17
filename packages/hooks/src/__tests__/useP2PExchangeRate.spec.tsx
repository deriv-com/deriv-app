import { renderHook } from '@testing-library/react-hooks';
import useP2PExchangeRate from '../useP2PExchangeRate';
import useExchangeRate from '../useExchangeRate';

jest.mock('../useExchangeRate');

const mockUseExchangeRate = useExchangeRate as jest.MockedFunction<typeof useExchangeRate>;

describe('useP2PExchangeRate hook', () => {
    it('Should return the exchange rate for the specified local currency', () => {
        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
        mockUseExchangeRate.mockReturnValue({
            handleSubscription: jest.fn(),
            exchange_rates: {
                USD: {
                    EUR: 0.85,
                    JPY: 105.5,
                },
            },
        });

        const { result } = renderHook(() => useP2PExchangeRate('EUR'));
        expect(result.current).toBe(0.85);
    });

    it('Should subscribe to the exchange rate when the local currency changes', () => {
        const mockHandleSubscription = jest.fn();
        // @ts-expect-error need to come up with a way to mock the return type of usePaginatedFetch
        mockUseExchangeRate.mockReturnValue({
            handleSubscription: mockHandleSubscription,
            exchange_rates: {
                USD: {
                    EUR: 0.85,
                    JPY: 105.5,
                },
            },
        });

        const { rerender } = renderHook((nextProps: string) => useP2PExchangeRate(nextProps || 'EUR'));

        rerender('JPY');
        expect(mockHandleSubscription).toHaveBeenCalledTimes(2);
        expect(mockHandleSubscription).toHaveBeenCalledWith('USD', 'EUR');
        expect(mockHandleSubscription).toHaveBeenCalledWith('USD', 'JPY');
    });
});
