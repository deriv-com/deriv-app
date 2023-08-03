import React from 'react';
import CFDsListing from '../index';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('Components/containers/listing-container', () =>
    jest.fn(({ children }) => <div data-testid='listing-container'>{children}</div>)
);

describe('CFDsListing', () => {
    const mock = mockStore({
        traders_hub: {
            available_dxtrade_accounts: [],
            available_derivez_accounts: [],
            combined_cfd_mt5_accounts: [],
            selected_region: 'NON-EU',
            has_any_real_account: true,
            startTrade: jest.fn(),
            is_real: true,
            getExistingAccounts: jest.fn(),
            getAccount: jest.fn(),
            toggleAccountTypeModalVisibility: jest.fn(),
            can_get_more_cfd_mt5_accounts: true,
            selected_account_type: 'cfd',
            is_eu_user: false,
            is_demo_low_risk: true,
            no_MF_account: true,
            toggleAccountTransferModal: jest.fn(),
            is_demo: false,
            openFailedVerificationModal: jest.fn(),
            showTopUpModal: jest.fn(),
            no_CR_account: false,
            setSelectedAccount: jest.fn(),
            CFDs_restricted_countries: false,
            financial_restricted_countries: false,
        },
        client: {
            is_landing_company_loaded: true,
            real_account_creation_unlock_date: '2022-02-02',
            account_status: {
                status: [],
            },
        },
        modules: {
            cfd: {
                toggleCompareAccountsModal: jest.fn(),
                setAccountType: jest.fn(),
            },
        },
        common: {
            setAppstorePlatform: jest.fn(),
        },
        ui: {
            openDerivRealAccountNeededModal: jest.fn(),
            setShouldShowCooldownModal: jest.fn(),
        },
    });

    it('should render the component', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDsListing />, { wrapper });
        expect(screen.getByTestId('listing-container')).toBeInTheDocument();
    });
});
