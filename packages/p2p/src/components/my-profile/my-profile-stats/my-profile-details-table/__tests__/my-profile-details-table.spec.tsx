import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileDetailsTable from '../my-profile-details-table';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(() => ({
        showModal: jest.fn(),
    })),
}));

describe('<MyProfileDetailsTable />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                advertiser_info: {
                    upgradable_daily_limits: {
                        max_daily_buy: '10000',
                        max_daily_sell: '10000',
                    },
                },
            },
        };
    });

    it('should render MyProfileDetailsTable component', () => {
        render(<MyProfileDetailsTable />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Buy')).toBeInTheDocument();
        expect(screen.getByText('Sell')).toBeInTheDocument();
    });

    it('should render MyProfileDetailsTable component', () => {
        const showModalMock = jest.fn();

        (useModalManagerContext as jest.Mock).mockImplementation(() => ({
            showModal: showModalMock,
        }));

        render(<MyProfileDetailsTable />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const increaseLimitsButton = screen.getByRole('button', { name: 'Increase my limits' });

        userEvent.click(increaseLimitsButton);

        expect(showModalMock).toHaveBeenCalledTimes(1);
        expect(showModalMock).toHaveBeenCalledWith({ key: 'DailyLimitModal' });
    });
});
