import { renderHook } from '@testing-library/react-hooks';
import useCryptoConfig from '../useCryptoConfig';
import { withMockAPIProvider } from '../mocks';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(() => ({
        data: {
            crypto_config: {
                currencies_config: {
                    BTC: { minimum_withdrawal: 100 },
                },
            },
        },
    })),
}));

describe('useCryptoConfig', () => {
    test("returns undefined if the currency doesn't provided to the hook", () => {
        const wrapper = withMockAPIProvider();

        //@ts-expect-error checking invocation without arguments
        const { result, rerender } = renderHook(() => useCryptoConfig(), { wrapper });

        expect(result.current.data).toBe(undefined);

        //@ts-expect-error checking invocation if currency is null
        rerender(() => useCryptoConfig(null));

        //@ts-expect-error checking invocation if currency is undefined
        rerender(() => useCryptoConfig(undefined));
    });

    it('returns currency config object for the given currency', () => {
        const wrapper = withMockAPIProvider();

        const { result } = renderHook(() => useCryptoConfig('BTC'), { wrapper });

        expect(result.current.data).toStrictEqual({ minimum_withdrawal: 100 });
    });

    it('returns undefined if the wrong currency provided to the hook', () => {
        const wrapper = withMockAPIProvider();

        const { result } = renderHook(() => useCryptoConfig('WrongCurrency'), { wrapper });

        expect(result.current.data).toBe(undefined);
    });
});
