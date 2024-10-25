import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDCompareAccountsDescription from '../cfd-compare-accounts-description';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<CFDCompareAccountsDescription />', () => {
    const mock = mockStore({
        traders_hub: {
            selected_region: 'Non-EU',
        },
    });
    const mocked_props = {
        trading_platforms: {
            market_type: 'gaming',
            shortcode: 'svg',
        },
        is_demo: false,
    };

    const assertContent = (
        leverageDescription: string,
        spread: string,
        spreadDescription: string,
        counterpartyCompanyDescription: string,
        jurisdictionDescription: string
    ) => {
        expect(screen.getByText(leverageDescription)).toBeInTheDocument();
        expect(screen.getByText(spread)).toBeInTheDocument();
        expect(screen.getByText(spreadDescription)).toBeInTheDocument();
        expect(screen.getByText(counterpartyCompanyDescription)).toBeInTheDocument();
        expect(screen.getByText(jurisdictionDescription)).toBeInTheDocument();
    };
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('should render CFDCompareAccountsDescription component on default props', () => {
        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
    });

    it('should render content for gaming market type with market type svg', () => {
        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.1 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC')).toBeInTheDocument();
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
    });

    it('should render content for gaming market type with vanuatu shortcode', () => {
        mocked_props.trading_platforms.shortcode = 'vanuatu';

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.1 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Deriv (V) Ltd')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
    });

    it('should render content for all market type with svg shortcode', () => {
        mocked_props.trading_platforms.market_type = 'all';

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.5 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC')).toBeInTheDocument();
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Financial Commission')).toBeInTheDocument();
        expect(screen.getByText('Regulator/External dispute resolution')).toBeInTheDocument();
    });

    it('should render content for financial market type with svg shortcode', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        mocked_props.trading_platforms.shortcode = 'svg';

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.2 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC')).toBeInTheDocument();
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Financial Commission')).toBeInTheDocument();
        expect(screen.getByText('Regulator/External dispute resolution')).toBeInTheDocument();
    });

    it('should render content for financial market type with vanuatu shortcode', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        mocked_props.trading_platforms.shortcode = 'vanuatu';

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.2 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Deriv (V) Ltd')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu Financial Services Commission')).toBeInTheDocument();
        expect(screen.getByText('Regulator/External dispute resolution')).toBeInTheDocument();
    });

    it('should render content for financial market type with labuan shortcode', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        mocked_props.trading_platforms.shortcode = 'labuan';

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.6 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:100')).toBeInTheDocument();
        expect(screen.getByText('Deriv (FX) Ltd')).toBeInTheDocument();
        expect(screen.getByText('Labuan')).toBeInTheDocument();
        expect(screen.getByText('Labuan Financial Services Authority')).toBeInTheDocument();
        expect(screen.getByText('(licence no. MB/18/0024)')).toBeInTheDocument();
        expect(screen.getByText('Regulator/External dispute resolution')).toBeInTheDocument();
    });

    it('should render content for financial market type with maltainvest shortcode ', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        mocked_props.trading_platforms.shortcode = 'maltainvest';

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        assertContent('Maximum leverage', '0.5 pips', 'Spreads from', 'Counterparty company', 'Jurisdiction');
        expect(screen.getByText('Up to 1:30')).toBeInTheDocument();
        expect(screen.getByText('Deriv Investments (Europe) Limited')).toBeInTheDocument();
        expect(screen.getByText('Malta')).toBeInTheDocument();
        expect(screen.getByText('Financial Commission')).toBeInTheDocument();
        expect(
            screen.getByText('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)')
        ).toBeInTheDocument();
    });

    it('should render demo content for gaming market type with market type svg', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        mocked_props.trading_platforms.shortcode = 'svg';
        mocked_props.is_demo = true;

        render(<CFDCompareAccountsDescription {...mocked_props} />, { wrapper });
        expect(screen.getByText('Up to 1:1000')).toBeInTheDocument();
        expect(screen.getByText('Maximum leverage')).toBeInTheDocument();
        expect(screen.getByText('0.2 pips')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
    });
});
