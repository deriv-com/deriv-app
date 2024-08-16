import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DerivAppsSuccessFooter } from '../DerivAppsSuccessFooter';

const mockHistoryPush = jest.fn();
const mockHide = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

jest.mock('../../ModalProvider', () => ({
    ...jest.requireActual('../../ModalProvider'),
    useModal: jest.fn(() => ({ hide: mockHide })),
}));

describe('DerivAppsSuccessFooter', () => {
    it('renders the component', () => {
        render(<DerivAppsSuccessFooter />);
        expect(screen.getByText(/Transfer funds/)).toBeInTheDocument();
    });
    it('hides the modal when Maybe later button is clicked', () => {
        render(<DerivAppsSuccessFooter />);
        userEvent.click(screen.getByText(/Maybe later/));
        expect(mockHide).toHaveBeenCalled();
    });
    it('navigates to /wallet/account-transfer when Transfer funds button is clicked', () => {
        render(<DerivAppsSuccessFooter />);
        userEvent.click(screen.getByText(/Transfer funds/));
        expect(mockHistoryPush).toHaveBeenCalledWith('/wallet/account-transfer');
    });
});
