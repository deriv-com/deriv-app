import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletContent from '../wallet-content';
import { APIProvider } from '@deriv/api';

const mockedRootStore = mockStore({
    modules: {
        cfd: {
            toggleCompareAccountsModal: jest.fn(),
        },
    },
});

jest.mock('./../../containers/currency-switcher-container', () => jest.fn(({ children }) => <div>{children}</div>));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWalletsList: jest.fn(),
    useActiveWallet: jest.fn(),
}));

jest.mock('../wallet-cfds-listing', () => jest.fn(() => <div> WalletCFDListing</div>));

const WalletContentWrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockedRootStore}>{children}</StoreProvider>
    </APIProvider>
);

describe('<WalletContent />', () => {
    it('Check class', () => {
        render(<WalletContent is_demo={false} is_malta_wallet={false} />, { wrapper: WalletContentWrapper });

        const wrapper = screen.queryByTestId('dt_wallet-content');
        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).not.toHaveClass('wallet-content__demo');
    });

    it('Check class for demo', () => {
        render(<WalletContent is_demo is_malta_wallet={false} />, { wrapper: WalletContentWrapper });

        const wrapper = screen.queryByTestId('dt_wallet-content');
        expect(wrapper).toHaveClass('wallet-content');
        expect(wrapper).toHaveClass('wallet-content__demo');
    });

    it('Check there is NOT disclaimer for demo', () => {
        render(<WalletContent is_demo={false} is_malta_wallet={false} />, { wrapper: WalletContentWrapper });

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is NOT disclaimer for Non-EU', () => {
        render(<WalletContent is_demo={true} is_malta_wallet={false} />, { wrapper: WalletContentWrapper });

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).not.toBeInTheDocument();
    });

    it('Check there is disclaimer for EU and not demo', () => {
        render(<WalletContent is_demo={false} is_malta_wallet />, { wrapper: WalletContentWrapper });

        const disclaimer = screen.queryByTestId('dt_disclaimer_wrapper');

        expect(disclaimer).toBeInTheDocument();
    });
});
