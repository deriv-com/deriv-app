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

    it('should not render component, if has_cancellation === false', () => {
        default_mock_store.modules.trade.has_cancellation = false;
        const { container } = mockMultipliersDealCancellationInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('should not render component, if proposal_info is empty', () => {
        default_mock_store.modules.trade.proposal_info = {};
        const { container } = mockMultipliersDealCancellationInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('should render component', () => {
        mockMultipliersDealCancellationInfo();

        expect(screen.getByText('Deal cancellation fee')).toBeInTheDocument();
        expect(screen.getByText(/4.00 USD/)).toBeInTheDocument();
    });
});
