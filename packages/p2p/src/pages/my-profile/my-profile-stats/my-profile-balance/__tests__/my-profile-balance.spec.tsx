import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileBalance from '../my-profile-balance';

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<MyProfileBalance />', () => {
    it('should render MyProfileBalance', () => {
        render(<MyProfileBalance />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Available Deriv P2P balance')).toBeInTheDocument();
    });

    it('should render MyProfileBalanceModal when icon is clicked on and call showModal', () => {
        render(<MyProfileBalance />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const infoIcon = screen.getByTestId('dt_my_profile_balance_icon');

        userEvent.click(infoIcon);

        expect(mock_modal_manager.showModal).toHaveBeenCalledTimes(1);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'MyProfileBalanceModal' });
    });
});
