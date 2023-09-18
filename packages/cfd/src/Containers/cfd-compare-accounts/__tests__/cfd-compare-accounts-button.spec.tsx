import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import CFDCompareAccountsButton from '../cfd-compare-accounts-button';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('@deriv/components/src/components/cfd-compare-accounts-carousel/cfd-compare-accounts-carousel', () =>
    jest.fn(() => <div>CFD Carousel</div>)
);

const cfd_store_mock = {
    current_list: {},
    setAccountType: jest.fn(),
    setJurisdictionSelectedShortcode: jest.fn(),
    enableCFDPasswordModal: jest.fn(),
    toggleCFDVerificationModal: jest.fn(),
};

describe('<CFDCompareAccountsButton />', () => {
    const mocked_props = {
        trading_platforms: {
            platform: 'mt5',
            shortcode: 'svg',
            market_type: 'gaming',
        },
        is_demo: false,
    };

    it('should render the component with correct mocked_props', () => {
        const mock = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                current_currency_type: 'crypto',
                is_logged_in: true,
            },
            modules: { cfd: cfd_store_mock },
            traders_hub: {
                getAccount: jest.fn(),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsButton {...mocked_props} />, {
            wrapper,
        });

        const buttonElement = screen.getByRole('button');

        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('compare-cfd-account__button');
        expect(buttonElement).toHaveTextContent('Add');
        expect(buttonElement).toBeEnabled();
    });

    it('should open the account creation modal', async () => {
        jest.mock('@deriv/shared', () => ({
            getAuthenticationStatusInfo: jest.fn(() => ({
                poi_or_poa_not_submitted: false,
                poi_acknowledged_for_vanuatu_maltainvest: true,
                poi_acknowledged_for_bvi_labuan: true,
                poa_acknowledged: true,
                poa_pending: false,
            })),
        }));

        const mock = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                current_currency_type: 'crypto',
                is_logged_in: true,
                should_restrict_bvi_account_creation: false,
                should_restrict_vanuatu_account_creation: false,
            },
            modules: {
                cfd: {
                    ...cfd_store_mock,
                    current_list: {},
                },
            },
            traders_hub: {
                getAccount: jest.fn(),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <MemoryRouter>
                <CFDCompareAccountsButton {...mocked_props} />
            </MemoryRouter>,
            {
                wrapper,
            }
        );

        const buttonElement = screen.getByRole('button', { name: /Add/i });

        userEvent.click(buttonElement);
        await waitFor(() => {
            expect(cfd_store_mock.setAccountType).toHaveBeenCalledTimes(1);
            expect(mock.common.setAppstorePlatform).toHaveBeenCalledWith('mt5');
            expect(mock.modules.cfd.setJurisdictionSelectedShortcode).toHaveBeenCalled();
            expect(mock.modules.cfd.toggleCFDVerificationModal).toHaveBeenCalledTimes(0);
        });
    });

    it('should open account verification modal for unauthorized account', async () => {
        jest.mock('@deriv/shared', () => ({
            getAuthenticationStatusInfo: jest.fn(() => ({
                poi_or_poa_not_submitted: true,
                poi_acknowledged_for_vanuatu_maltainvest: false,
                poi_acknowledged_for_bvi_labuan: false,
                poa_acknowledged: false,
                poa_pending: true,
            })),
        }));

        const mock = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                current_currency_type: 'crypto',
                is_logged_in: true,
                should_restrict_bvi_account_creation: false,
                should_restrict_vanuatu_account_creation: false,
            },
            modules: {
                cfd: {
                    ...cfd_store_mock,
                    current_list: {},
                },
            },
            traders_hub: {
                getAccount: jest.fn(),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <MemoryRouter>
                <CFDCompareAccountsButton
                    {...mocked_props}
                    trading_platforms={{
                        platform: 'mt5',
                        shortcode: 'bvi',
                        market_type: 'financial',
                    }}
                />
            </MemoryRouter>,
            {
                wrapper,
            }
        );

        const buttonElement = screen.getByRole('button', { name: /Add/i });

        userEvent.click(buttonElement);
        await waitFor(() => {
            expect(mock.common.setAppstorePlatform).toHaveBeenCalledWith('mt5');
            expect(mock.modules.cfd.setJurisdictionSelectedShortcode).toHaveBeenCalled();
            expect(mock.modules.cfd.toggleCFDVerificationModal).toHaveBeenCalledTimes(1);
        });
    });

    it('should open account creation modal for dxtrade account', async () => {
        jest.mock('@deriv/shared', () => ({
            getAuthenticationStatusInfo: jest.fn(() => ({
                poi_or_poa_not_submitted: true,
                poi_acknowledged_for_vanuatu_maltainvest: false,
                poi_acknowledged_for_bvi_labuan: false,
                poa_acknowledged: false,
                poa_pending: true,
            })),
        }));

        const mock = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                current_currency_type: 'crypto',
                is_logged_in: true,
                should_restrict_bvi_account_creation: false,
                should_restrict_vanuatu_account_creation: false,
            },
            modules: {
                cfd: {
                    ...cfd_store_mock,
                    current_list: {},
                },
            },
            traders_hub: {
                getAccount: jest.fn(),
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <MemoryRouter>
                <CFDCompareAccountsButton
                    {...mocked_props}
                    trading_platforms={{
                        platform: 'dxtrade',
                        shortcode: 'bvi',
                        market_type: 'financial',
                    }}
                />
            </MemoryRouter>,
            {
                wrapper,
            }
        );

        const buttonElement = screen.getByRole('button', { name: /Add/i });

        userEvent.click(buttonElement);
        await waitFor(() => {
            expect(mock.common.setAppstorePlatform).toHaveBeenCalledWith('dxtrade');
            expect(mock.traders_hub.getAccount).toHaveBeenCalled();
        });
    });

    it('should disable the button and display "Added" text when account is already added', () => {
        const mock = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                current_currency_type: 'crypto',
                is_logged_in: true,
            },
            modules: {
                cfd: {
                    current_list: {
                        'mt5.real.synthetic_svg@p01_ts03': {
                            landing_company_short: 'svg',
                            account_type: 'real',
                            market_type: 'synthetic',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(
            <MemoryRouter>
                <CFDCompareAccountsButton {...mocked_props} />
            </MemoryRouter>,
            {
                wrapper,
            }
        );

        const buttonElement = screen.getByRole('button');

        expect(buttonElement).toBeDisabled();
        expect(buttonElement).toHaveTextContent('Added');
    });
});
