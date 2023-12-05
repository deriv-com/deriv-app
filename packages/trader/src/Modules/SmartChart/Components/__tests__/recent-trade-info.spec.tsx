import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import RecentTradeInfo from '../recent-trade-info';
import { TStores } from '@deriv/stores/types';

describe('<RecentTradeInfo />', () => {
    const store_config = mockStore({});
    const renderComponent = ({ mocked_store_props = store_config }) =>
        render(
            <StoreProvider store={mocked_store_props}>
                <RecentTradeInfo />
            </StoreProvider>
        );
    let mocked_store_props: TStores;

    beforeEach(() => {
        mocked_store_props = mockStore({
            contract_trade: {
                filtered_contracts: [
                    {
                        contract_info: {
                            contract_type: 'DIGITMATCH',
                            is_expired: 0,
                            is_settleable: 0,
                            status: 'open',
                            tick_count: 7,
                            tick_stream: [
                                {
                                    epoch: 1700203489,
                                    tick: 2361.33,
                                    tick_display_value: '2361.33',
                                },
                                {
                                    epoch: 1700203490,
                                    tick: 2361.3,
                                    tick_display_value: '2361.30',
                                },
                                {
                                    epoch: 1700203491,
                                    tick: 2362.1,
                                    tick_display_value: '2362.10',
                                },
                                {
                                    epoch: 1700203492,
                                    tick: 2361.69,
                                    tick_display_value: '2361.69',
                                },
                            ],
                        },
                    },
                ],
                granularity: 0,
                markers_array: [
                    {
                        contract_info: {
                            contract_type: 'DIGITMATCH',
                            is_expired: 0,
                            is_settleable: 0,
                            status: 'open',
                            tick_count: 5,
                            tick_stream: [
                                {
                                    epoch: 1700203489,
                                    tick: 2361.33,
                                    tick_display_value: '2361.33',
                                },
                                {
                                    epoch: 1700203490,
                                    tick: 2361.3,
                                    tick_display_value: '2361.30',
                                },
                                {
                                    epoch: 1700203491,
                                    tick: 2362.1,
                                    tick_display_value: '2362.10',
                                },
                                {
                                    epoch: 1700203492,
                                    tick: 2361.69,
                                    tick_display_value: '2361.69',
                                },
                                {
                                    epoch: 1700203492,
                                    tick: 2361.69,
                                    tick_display_value: '2361.69',
                                },
                            ],
                        },
                    },
                ],
            },
        });
    });

    it('Should render empty container if contract type is ACCU', () => {
        mocked_store_props.contract_trade.filtered_contracts[0].contract_info.contract_type = 'ACCU';
        const { container } = renderComponent({ mocked_store_props });
        expect(container).toBeEmptyDOMElement();
    });
    it('Should render empty container if granularity is more than 0', () => {
        mocked_store_props.contract_trade.granularity = 60;
        const { container } = renderComponent({ mocked_store_props });
        expect(container).toBeEmptyDOMElement();
    });
    it('Should render empty container after contract is ended', () => {
        mocked_store_props.contract_trade.filtered_contracts[0].contract_info.status = 'won';
        const { container } = renderComponent({ mocked_store_props });
        expect(container).toBeEmptyDOMElement();
    });
    it('Should render "Tick 4/7" contract type is digit contract', () => {
        renderComponent({ mocked_store_props });
        expect(screen.getByText('Tick 4/7')).toBeInTheDocument();
    });
});
