import React from 'react';
import { Jurisdiction } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import JurisdictionCard from '../jurisdiction-card';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';

describe('JurisdictionCard', () => {
    type TMockProps = {
        account_status: {
            p2p_poa_required: 0 | 1;
            authentication: {
                document: {
                    status: 'none' | 'pending' | 'expired' | 'verified' | 'rejected';
                };
                identity: {
                    services: {
                        idv: {
                            status: 'none' | 'pending' | 'expired' | 'verified' | 'rejected';
                        };
                        onfido: {
                            status: 'none' | 'pending' | 'expired' | 'verified' | 'rejected';
                        };
                        manual: {
                            status: 'none' | 'pending' | 'expired' | 'verified' | 'rejected';
                        };
                    };
                };
                needs_verification: string[];
            };
            currency_config: {
                [k: string]: { is_deposit_suspended?: 0 | 1; is_withdrawal_suspended?: 0 | 1 };
            };
            p2p_status: 'none' | 'active' | 'temp_ban' | 'perm_ban';
            prompt_client_to_authenticate: 0 | 1;
            risk_classification: string;
            status: string[];
        };
        swapfree_available_accounts: TTradingPlatformAvailableAccount[];
        account_type: 'financial' | 'synthetic';
        disabled: boolean;
        is_non_idv_design: boolean;
        toggleDynamicLeverage: React.MouseEventHandler<HTMLSpanElement>;
        jurisdiction_selected_shortcode: string;
        setJurisdictionSelectedShortcode: jest.Mock;
        type_of_card: 'svg' | 'bvi' | 'labuan' | 'maltainvest' | 'vanuatu';
    };

    let mock_props: TMockProps;
    beforeEach(() => {
        mock_props = {
            account_status: {
                p2p_poa_required: 0,
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
            account_type: 'financial',
            disabled: false,
            is_non_idv_design: false,
            toggleDynamicLeverage: jest.fn(),
            jurisdiction_selected_shortcode: '',
            setJurisdictionSelectedShortcode: jest.fn(),
            swapfree_available_accounts: [],
            type_of_card: Jurisdiction.SVG,
        };
    });

    it('should render JurisdictionCard with svg card', () => {
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(
            screen.getByText('Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs')
        ).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.2 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with vanuatu card', () => {
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(
            screen.getByText('Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs')
        ).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.2 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about required verifications.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu Financial Services Commission')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with maltainvest card', () => {
        mock_props.type_of_card = Jurisdiction.MALTA_INVEST;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('Malta')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('140+')).toBeInTheDocument();
        expect(
            screen.getByText('Forex, stocks, stock indices, commodities, cryptocurrencies and synthetic indices.')
        ).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:30')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about required verifications.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(
            screen.getByText('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionCard with bvi card', () => {
        mock_props.type_of_card = Jurisdiction.BVI;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('British Virgin Islands')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(
            screen.getByText('Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs')
        ).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.2 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about required verifications.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(
            screen.getByText('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionCard with labuan card', () => {
        mock_props.type_of_card = Jurisdiction.LABUAN;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('Straight-through processing')).toBeInTheDocument();
        expect(screen.getByText('Labuan')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('80+')).toBeInTheDocument();
        expect(screen.getByText('Forex (standard/exotic) and cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:100')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about required verifications.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Labuan Financial Services Authority (licence no. MB/18/0024)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with synthetic account_type', () => {
        mock_props.account_type = 'synthetic';
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('210+')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Forex (standard), stock indices, commodities, cryptocurrencies, stocks, ETFs, synthetic indices, basket indices and derived FX'
            )
        ).toBeInTheDocument();
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
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
    });

    it('should render JurisdictionCard on the back', () => {
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('We need you to submit these in order to get this account:')).toBeInTheDocument();
        expect(screen.getByText('Verification in review.')).toBeInTheDocument();
        expect(screen.getByText('Verification failed. Resubmit your details.')).toBeInTheDocument();
        expect(screen.getByText('Verification successful.')).toBeInTheDocument();
    });

    it('should click on JurisdictionCard and render setJurisdictionSelectedShortCode function', () => {
        render(<JurisdictionCard {...mock_props} />);
        const jurisdiction_card = screen.getByTestId('dt_jurisdiction_card');
        jurisdiction_card.click();
        expect(mock_props.setJurisdictionSelectedShortcode).toHaveBeenCalledWith('svg');
    });

    it('should click on Learn More and include cfd-card-flipped into classnames', () => {
        mock_props.type_of_card = Jurisdiction.BVI;
        render(<JurisdictionCard {...mock_props} />);
        const learn_more = screen.getByText('Learn more');
        learn_more.click();
        expect(screen.getByTestId('dt_jurisdiction_card')).toHaveClass('cfd-card-flipped');
    });
});
