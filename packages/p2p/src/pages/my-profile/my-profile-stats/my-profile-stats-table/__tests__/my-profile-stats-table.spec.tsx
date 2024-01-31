import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import MyProfileStatsTable from '../my-profile-stats-table';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<MyProfileStatsTable />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                advertiser_info: {
                    buy_completion_rate: 100,
                    buy_orders_amount: 1,
                    buy_orders_count: 1,
                    buy_time_avg: 80,
                    partner_count: 1,
                    release_time_avg: 60,
                    sell_completion_rate: 100,
                    sell_orders_amount: 1,
                    sell_orders_count: 1,
                    total_orders_count: 2,
                    total_turnover: 50,
                },
            },
        };
    });

    it('should render MyProfileStatsTable', () => {
        render(<MyProfileStatsTable />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Buy completion')).toBeInTheDocument();
        expect(screen.getByText('Sell completion')).toBeInTheDocument();
        expect(screen.getByText('Avg pay time')).toBeInTheDocument();
        expect(screen.getByText('Avg release time')).toBeInTheDocument();
        expect(screen.getAllByText('30d')).toHaveLength(6);
        expect(screen.getAllByText('lifetime')).toHaveLength(2);
        expect(screen.getByText('Trade partners')).toBeInTheDocument();
    });

    it('should render be able to switch between 30d and lifetime for Trade volume', () => {
        const setShowLifetimeTurnoverValueMock = jest.spyOn(React, 'useState');
        (setShowLifetimeTurnoverValueMock as jest.Mock).mockImplementation(initialValue => [initialValue, jest.fn()]);

        render(<MyProfileStatsTable />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const tradeVolume30d = screen.getAllByText('30d')[4];
        const tradeVolumeLifetime = screen.getAllByText('lifetime')[0];

        userEvent.click(tradeVolume30d);

        expect(setShowLifetimeTurnoverValueMock).toHaveBeenCalledWith(false);

        userEvent.click(tradeVolumeLifetime);

        expect(setShowLifetimeTurnoverValueMock).toHaveBeenCalledWith(false);

        setShowLifetimeTurnoverValueMock.mockRestore();
    });

    it('should render be able to switch between 30d and lifetime for Total orders', () => {
        const setShowLifetimeOrderValueMock = jest.spyOn(React, 'useState');

        (setShowLifetimeOrderValueMock as jest.Mock).mockImplementation(initialValue => [initialValue, jest.fn()]);

        render(<MyProfileStatsTable />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const totalOrders30d = screen.getAllByText('30d')[5];
        const totalOrdersLifetime = screen.getAllByText('lifetime')[1];

        userEvent.click(totalOrders30d);

        expect(setShowLifetimeOrderValueMock).toHaveBeenCalledWith(false);

        userEvent.click(totalOrdersLifetime);

        expect(setShowLifetimeOrderValueMock).toHaveBeenCalledWith(false);

        setShowLifetimeOrderValueMock.mockRestore();
    });
});
