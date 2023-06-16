import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores/index';
import BuySellTableRow from '../buy-sell-table-row';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        setSelectedAdvert: jest.fn(),
        setShouldShowVerification: jest.fn(),
        showAdvertiserPage: jest.fn(),
    },
    floating_rate_store: {
        exchange_rate: '14979.8',
    },
    general_store: {
        advertiser_id: '15',
        is_advertiser: true,
        is_barred: false,
    },
};

const mock = mockStore({
    client: {
        currency: 'USD',
    },
});

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

describe('BuySellTableRow', () => {
    it('should render the row with the advert details in desktop', () => {
        const advert = {
            account_currency: 'USD',
            advertiser_details: {
                id: '14',
                is_online: false,
                name: 'Advertiser001',
                rating_average: null,
                rating_count: null,
            },
            counterparty_type: 'buy',
            min_order_amount_limit_display: '1',
            max_order_amount_limit_display: '50',
            payment_method_names: ['Alipay'],
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        expect(screen.getByText('Advertiser001')).toBeInTheDocument();
        expect(screen.getByText('Not rated yet')).toBeInTheDocument();
        expect(screen.getByText('Alipay')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Buy USD' })).toBeInTheDocument();
    });

    it('should render the row with the advert details in responsive', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        const advert = {
            account_currency: 'USD',
            advertiser_details: {
                id: '14',
                is_online: false,
                name: 'Advertiser001',
                rating_average: 5,
                rating_count: 2,
            },
            counterparty_type: 'sell',
            min_order_amount_limit_display: '1',
            max_order_amount_limit_display: '50',
            payment_method_names: ['Alipay', 'Bank Transfer'],
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        expect(screen.getByText('Advertiser001')).toBeInTheDocument();
        expect(screen.getByText('Alipay')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sell USD' })).toBeInTheDocument();
    });

    it("should show 'There are no matching ads.' message if there are no matching ads with the selected currency", () => {
        const advert = {
            id: 'NO_MATCH_ROW',
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        expect(screen.getByText('There are no matching ads.')).toBeInTheDocument();
    });

    it('should add an empty row', () => {
        const advert = {
            id: 'WATCH_THIS_SPACE',
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_buy_sell_table_empty_row')).toBeInTheDocument();
    });

    it('should not show the buttons to buy/sell if the advert is created by the advertiser', () => {
        const advert = {
            account_currency: 'USD',
            advertiser_details: {
                id: '15',
                is_online: true,
                name: 'Advertiser002',
                rating_average: 5,
                rating_count: 2,
            },
            counterparty_type: 'buy',
            min_order_amount_limit_display: '51',
            max_order_amount_limit_display: '100',
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        expect(screen.queryByRole('button', { name: 'Buy USD' })).not.toBeInTheDocument();
    });

    it('should show the advertiser page upon clicking the row', async () => {
        const advert = {
            account_currency: 'USD',
            advertiser_details: {
                is_online: true,
                name: 'Advertiser003',
                rating_average: null,
                rating_count: null,
            },
            counterparty_type: 'sell',
            min_order_amount_limit_display: '51',
            max_order_amount_limit_display: '100',
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        const row = screen.getByTestId('dt_buy_sell_table_row_advertiser');
        userEvent.click(row);

        await waitFor(() => {
            expect(mock_store.buy_sell_store.showAdvertiserPage).toHaveBeenCalled();
        });
    });

    it('should show the verification content upon clicking the row and user is not an advertiser', async () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                is_advertiser: false,
            },
        });

        const advert = {
            account_currency: 'USD',
            advertiser_details: {
                is_online: true,
                name: 'Advertiser004',
                rating_average: null,
                rating_count: null,
            },
            counterparty_type: 'sell',
            min_order_amount_limit_display: '51',
            max_order_amount_limit_display: '100',
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        const row = screen.getByTestId('dt_buy_sell_table_row_advertiser');
        userEvent.click(row);

        await waitFor(() => {
            expect(mock_store.buy_sell_store.setShouldShowVerification).toHaveBeenCalledWith(true);
        });
    });

    it('should set the selected advert if the user buy/sell an advert', async () => {
        const advert = {
            account_currency: 'USD',
            advertiser_details: {
                is_online: true,
                name: 'Advertiser005',
                rating_average: null,
                rating_count: null,
            },
            counterparty_type: 'sell',
            min_order_amount_limit_display: '51',
            max_order_amount_limit_display: '100',
        };
        render(
            <StoreProvider store={mock}>
                <BuySellTableRow row={advert} />
            </StoreProvider>
        );

        const sell_button = screen.getByRole('button', { name: 'Sell USD' });
        userEvent.click(sell_button);

        await waitFor(() => {
            expect(mock_store.buy_sell_store.setSelectedAdvert).toHaveBeenCalledWith(advert);
        });
    });
});
