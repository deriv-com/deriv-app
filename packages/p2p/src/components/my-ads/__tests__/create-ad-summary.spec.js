import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
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

const textMatcher = text => {
    return screen.getByText((content, node) => {
        const hasText = node => node.textContent === text;
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));

        return nodeHasText && childrenDontHaveText;
    });
};

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

        const el_dp2p_create_ad_summary_header_with_amount = textMatcher("You're creating an ad to buy 100.00 USD...");
        expect(el_dp2p_create_ad_summary_header_with_amount).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} type={'sell'} />);

        const el_dp2p_create_ad_summary_header_with_amount = textMatcher("You're creating an ad to sell 100.00 USD...");
        expect(el_dp2p_create_ad_summary_header_with_amount).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} price_rate={1} type={'buy'} />);

        const el_dp2p_create_ad_summary_header_with_amount = textMatcher(
            "You're creating an ad to buy 100.00 USD for 100.00 LOCAL_CURRENCY (1.00 LOCAL_CURRENCY/USD)"
        );
        expect(el_dp2p_create_ad_summary_header_with_amount).toBeInTheDocument();
    });

    it('Component should be rendered with proper header and amount depends on props', () => {
        render(<CreateAdSummary offer_amount={100} price_rate={1} type={'sell'} />);

        const el_dp2p_create_ad_summary_header_with_amount = textMatcher(
            "You're creating an ad to sell 100.00 USD for 100.00 LOCAL_CURRENCY (1.00 LOCAL_CURRENCY/USD)"
        );
        expect(el_dp2p_create_ad_summary_header_with_amount).toBeInTheDocument();
    });
});
