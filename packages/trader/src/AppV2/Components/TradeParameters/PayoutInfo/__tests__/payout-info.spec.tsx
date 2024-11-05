import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import PayoutInfo from '../payout-info';
import TraderProviders from '../../../../../trader-providers';

describe('<PayoutInfo />', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        trade_type_tab: 'ONETOUCH',
                        currency: 'USD',
                        proposal_info: {
                            ONETOUCH: {
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
    const mockedPayoutInfo = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <PayoutInfo />
            </TraderProviders>
        );

    it('should render loader if payout is falsy but there is no API error', () => {
        default_mock_store.modules.trade.proposal_info = {};
        mockedPayoutInfo();

        expect(screen.getByText('Payout')).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText('123.00 USD')).not.toBeInTheDocument();
    });
    it('displays the correct label, value and currency', () => {
        mockedPayoutInfo();

        expect(screen.getByText('123.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Payout')).toBeInTheDocument();
    });
});
