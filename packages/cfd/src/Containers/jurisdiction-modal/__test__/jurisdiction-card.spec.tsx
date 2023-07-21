import React from 'react';
import { Jurisdiction } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import JurisdictionCard from '../jurisdiction-card';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('JurisdictionCard', () => {
    type TMockProps = {
        swapfree_available_accounts: TTradingPlatformAvailableAccount[];
        account_type: 'financial' | 'synthetic';
        disabled: boolean;
        is_non_idv_design: boolean;
        jurisdiction_selected_shortcode: string;
        setJurisdictionSelectedShortcode: jest.Mock;
        type_of_card: 'svg' | 'bvi' | 'labuan' | 'maltainvest' | 'vanuatu';
    };

    let mock_props: TMockProps;
    const store = mockStore({
        client: {
            account_status: {
                authentication: {
                    document: {
                        status: 'none',
                    },
                    identity: {
                        services: {
                            idv: {
                                status: 'none',
                            },
                            onfido: {
                                status: 'none',
                            },
                            manual: {
                                status: 'none',
                            },
                        },
                    },
                    needs_verification: [],
                },
                currency_config: {},
                p2p_status: 'none',
                prompt_client_to_authenticate: 0,
                risk_classification: '',
                status: [''],
            },
        },
    });
    beforeEach(() => {
        mock_props = {
            account_type: 'financial',
            disabled: false,
            is_non_idv_design: false,
            jurisdiction_selected_shortcode: '',
            setJurisdictionSelectedShortcode: jest.fn(),
            swapfree_available_accounts: [],
            type_of_card: Jurisdiction.SVG,
        };
    });

    it('should render JurisdictionCard with svg card', () => {
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with vanuatu card', () => {
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('90+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stock indices, Commodities and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu Financial Services Commission')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with maltainvest card', () => {
        mock_props.type_of_card = Jurisdiction.MALTA_INVEST;
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('Malta')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('140+')).toBeInTheDocument();
        expect(
            screen.getByText('Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')
        ).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:30')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(
            screen.getByText('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionCard with bvi card', () => {
        mock_props.type_of_card = Jurisdiction.BVI;
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('British Virgin Islands')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(
            screen.getByText('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionCard with labuan card', () => {
        mock_props.type_of_card = Jurisdiction.LABUAN;
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('Straight-through processing')).toBeInTheDocument();
        expect(screen.getByText('Labuan')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('80+')).toBeInTheDocument();
        expect(screen.getByText('Forex and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:100')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Labuan Financial Services Authority (licence no. MB/18/0024)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with synthetic account_type', () => {
        mock_props.account_type = 'synthetic';
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('40+')).toBeInTheDocument();
        expect(screen.getByText('Synthetics, Baskets and Derived FX')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with disabled to be true', () => {
        mock_props.disabled = true;
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
    });

    it('should render JurisdictionCard on the back', () => {
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        expect(screen.getByText('We need you to submit these in order to get this account:')).toBeInTheDocument();
        expect(screen.getByText('Your document is pending for verification.')).toBeInTheDocument();
        expect(screen.getByText('Verification failed. Resubmit during account creation.')).toBeInTheDocument();
        expect(screen.getByText('Your document is verified.')).toBeInTheDocument();
    });

    it('should click on JurisdictionCard and render setJurisdictionSelectedShortCode function', () => {
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        const jurisdiction_card = screen.getByTestId('dt_jurisdiction_card');
        jurisdiction_card.click();
        expect(mock_props.setJurisdictionSelectedShortcode).toHaveBeenCalledWith('svg');
    });

    it('should click on Learn More and include cfd-card-flipped into classnames', () => {
        mock_props.type_of_card = Jurisdiction.BVI;
        render(
            <StoreProvider store={store}>
                <JurisdictionCard {...mock_props} />
            </StoreProvider>
        );
        const learn_more = screen.getByText('Learn more');
        learn_more.click();
        expect(screen.getByTestId('dt_jurisdiction_card')).toHaveClass('cfd-card-flipped');
    });
});
