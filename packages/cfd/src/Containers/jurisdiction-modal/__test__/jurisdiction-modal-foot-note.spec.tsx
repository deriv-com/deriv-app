import React from 'react';
import JurisdictionModalFootNote from '../jurisdiction-modal-foot-note';
import { render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionModalFootNote', () => {
    const mock_store = {
        common: {},
        client: {},
        ui: {},
    };
    const mock_context = new RootStore(mock_store);
    const mock_props = {
        account_status: {
            authentication: {
                document: {
                    status: 'none' as const,
                },
                needs_verification: [],
            },
            currency_config: {},
            p2p_status: 'none' as const,
            prompt_client_to_authenticate: 0 as const,
            risk_classification: '',
            status: [''],
        },
        account_type: '',
        context: mock_context,
        card_classname: '',
        jurisdiction_selected_shortcode: Jurisdiction.SVG,
        should_restrict_bvi_account_creation: false,
        should_restrict_vanuatu_account_creation: false,
    };
    it('should render JurisdictionModalFootNote', () => {
        render(<JurisdictionModalFootNote {...mock_props} />);
        expect(screen.getByTestId('dt-jurisdiction-footnote')).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with className', () => {
        render(<JurisdictionModalFootNote {...mock_props} card_classname='mock_jurisdiction' />);
        const container = screen.getByTestId('dt-jurisdiction-footnote');
        expect(container).toHaveClass('mock_jurisdiction__footnote');
    });

    it('should render JurisdictionModalFootNote and show svg message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.SVG}
                account_type='synthetic'
            />
        );
        expect(
            screen.getByText('Add your Deriv MT5 Derived account under Deriv (SVG) LLC (company no. 273 LLC 2020).')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote without bvi_restriction and show bvi message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.BVI}
                account_type='synthetic'
            />
        );
        expect(
            screen.getByText(
                'Add your Deriv MT5 Derived account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).'
            )
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with bvi_restriction and show bvi restriction message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.BVI}
                account_type='synthetic'
                should_restrict_bvi_account_creation
            />
        );
        expect(
            screen.getByText('To create this account first we need you to resubmit your proof of address.')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with bvi_restriction and poa is pending, then display resubmit poa message', () => {
        const mock_account_status = {
            authentication: {
                document: {
                    status: 'pending' as const,
                },
                needs_verification: [],
            },
            currency_config: {},
            p2p_status: 'none' as const,
            prompt_client_to_authenticate: 0 as const,
            risk_classification: '',
            status: [''],
        };
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                account_status={mock_account_status}
                jurisdiction_selected_shortcode={Jurisdiction.BVI}
                account_type='synthetic'
                should_restrict_bvi_account_creation
                card_classname='mock_jurisdiction'
            />
        );
        const poa_message = screen.getByText(
            'You can open this account once your submitted documents have been verified.'
        );
        expect(poa_message).toBeInTheDocument();
        expect(poa_message).toHaveClass('mock_jurisdiction__footnote--pending');
    });

    it('should render JurisdictionModalFootNote without vanuatu_restriction and show vanuatu message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.VANUATU}
                account_type='synthetic'
            />
        );
        expect(
            screen.getByText(
                'Add Your Deriv MT5 Derived account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.'
            )
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with vanuatu_restriction and show vanuatu restriction message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.VANUATU}
                account_type='synthetic'
                should_restrict_vanuatu_account_creation
            />
        );
        expect(
            screen.getByText('To create this account first we need you to resubmit your proof of address.')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote with vanuatu_restriction and poa is pending, then display resubmit poa message', () => {
        const mock_account_status = {
            authentication: {
                document: {
                    status: 'pending' as const,
                },
                needs_verification: [],
            },
            currency_config: {},
            p2p_status: 'none' as const,
            prompt_client_to_authenticate: 0 as const,
            risk_classification: '',
            status: [''],
        };
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                account_status={mock_account_status}
                jurisdiction_selected_shortcode={Jurisdiction.VANUATU}
                account_type='synthetic'
                should_restrict_vanuatu_account_creation
                card_classname='mock_jurisdiction'
            />
        );
        const poa_message = screen.getByText(
            'You can open this account once your submitted documents have been verified.'
        );
        expect(poa_message).toBeInTheDocument();
        expect(poa_message).toHaveClass('mock_jurisdiction__footnote--pending');
    });

    it('should render JurisdictionModalFootNote show labuan message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.LABUAN}
                account_type='synthetic'
            />
        );
        expect(
            screen.getByText(
                'Add your Deriv MT5 Derived STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (Licence no. MB/18/0024).'
            )
        ).toBeInTheDocument();
    });

    it('should render JurisdictionModalFootNote show maltainvest message', () => {
        render(
            <JurisdictionModalFootNote
                {...mock_props}
                jurisdiction_selected_shortcode={Jurisdiction.MALTA_INVEST}
                account_type='synthetic'
            />
        );
        expect(
            screen.getByText(
                'Add your Deriv MT5 CFDs account under Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
            )
        ).toBeInTheDocument();
    });

    it('should not render JurisdictionModalFootNote when jurisdiction_shortcode is empty', () => {
        render(<JurisdictionModalFootNote {...mock_props} jurisdiction_selected_shortcode='' />);
        expect(screen.queryByTestId('dt-jurisdiction-footnote')).not.toBeInTheDocument();
    });
});
