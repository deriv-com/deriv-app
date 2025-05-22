import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import MultipliersDealCancellationInfo from '../multipliers-deal-cancellation-info';

describe('MultipliersDealCancellationInfo', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        currency: 'USD',
                        has_cancellation: true,
                        proposal_info: { MULTUP: { cancellation: { ask_price: 4 } } },
                    },
                },
            }))
    );

    afterEach(() => jest.clearAllMocks());

    const mockMultipliersDealCancellationInfo = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <MultipliersDealCancellationInfo />
                </ModulesProvider>
            </TraderProviders>
        );

    it('does not render if there is an API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            MULTUP: {
                has_error: true,
            },
        };
        const { container } = mockMultipliersDealCancellationInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('renders skeleton, if proposal_info is empty', () => {
        default_mock_store.modules.trade.proposal_info = {};
        mockMultipliersDealCancellationInfo();

        expect(screen.getAllByTestId('dt_skeleton')).toHaveLength(2);
    });

    it('renders component with title and value', () => {
        mockMultipliersDealCancellationInfo();

        const upTitle = screen.getByText('DC fee (Up)');
        expect(upTitle).toBeInTheDocument();
        expect(upTitle).not.toHaveClass('trade-params__text--disabled');
        expect(screen.getByText(/4.00 USD/)).toBeInTheDocument();
    });

    it('applies specific className if is_market_closed === true', () => {
        default_mock_store.modules.trade.is_market_closed = true;
        mockMultipliersDealCancellationInfo();

        expect(screen.getByText('DC fee (Up)')).toHaveClass('trade-params__text--disabled');
    });
});
