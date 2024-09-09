import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import AccumulatorsInformation from '../accumulators-information';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';

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

    it('should not render if there is an API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            ACCU: {
                has_error: true,
            },
        };
        const { container } = mockAccumulatorsInformation();

        expect(container).toBeEmptyDOMElement();
    });

    it('should render loader if maximum_payout is falsy but there is no API error', () => {
        default_mock_store.modules.trade.maximum_payout = 0;
        mockAccumulatorsInformation();

        expect(screen.getByText('Max. payout')).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText('4,000.00 USD')).not.toBeInTheDocument();
    });

    it('should render description that is provided', () => {
        mockAccumulatorsInformation();

        expect(screen.getByText('Max. payout')).toBeInTheDocument();
        expect(screen.getByText('4,000.00 USD')).toBeInTheDocument();
    });
});
