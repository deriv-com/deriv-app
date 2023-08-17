import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import MyProfileDetailsTable from '../my-profile-details-table';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(() => mock_modal_manager),
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
        render(<MyProfileDetailsTable />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const increaseLimitsButton = screen.getByRole('button', { name: 'Increase my limits' });

        userEvent.click(increaseLimitsButton);

        expect(mock_modal_manager.showModal).toHaveBeenCalledTimes(1);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'DailyLimitModal' });
    });
});
