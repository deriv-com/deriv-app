import { renderHook } from '@testing-library/react-hooks';
import useP2PExchangeRate from '../useP2PExchangeRate';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useExchangeRate2: () => ({
        handleSubscription: jest.fn(),
        exchange_rates: {
            USD: {
                EUR: 0.85,
                JPY: 105.5,
            },
        },
    }),
}));

describe('useP2PExchangeRate hook', () => {
    it('should return the correct exchange rate with the passed local_currency', () => {
        const { result } = renderHook(() => useP2PExchangeRate('EUR'));
        expect(result.current).toBe(0.85);
    });
});
