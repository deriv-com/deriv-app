import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import PayoutInfo from '../payout-info';
import TraderProviders from '../../../../../trader-providers';

const label = 'Payout';

describe('<PayoutInfo />', () => {
    let default_mock_store: ReturnType<typeof mockStore>, default_mock_prop: React.ComponentProps<typeof PayoutInfo>;

    beforeEach(() => {
        default_mock_store = mockStore({
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
        });
        default_mock_prop = { is_disabled: false };
    });
    const mockedPayoutInfo = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <PayoutInfo {...default_mock_prop} />
            </TraderProviders>
        );

    it('does not render if there is an API error ', () => {
        default_mock_store.modules.trade.proposal_info = {
            ONETOUCH: {
                has_error: true,
            },
        };
        const { container } = mockedPayoutInfo();

        expect(container).toBeEmptyDOMElement();
    });

    it('renders loader if payout is falsy but there is no API error', () => {
        default_mock_store.modules.trade.proposal_info = {};
        mockedPayoutInfo();

        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText('123.00 USD')).not.toBeInTheDocument();
    });
    it('displays the correct label, value and currency', () => {
        mockedPayoutInfo();

        expect(screen.getByText('123.00 USD')).toBeInTheDocument();
        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByText(label)).not.toHaveClass('trade-params__text--disabled');
    });
    it('applies specific className if is_disabled === true', () => {
        default_mock_prop.is_disabled = true;
        mockedPayoutInfo();

        expect(screen.getByText(label)).toHaveClass('trade-params__text--disabled');
    });
});
