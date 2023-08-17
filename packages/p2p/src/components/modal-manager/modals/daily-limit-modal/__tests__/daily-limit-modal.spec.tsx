import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import DailyLimitModal from '../daily-limit-modal';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
}));

describe('<DailyLimitModal />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                advertiser_info: {
                    daily_buy_limit: '100.00',
                    daily_sell_limit: '100.00',
                },
            },
            my_profile_store: {
                is_daily_limit_upgrade_success: false,
                is_daily_limit_upgrading: false,
                is_there_daily_limit_error: false,
                setIsDailyLimitUpgrading: jest.fn(),
                upgradeDailyLimit: jest.fn(),
            },
        };
    });

    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render DailyLimitModal and prompt user if they want to upgrade', () => {
        render(<DailyLimitModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('should render the Loading component when is_daily_limit_upgrading is true', () => {
        mock_store.my_profile_store.is_daily_limit_upgrading = true;

        render(<DailyLimitModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should prompt the user that there was an error when is_there_daily_limit_error is true', () => {
        mock_store.my_profile_store.is_there_daily_limit_error = true;

        render(<DailyLimitModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('An internal error occurred')).toBeInTheDocument();
    });

    it('should render a success message when is_daily_limit_upgrade_success is true', () => {
        mock_store.my_profile_store.is_daily_limit_upgrade_success = true;

        render(<DailyLimitModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('should call setIsDailyLimitUpgrading and upgradeDailyLimit functions when clicking on Yes button', () => {
        render(<DailyLimitModal />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const yesButton = screen.getByRole('button', { name: 'Yes, continue' });

        userEvent.click(yesButton);

        expect(mock_store.my_profile_store.setIsDailyLimitUpgrading).toHaveBeenCalledTimes(1);
        expect(mock_store.my_profile_store.setIsDailyLimitUpgrading).toHaveBeenCalledWith(true);
        expect(mock_store.my_profile_store.upgradeDailyLimit).toHaveBeenCalledTimes(1);
    });
});
