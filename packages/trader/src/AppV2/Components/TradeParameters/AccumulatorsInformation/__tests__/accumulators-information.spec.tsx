import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import AccumulatorsInformation from '../accumulators-information';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';

const payout_text = 'Max. payout';
const payout_value = '4,000.00 USD';

describe('AccumulatorsInformation', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        currency: 'USD',
                        maximum_payout: 4000,
                        is_market_closed: false,
                    },
                },
            }))
    );

    const mockAccumulatorsInformation = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <AccumulatorsInformation />
                </ModulesProvider>
            </TraderProviders>
        );

    it('does not render if there is an API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            ACCU: {
                has_error: true,
            },
        };
        const { container } = mockAccumulatorsInformation();

        expect(container).toBeEmptyDOMElement();
    });

    it('renders loader if maximum_payout is falsy but there is no API error', () => {
        default_mock_store.modules.trade.maximum_payout = 0;
        mockAccumulatorsInformation();

        expect(screen.getByText(payout_text)).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText(payout_value)).not.toBeInTheDocument();
    });

    it('renders description that is provided', () => {
        mockAccumulatorsInformation();

        expect(screen.getByText(payout_text)).toBeInTheDocument();
        expect(screen.getByText(payout_value)).toBeInTheDocument();
        expect(screen.getByText(payout_text)).not.toHaveClass('trade-params__text--disabled');
    });

    it('applies specific className if is_market_closed === true', () => {
        default_mock_store.modules.trade.is_market_closed = true;
        mockAccumulatorsInformation();

        expect(screen.getByText(payout_text)).toHaveClass('trade-params__text--disabled');
    });
});
