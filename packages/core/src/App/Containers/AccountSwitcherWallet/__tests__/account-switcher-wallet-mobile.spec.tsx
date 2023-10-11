import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useWalletAccountsList } from '@deriv/hooks';
import { AccountSwitcherWalletMobile } from '../account-switcher-wallet-mobile';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletAccountsList: jest.fn(() => ({
        data: [{ loginid: 'CR007', dtrade_loginid: 'CR008' }],
    })),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('../account-switcher-wallet-list', () => ({
    AccountSwitcherWalletList: () => <div>AccountSwitcherWalletList</div>,
}));

const props: React.ComponentProps<typeof AccountSwitcherWalletMobile> = {
    is_visible: true,
    toggle: jest.fn(),
};

const store = mockStore({});

let modal_root_el: HTMLDivElement;

beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'deriv_app');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

const AccountSwitcherWalletMobileComponent = (props: React.ComponentProps<typeof AccountSwitcherWalletMobile>) => {
    return (
        <StoreProvider store={store}>
            <AccountSwitcherWalletMobile {...props} />
        </StoreProvider>
    );
};

describe('AccountSwitcherWalletMobileComponent', () => {
    it('should render the component', () => {
        render(<AccountSwitcherWalletMobileComponent {...props} />);
        expect(screen.getByText('Deriv Apps accounts')).toBeInTheDocument();
        expect(screen.getByText('AccountSwitcherWalletList')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Manage funds' })).toBeInTheDocument();
        expect(screen.getByText('Looking for CFDs? Go to Trader’s hub')).toBeInTheDocument();
    });

    it('should render list wallets', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValueOnce({
            data: [{ loginid: 'CR007', dtrade_loginid: 'CR008' }],
        });

        render(<AccountSwitcherWalletMobileComponent {...props} />);
        expect(screen.getByText('AccountSwitcherWalletList')).toBeInTheDocument();
    });

    it('should toggle the switcher on footer click', () => {
        render(<AccountSwitcherWalletMobileComponent {...props} />);
        const footer = screen.getByText('Looking for CFDs? Go to Trader’s hub');
        userEvent.click(footer);
        expect(props.toggle).toHaveBeenCalledTimes(1);
    });
});
