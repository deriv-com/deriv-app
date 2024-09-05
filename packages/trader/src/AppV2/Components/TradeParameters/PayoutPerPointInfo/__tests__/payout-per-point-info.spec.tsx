import React from 'react';
import { render, screen } from '@testing-library/react';
import PayoutPerPointInfo from '../payout-per-point-info';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';

describe('<PayoutPerPointInfo />', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        contract_type: 'vanillalongcall',
                        currency: 'USD',
                        proposal_info: {
                            VANILLALONGCALL: {
                                obj_contract_basis: {
                                    text: 'payout',
                                    value: 123,
                                },
                            },
                        },
                    },
                },
            }))
    );
    const mockedPayoutPerPointInfo = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <PayoutPerPointInfo />
            </TraderProviders>
        );

    it('should not render if there is an API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            VANILLALONGCALL: {
                has_error: true,
            },
        };
        const { container } = mockedPayoutPerPointInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('should render loader if payout is falsy but there is no API error', () => {
        default_mock_store.modules.trade.proposal_info = {};
        mockedPayoutPerPointInfo();

        expect(screen.getByText('Payout per point')).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText('123 USD')).not.toBeInTheDocument();
    });
    it('displays the correct label, value and currency', () => {
        mockedPayoutPerPointInfo();

        expect(screen.getByText('123 USD')).toBeInTheDocument();
        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });
});
