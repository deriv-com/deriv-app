import React from 'react';
import { render, screen } from '@testing-library/react';
import PayoutPerPointInfo from '../payout-per-point-info';
import TraderProviders from '../../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';

describe('<PayoutPerPointInfo />', () => {
    const mock_store = {
        modules: {
            trade: {
                contract_type: 'vanillalongcall',
                currency: 'USD',
                proposal_info: {
                    VANILLALONGCALL: {
                        obj_contract_basis: {
                            text: 'payout-per-point',
                            value: 123,
                        },
                    },
                },
            },
        },
    };
    const MockedPayoutPerPointInfo = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <PayoutPerPointInfo />
            </TraderProviders>
        );
    };

    it('displays the correct payout per point label, value, and currency', () => {
        render(MockedPayoutPerPointInfo(mockStore(mock_store)));
        expect(screen.getByText('123 USD')).toBeInTheDocument();
        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });
});
