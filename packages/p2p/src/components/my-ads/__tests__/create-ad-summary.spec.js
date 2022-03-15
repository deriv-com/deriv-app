import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import CreateAdSummary from '../create-ad-summary.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

const mocked_general_store = {
    client: {
        currency: 'USD',
        local_currency_config: {
            currency: 'LOCAL_CURRENCY',
        },
    },
};

beforeEach(() => {
    useStores.mockImplementation(() => ({
        general_store: mocked_general_store,
    }));
});

describe('<CreateAdSummary />', () => {
    it('Component should be rendered with proper header depends on order type', () => {
        render(<CreateAdSummary type={'sell'} />);

        const el_dp2p_create_ad_summary_header = screen.getByText("You're creating an ad to sell...");
        expect(el_dp2p_create_ad_summary_header).toBeInTheDocument();
    });

    it('Component should be rendered with proper header depends on order type', () => {
        render(<CreateAdSummary type={'buy'} />);

        const el_dp2p_create_ad_summary_header = screen.getByText("You're creating an ad to buy...");
        expect(el_dp2p_create_ad_summary_header).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} type={'buy'} />);

        const el_dp2p_create_ad_summary_header = screen.getByText("You're creating an ad to buy ...");
        const el_dp2p_create_ad_summary_amount = screen.getByText('100.00 USD');

        expect(el_dp2p_create_ad_summary_header).toBeInTheDocument();
        expect(el_dp2p_create_ad_summary_amount).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} type={'sell'} />);

        const el_dp2p_create_ad_summary_header = screen.getByText("You're creating an ad to sell ...");
        const el_dp2p_create_ad_summary_amount = screen.getByText('100.00 USD');

        expect(el_dp2p_create_ad_summary_header).toBeInTheDocument();
        expect(el_dp2p_create_ad_summary_amount).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} price_rate={1} type={'buy'} />);

        const el_dp2p_create_ad_summary_header = screen.getByText(
            "You're creating an ad to buy for (1.00 LOCAL_CURRENCY/USD)"
        );
        const el_dp2p_create_ad_summary_amount = screen.getByText('100.00 USD');
        const el_dp2p_create_ad_summary_local_currency_amount = screen.getByText('100.00 LOCAL_CURRENCY');

        expect(el_dp2p_create_ad_summary_header).toBeInTheDocument();
        expect(el_dp2p_create_ad_summary_amount).toBeInTheDocument();
        expect(el_dp2p_create_ad_summary_local_currency_amount).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} price_rate={1} type={'sell'} />);

        const el_dp2p_create_ad_summary_header = screen.getByText(
            "You're creating an ad to sell for (1.00 LOCAL_CURRENCY/USD)"
        );
        const el_dp2p_create_ad_summary_amount = screen.getByText('100.00 USD');
        const el_dp2p_create_ad_summary_local_currency_amount = screen.getByText('100.00 LOCAL_CURRENCY');

        expect(el_dp2p_create_ad_summary_header).toBeInTheDocument();
        expect(el_dp2p_create_ad_summary_amount).toBeInTheDocument();
        expect(el_dp2p_create_ad_summary_local_currency_amount).toBeInTheDocument();
    });
});
