import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import AdvertiserPageRow from '../advertiser-page-row';
import { adverts } from '../../__mocks__/mock-data';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    advertiser_page_store: {
        advertiser_details_id: 'id1',
        counterparty_type: 'sell',
    },
    general_store: {
        advertiser_id: 'id2',
    },
    floating_rate_store: {
        exchange_rate: '1.2',
    },
    buy_sell_store: {
        setSelectedAdState: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock_modal_manager = {
    isCurrentModal: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
    random: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

const props = {
    row: {
        ...adverts[0],
    },
};
describe('<AdvertiserPageRow/>', () => {
    it('should render the row with the passed props as sell order with sell usd button', () => {
        render(
            <StoreProvider store={mock}>
                <AdvertiserPageRow {...props} />
            </StoreProvider>
        );

        const place_order_button = screen.getByRole('button', { name: 'Sell USD' });
        expect(place_order_button).toBeInTheDocument();
    });

    it('should open the buy/sell modal when clicking on "sell usd" button', () => {
        render(
            <StoreProvider store={mock}>
                <AdvertiserPageRow {...props} />
            </StoreProvider>
        );

        const place_order_button = screen.getByRole('button', { name: 'Sell USD' });
        expect(place_order_button).toBeInTheDocument();
        userEvent.click(place_order_button);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'BuySellModal' });
    });

    it('should render the row with the passed props as buy order with buy usd button', () => {
        const new_props = { ...props, row: { ...props.row, type: 'buy', counterparty_type: 'sell' } };
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store,
            advertiser_page_store: {
                ...mock_store.advertiser_page_store,
                counterparty_type: 'buy',
            },
        });
        render(
            <StoreProvider store={mock}>
                <AdvertiserPageRow {...new_props} />
            </StoreProvider>
        );

        const place_order_button = screen.getByRole('button', { name: 'Buy USD' });
        expect(place_order_button).toBeInTheDocument();
        userEvent.click(place_order_button);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'BuySellModal' });
    });

    it('should render the row without buyusd/sellusd button for user own advert', () => {
        const new_props = { ...props, row: { ...props.row, type: 'buy', counterparty_type: 'sell' } };
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                advertiser_id: 'id1',
            },
        });
        render(
            <StoreProvider store={mock}>
                <AdvertiserPageRow {...new_props} />
            </StoreProvider>
        );

        const place_order_button = screen.queryByRole('button', { name: 'Sell USD' });
        expect(place_order_button).not.toBeInTheDocument();
    });
});
