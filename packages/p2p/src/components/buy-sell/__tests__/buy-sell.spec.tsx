import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores/index';
import BuySell from '../buy-sell';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        registerAdvertIntervalReaction: jest.fn(),
        registerIsListedReaction: jest.fn(),
        setLocalCurrency: jest.fn(),
        should_show_verification: false,
        show_advertiser_page: false,
    },
    general_store: {
        is_advertiser: true,
        poiStatusText: jest.fn(),
    },
    my_profile_store: {
        getPaymentMethodsList: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));
jest.mock('Components/buy-sell/buy-sell-header', () => jest.fn(() => <div>BuySellHeader</div>));
jest.mock('Components/buy-sell/buy-sell-table', () => jest.fn(() => <div>BuySellTable</div>));

describe('<BuySell/>', () => {
    it('should render the component if the user is an advertiser', () => {
        render(<BuySell />);

        expect(screen.getByText('BuySellHeader')).toBeInTheDocument();
        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
    });

    it('should render the verification content if the user is not an advertiser', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                should_show_verification: true,
            },
            general_store: {
                ...mock_store.general_store,
                is_advertiser: false,
            },
        });

        render(<BuySell />);
        expect(
            screen.getByText(
                'To use Deriv P2P, you need to choose a display name (a nickname) and verify your identity.'
            )
        ).toBeInTheDocument();
    });
});
