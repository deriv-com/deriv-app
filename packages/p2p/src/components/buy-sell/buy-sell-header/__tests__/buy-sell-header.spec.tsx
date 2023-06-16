import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { ModalManager, ModalManagerContextProvider } from 'Components/modal-manager';
import { useStores } from 'Stores/index';
import BuySellHeader from '../buy-sell-header';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        getWebsiteStatus: jest.fn(),
        loadMoreItems: jest.fn(),
        setIsLoading: jest.fn(),
        setItems: jest.fn(),
        setSearchTerm: jest.fn(),
    },
    general_store: {
        feature_level: 2,
        showModal: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));
jest.mock('Components/buy-sell/buy-sell-header/buy-sell-header-currency-dropdown', () =>
    jest.fn(() => <div>BuySellHeaderCurrencyDropdown</div>)
);
jest.mock('Components/buy-sell/buy-sell-header/buy-sell-header-dropdown', () =>
    jest.fn(() => <div>BuySellHeaderDropdown</div>)
);
jest.mock('Components/modal-manager/modals/filter-modal', () => jest.fn(() => <div>FilterModal</div>));

describe('BuySellHeader', () => {
    it('should render the component', () => {
        render(
            <ModalManagerContextProvider>
                <BuySellHeader table_type='buy' />
            </ModalManagerContextProvider>
        );

        expect(screen.getByText('Buy')).toBeInTheDocument();
        expect(screen.getByText('Sell')).toBeInTheDocument();
        expect(screen.getByText('BuySellHeaderDropdown')).toBeInTheDocument();
        expect(screen.getByText('BuySellHeaderCurrencyDropdown')).toBeInTheDocument();
    });
    it('should hide the currency selector if cross border ads is disabled in BO', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            general_store: {
                ...mock_store.general_store,
                feature_level: 1,
            },
        });

        render(
            <ModalManagerContextProvider>
                <BuySellHeader table_type='buy' />
            </ModalManagerContextProvider>
        );

        expect(screen.queryByText('BuySellHeaderCurrencyDropdown')).not.toBeInTheDocument();
    });
    it('should show the filter modal upon clicking the filter icon', async () => {
        render(
            <ModalManagerContextProvider>
                <ModalManager />
                <BuySellHeader table_type='buy' />
            </ModalManagerContextProvider>
        );

        const filter_icon = screen.getByTestId('dt_buy_sell_header_row_filter');

        userEvent.click(filter_icon);

        await waitFor(() => {
            expect(screen.getByText('FilterModal')).toBeInTheDocument();
        });
    });
    it('should call getWebsiteStatus function every minute', async () => {
        jest.useFakeTimers();

        render(
            <ModalManagerContextProvider>
                <BuySellHeader table_type='buy' />
            </ModalManagerContextProvider>
        );

        jest.advanceTimersByTime(60000);

        expect(mock_store.buy_sell_store.getWebsiteStatus).toBeCalled();

        jest.clearAllTimers();
    });
});
