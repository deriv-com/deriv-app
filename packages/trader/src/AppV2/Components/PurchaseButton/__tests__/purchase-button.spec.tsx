import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTRACT_TYPES, mockContractInfo, TRADE_TYPES } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { ReportsStoreProvider } from '../../../../../../reports/src/Stores/useReportsStores';
import TraderProviders from '../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import PurchaseButton from '../purchase-button';

describe('PositionsContent', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({
            portfolio: {
                all_positions: [
                    {
                        contract_info: {
                            ...mockContractInfo({
                                contract_id: 243687440268,
                                contract_type: 'MULTUP',
                                multiplier: 100,
                            }),
                        },
                        details:
                            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                        display_name: '',
                        id: 243687440268,
                        indicative: 41.4,
                        purchase: 10,
                        reference: 486015531488,
                        type: 'MULTUP',
                        contract_update: {
                            stop_out: {
                                display_name: 'Stop out',
                                order_amount: -10,
                                order_date: 1716877413,
                                value: '774.81',
                            },
                        },
                        entry_spot: 782.35,
                        profit_loss: 31.4,
                        is_valid_to_sell: true,
                        status: 'profit',
                    },
                    {
                        contract_info: {
                            ...mockContractInfo({
                                contract_id: 243705193508,
                                contract_type: 'TURBOSLONG',
                            }),
                        },
                        details:
                            'You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.',
                        display_name: '',
                        id: 243705193508,
                        indicative: 4.4,
                        purchase: 10,
                        reference: 486048790368,
                        type: 'TURBOSLONG',
                        barrier: 821.69,
                        entry_spot: 824.24,
                        profit_loss: -5.6,
                        is_valid_to_sell: true,
                        status: 'profit',
                    },
                    {
                        contract_info: {
                            ...mockContractInfo({
                                contract_id: 249545026128,
                                contract_type: 'ACCU',
                                is_settleable: 0,
                                is_sold: 0,
                                is_valid_to_cancel: 0,
                                is_valid_to_sell: 1,
                                growth_rate: 0.03,
                                entry_spot: 364.15,
                                entry_spot_display_value: '364.15',
                            }),
                        },
                        details:
                            'After the entry spot tick, your stake will grow continuously by 3% for every tick that the spot price remains within the ± 0.03797% from the previous spot price.',
                        display_name: 'Volatility 100 (1s) Index',
                        id: 249545026128,
                        indicative: 18.6,
                        purchase: 10,
                        type: 'ACCU',
                        profit_loss: 8.6,
                        is_valid_to_sell: true,
                        current_tick: 21,
                        status: 'profit',
                        entry_spot: 364.15,
                        high_barrier: 364.149,
                        low_barrier: 363.871,
                    },
                ],
            },
            modules: {
                trade: {
                    ...mockStore({}).modules.trade,
                    currency: 'USD',
                    contract_type: 'rise_fall',
                    is_purchase_enabled: true,
                    proposal_info: {
                        PUT: {
                            id: 1234,
                            has_error: false,
                            has_error_details: false,
                            message:
                                'Win payout if Volatility 100 (1s) Index is strictly lower than entry spot at 10 minutes after contract start time.',
                            obj_contract_basis: {
                                text: 'Payout',
                                value: 19.2,
                            },
                            payout: 19.2,
                            profit: '9.20',
                            returns: '92.00%',
                            stake: '10.00',
                            spot: 366.11,
                            barrier: '366.11',
                            growth_rate: 0.03,
                            spot_time: 1721206371,
                        },
                        CALL: {
                            id: 12345,
                            has_error: false,
                            has_error_details: false,
                            message:
                                'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 10 minutes after contract start time.',
                            obj_contract_basis: {
                                text: 'Payout',
                                value: 19.26,
                            },
                            payout: 19.26,
                            profit: '9.26',
                            returns: '92.60%',
                            stake: '10.00',
                            spot: 366.11,
                            barrier: '366.11',
                            growth_rate: 0.03,
                            spot_time: 1721206371,
                        },
                    },
                    symbol: '1HZ100V',
                    trade_types: {
                        CALL: 'Rise',
                        PUT: 'Fall',
                    },
                },
            },
        });
    });

    const mockPurchaseButton = () => {
        render(
            <TraderProviders store={default_mock_store}>
                <ReportsStoreProvider>
                    <ModulesProvider store={default_mock_store}>
                        <PurchaseButton />
                    </ModulesProvider>
                </ReportsStoreProvider>
            </TraderProviders>
        );
    };

    it('should render two buttons (for Rise and for Fall) with a proper content from proposal_info', () => {
        mockPurchaseButton();

        expect(screen.getAllByText('Payout')).toHaveLength(2);
        expect(screen.getByText(/19.26/)).toBeInTheDocument();
        expect(screen.getAllByText(/USD/i)).toHaveLength(2);
        expect(screen.getByText('Rise')).toBeInTheDocument();
        expect(screen.getByText('Fall')).toBeInTheDocument();
    });

    it('should disable the button if one of the prop is false (is_trade_enabled, is_proposal_empty, !info.id, is_purchase_enabled): button should have a specific attribute and if user clicks on it onPurchase will not be called', () => {
        default_mock_store.modules.trade.is_trade_enabled_v2 = false;
        mockPurchaseButton();

        const purchase_button = screen.getAllByRole('button')[0];
        expect(purchase_button).toBeDisabled();
        expect(default_mock_store.modules.trade.onPurchase).not.toBeCalled();

        userEvent.click(purchase_button);

        expect(default_mock_store.modules.trade.onPurchase).not.toBeCalled();
    });

    it('should call onPurchaseV2 function if user clicks on purchase button and it is not disabled', () => {
        mockPurchaseButton();
        const purchase_button = screen.getAllByRole('button')[0];

        expect(default_mock_store.modules.trade.onPurchaseV2).not.toBeCalled();
        userEvent.click(purchase_button);

        expect(default_mock_store.modules.trade.onPurchaseV2).toBeCalled();
    });

    it('should render only one button if trade_types have only one field and there are no trade type tabs', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.ACCUMULATOR;
        default_mock_store.modules.trade.trade_types = {
            [CONTRACT_TYPES.ACCUMULATOR]: 'Accumulator Up',
        };
        mockPurchaseButton();

        const purchase_button = screen.getByRole('button');
        expect(purchase_button).toBeInTheDocument();
        expect(purchase_button).toHaveClass('purchase-button--single');
    });

    it('should render only one button if trade_types have 2 fields but there are 2 trade type tabs and trade_type_tab value is set', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.HIGH_LOW;
        default_mock_store.modules.trade.trade_types = {
            [CONTRACT_TYPES.CALL]: 'Higher',
            [CONTRACT_TYPES.PUT]: 'Lower',
        };
        default_mock_store.modules.trade.trade_type_tab = CONTRACT_TYPES.CALL;
        mockPurchaseButton();

        const purchase_button = screen.getByRole('button');
        expect(purchase_button).toBeInTheDocument();
        expect(purchase_button).toHaveClass('purchase-button--single');
    });

    it('should render sell button for Accumulators contract if there is an open Accumulators contract; if user clicks on it - onClickSell should be called', () => {
        default_mock_store.modules.trade.has_open_accu_contract = true;
        default_mock_store.modules.trade.is_accumulator = true;
        mockPurchaseButton();

        const sell_button = screen.getByText('Close 19.32 USD');
        expect(sell_button).toBeInTheDocument();
        expect(default_mock_store.portfolio.onClickSell).not.toBeCalled();

        userEvent.click(sell_button);
        expect(default_mock_store.portfolio.onClickSell).toBeCalled();
    });
});
