import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import Wallet from '../wallet';

const mockedRootStore = mockStore({
    modules: {
        cfd: {
            toggleCompareAccountsModal: jest.fn(),
        },
    },
});

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    getStatusBadgeConfig: jest.fn(() => ({ icon: '', text: '' })),
}));

jest.mock('./../currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('./../../wallet-content', () => jest.fn(() => <span>wallet test content</span>));

let wallet_account: TCoreStores['client']['accounts'][0];

describe('<Wallets />', () => {
    beforeEach(() => {
        wallet_account = {
            balance: 10415.24,
            currency: 'USD',
            landing_company_shortcode: 'svg',
            is_virtual: 1,
            loginid: 'CRW12345',
            // @ts-expect-error This should be fixed when we remove the mock transactions
            gradient_class: 'demo',
        };
    });

    it('Check class for NOT demo', () => {
        wallet_account.is_virtual = 0;

        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={wallet_account} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).not.toHaveClass('wallet__demo');
    });

    it('Check class for demo', () => {
        const { container } = render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={wallet_account} />
            </StoreProvider>
        );

        expect(container.childNodes[0]).toHaveClass('wallet');
        expect(container.childNodes[0]).toHaveClass('wallet__demo');
    });

    it('Should show content when clicking on arrow icon', async () => {
        const Wrapper = () => {
            const [is_open, wrapperSetIsOpen] = React.useState(false);
            return (
                <StoreProvider store={mockedRootStore}>
                    <Wallet wallet_account={wallet_account} active={is_open} setActive={wrapperSetIsOpen} />
                </StoreProvider>
            );
        };

        render(<Wrapper />);
        const arrow_icon = screen.getByTestId('dt_arrow');

        expect(screen.queryByText('wallet test content')).not.toBeInTheDocument();
        userEvent.click(arrow_icon);
        expect(screen.queryByText('wallet test content')).toBeInTheDocument();
    });

    it('Check for demo wallet header', () => {
        render(
            <StoreProvider store={mockedRootStore}>
                <Wallet wallet_account={wallet_account} />
            </StoreProvider>
        );
        const currency_card = screen.queryByTestId(`dt_demo`);

        expect(currency_card).toBeInTheDocument();
    });
});
