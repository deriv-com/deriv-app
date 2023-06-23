import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileBalance from '../my-profile-balance';

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: jest.fn(() => ({
        showModal: jest.fn(),
    })),
}));

describe('<MyProfileBalance />', () => {
    it('should render MyProfileBalance', () => {
        render(<MyProfileBalance />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        expect(screen.getByText('Available Deriv P2P balance')).toBeInTheDocument();
    });

    it('should render MyProfileBalanceModal when icon is clicked on', () => {
        const showModalMock = jest.fn();

        (useModalManagerContext as jest.Mock).mockImplementation(() => ({
            showModal: showModalMock,
        }));

        render(<MyProfileBalance />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const infoIcon = screen.getByTestId('dt_my_profile_balance_icon');

        userEvent.click(infoIcon);

        expect(showModalMock).toHaveBeenCalledTimes(1);
        expect(showModalMock).toHaveBeenCalledWith({ key: 'MyProfileBalanceModal' });
    });
});
