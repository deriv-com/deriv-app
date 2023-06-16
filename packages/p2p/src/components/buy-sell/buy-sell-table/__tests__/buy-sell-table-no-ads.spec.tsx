import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySellTableNoAds from '../buy-sell-table-no-ads';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        is_buy: true,
        local_currencies: [
            {
                text: 'IDR',
                is_default: true,
            },
            {
                text: 'INR',
                is_default: false,
            },
        ],
        selected_local_currency: 'IDR',
        setCreateSellAdFromNoAds: jest.fn(),
    },
    general_store: {
        handleTabClick: jest.fn(),
        is_barred: false,
    },
    my_ads_store: {
        setShowAdForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('BuySellTableNoAds', () => {
    it('shoulde render the component if there is no ad for the local currency selected', async () => {
        render(<BuySellTableNoAds />);

        expect(
            screen.getByText('Looking to buy or sell USD? You can post your own ad for others to respond.')
        ).toBeInTheDocument();

        const create_ad_button = screen.getByRole('button', { name: 'Create ad' });
        userEvent.click(create_ad_button);

        await waitFor(() => {
            expect(mock_store.general_store.handleTabClick).toHaveBeenCalledWith(2);
            expect(mock_store.buy_sell_store.setCreateSellAdFromNoAds).toHaveBeenCalledWith(true);
            expect(mock_store.my_ads_store.setShowAdForm).toHaveBeenCalledWith(true);
        });
    });

    it('shoulde render the component if there is no ad for the other currency selected', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                local_currencies: [
                    {
                        text: 'IDR',
                        is_default: true,
                    },
                    {
                        text: 'INR',
                        is_default: false,
                    },
                ],
                selected_local_currency: 'INR',
            },
        });

        render(<BuySellTableNoAds />);

        expect(screen.getByText(/No ads for this currency at the moment/i)).toBeInTheDocument();
    });
});
