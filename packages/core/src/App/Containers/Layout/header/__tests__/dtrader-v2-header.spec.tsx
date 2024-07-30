import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import DTraderV2Header from '../dtrader-v2-header';

const real_acc_signup = 'RealAccountSignup';
const set_acc_currency_modal = 'SetAccountCurrencyModal';
const header_acc_actions = 'HeaderAccountActionsDTraderV2';
const real_signup_banner = 'RealSignupBannerDTraderV2';

jest.mock('App/Containers/RealAccountSignup', () => jest.fn(() => <div>{real_acc_signup}</div>));
jest.mock('App/Containers/SetAccountCurrencyModal', () => jest.fn(() => <div>{set_acc_currency_modal}</div>));
jest.mock('App/Components/Layout/Header/dtrader-v2/header-account-actions-dtrader-v2', () =>
    jest.fn(() => <div>{header_acc_actions}</div>)
);
jest.mock('App/Components/Layout/Header/dtrader-v2/real-signup-banner-dtrader-v2', () =>
    jest.fn(({ openRealAccount }) => <button onClick={openRealAccount}>{real_signup_banner}</button>)
);
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({
        pathname: '/dtrader',
    })),
}));

describe('DTraderV2Header', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            ui: {
                ...mockStore({}).ui,
                is_real_acc_signup_on: false,
            },
            client: {
                ...mockStore({}).client,
                has_any_real_account: true,
                is_eu: true,
                is_landing_company_loaded: false,
            },
        };
    });

    const mockDTraderV2Header = () => (
        <StoreProvider store={default_mocked_store}>
            <DTraderV2Header />
        </StoreProvider>
    );

    it('should render the component', () => {
        render(mockDTraderV2Header());

        expect(screen.getByText(header_acc_actions)).toBeInTheDocument();
        expect(screen.getByText(set_acc_currency_modal)).toBeInTheDocument();
        expect(screen.queryByText(real_acc_signup)).not.toBeInTheDocument();
        expect(screen.queryByText(real_signup_banner)).not.toBeInTheDocument();
    });

    it('should render RealAccountSignup component if is_real_acc_signup_on === true', () => {
        default_mocked_store.ui.is_real_acc_signup_on = true;
        render(mockDTraderV2Header());

        expect(screen.getByText(real_acc_signup)).toBeInTheDocument();
    });

    it('should render RealSignupBannerDTraderV2 component if has_any_real_account === false and it is is_trading_page and is_landing_company_loaded == true', () => {
        default_mocked_store.client.has_any_real_account = false;
        default_mocked_store.client.is_landing_company_loaded = true;
        render(mockDTraderV2Header());

        expect(screen.getByText(real_signup_banner)).toBeInTheDocument();
    });

    it('should call selectRegion with "EU" if user clicks on Banner and is_eu === true', () => {
        default_mocked_store.client.has_any_real_account = false;
        default_mocked_store.client.is_landing_company_loaded = true;
        render(mockDTraderV2Header());

        userEvent.click(screen.getByText(real_signup_banner));

        expect(default_mocked_store.traders_hub.selectRegion).toBeCalledWith('EU');
    });

    it('should call selectRegion with "Non-EU" if user clicks on Banner and is_eu === false', () => {
        default_mocked_store.client.has_any_real_account = false;
        default_mocked_store.client.is_landing_company_loaded = true;
        default_mocked_store.client.is_eu = false;
        render(mockDTraderV2Header());

        userEvent.click(screen.getByText(real_signup_banner));

        expect(default_mocked_store.traders_hub.selectRegion).toBeCalledWith('Non-EU');
    });

    it('should call setShouldShowCooldownModal if user clicks on Banner and real_account_creation_unlock_date is truthy', () => {
        default_mocked_store.client.has_any_real_account = false;
        default_mocked_store.client.is_landing_company_loaded = true;
        default_mocked_store.client.real_account_creation_unlock_date = 'unlock';
        render(mockDTraderV2Header());

        userEvent.click(screen.getByText(real_signup_banner));

        expect(default_mocked_store.ui.setShouldShowCooldownModal).toBeCalled();
    });
});
