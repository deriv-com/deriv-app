import { renderHook } from '@testing-library/react-hooks';
import useP2PAdvertiserAdverts from '../use-p2p-advertiser-adverts';
import { useStores } from 'Stores/index';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PAdvertList: jest.fn(() => ({
        data: [
            {
                account_currency: 'USD',
                advertiser_details: {
                    name: 'client Test90000253',
                },
                counterparty_type: 'buy',
                country: 'id',
                description: 'Created by script. Please call me 02203400',
            },
        ],
    })),
}));
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({}),
}));

const mockUseStores = useStores as jest.MockedFunction<typeof useStores>;

describe('useP2PAdvertiserAdverts', () => {
    const mock_return_value = {
        general_store: {
            is_advertiser_info_subscribed: false,
            counterparty_advertiser_id: 'test id 1234',
        },
        buy_sell_store: {
            selected_local_currency: 'USD',
        },
        advertiser_page_store: { counterparty_type: 'buy' },
    };
    it('should return the advertiser adverts object from response when is_advertiser_info_subscribed is true and counterparty_advertiser_id is defined', () => {
        mockUseStores.mockReturnValueOnce({
            ...mock_return_value,
            general_store: {
                ...mock_return_value.general_store,
                is_advertiser_info_subscribed: true,
            },
        });
        const { result } = renderHook(() => useP2PAdvertiserAdverts());
        const adverts_list = result.current.adverts;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0]?.country).toBe('id');
        expect(adverts_list?.[0]?.counterparty_type).toBe('buy');
        expect(adverts_list?.[0]?.description).toBe('Created by script. Please call me 02203400');
        expect(adverts_list?.[0]?.advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the advertiser adverts object from response when is_advertiser_info_subscribed is false and counterparty_advertiser_id is defined', () => {
        mockUseStores.mockReturnValueOnce(mock_return_value);
        const { result } = renderHook(() => useP2PAdvertiserAdverts());
        const adverts_list = result.current.adverts;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0]?.country).toBe('id');
        expect(adverts_list?.[0]?.counterparty_type).toBe('buy');
        expect(adverts_list?.[0]?.description).toBe('Created by script. Please call me 02203400');
        expect(adverts_list?.[0]?.advertiser_details?.name).toBe('client Test90000253');
    });

    it('should return the advertiser adverts object from response when is_advertiser_info_subscribed is false and counterparty_advertiser_id is undefined', () => {
        mockUseStores.mockReturnValueOnce({
            ...mock_return_value,
            general_store: {
                ...mock_return_value.general_store,
                counterparty_advertiser_id: undefined,
            },
        });
        const { result } = renderHook(() => useP2PAdvertiserAdverts());
        const adverts_list = result.current.adverts;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0]?.country).toBe('id');
        expect(adverts_list?.[0]?.counterparty_type).toBe('buy');
        expect(adverts_list?.[0]?.description).toBe('Created by script. Please call me 02203400');
        expect(adverts_list?.[0]?.advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the advertiser adverts object from response when is_advertiser_info_subscribed is true and counterparty_advertiser_id is undefined', () => {
        mockUseStores.mockReturnValueOnce({
            ...mock_return_value,
            general_store: {
                ...mock_return_value.general_store,
                is_advertiser_info_subscribed: true,
                counterparty_advertiser_id: undefined,
            },
        });
        const { result } = renderHook(() => useP2PAdvertiserAdverts());
        const adverts_list = result.current.adverts;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0]?.country).toBe('id');
        expect(adverts_list?.[0]?.counterparty_type).toBe('buy');
        expect(adverts_list?.[0]?.description).toBe('Created by script. Please call me 02203400');
        expect(adverts_list?.[0]?.advertiser_details?.name).toBe('client Test90000253');
    });

    it('should return the advertiser adverts object from response when selected_local_currency is truthy', () => {
        mockUseStores.mockReturnValueOnce(mock_return_value);
        const { result } = renderHook(() => useP2PAdvertiserAdverts());
        const adverts_list = result.current.adverts;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0]?.country).toBe('id');
        expect(adverts_list?.[0]?.counterparty_type).toBe('buy');
        expect(adverts_list?.[0]?.description).toBe('Created by script. Please call me 02203400');
        expect(adverts_list?.[0]?.advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the advertiser adverts object from response when selected_local_currency is falsey', () => {
        mockUseStores.mockReturnValueOnce({
            ...mock_return_value,
            buy_sell_store: {
                ...mock_return_value.buy_sell_store,
                selected_local_currency: undefined,
            },
        });
        const { result } = renderHook(() => useP2PAdvertiserAdverts());
        const adverts_list = result.current.adverts;

        expect(adverts_list).toHaveLength(1);
        expect(adverts_list?.[0]?.country).toBe('id');
        expect(adverts_list?.[0]?.counterparty_type).toBe('buy');
        expect(adverts_list?.[0]?.description).toBe('Created by script. Please call me 02203400');
        expect(adverts_list?.[0]?.advertiser_details?.name).toBe('client Test90000253');
    });
});
