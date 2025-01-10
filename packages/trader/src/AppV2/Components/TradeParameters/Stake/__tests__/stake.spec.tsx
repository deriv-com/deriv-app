import React from 'react';

import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import ModulesProvider from 'Stores/Providers/modules-providers';

import TraderProviders from '../../../../../trader-providers';
import Stake from '../stake';

const stake_param_label = 'Stake';
const input_placeholder = 'Amount';
const save_button_label = 'Save';

jest.mock('AppV2/Hooks/useContractsForCompany', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        available_contract_types: {
            vanillalongcall: {
                title: 'Call/Put',
                trade_types: ['VANILLALONGCALL'],
                basis: ['stake'],
                components: ['duration', 'strike', 'amount', 'trade_type_tabs'],
                barrier_count: 1,
                config: {
                    barrier_category: 'euro_non_atm',
                    default_stake: 10,
                },
            },
        },
    })),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(),
        authorized: {
            send: jest.fn(),
        },
    },
}));
jest.mock('AppV2/Hooks/useDtraderQuery', () => ({
    ...jest.requireActual('AppV2/Hooks/useDtraderQuery'),
    useDtraderQuery: jest.fn(() => ({
        data: {
            proposal: {},
            error: {},
        },
    })),
}));

describe('Stake', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        amount: 10,
                        basis: 'stake',
                        contract_type: TRADE_TYPES.RISE_FALL,
                        currency: 'USD',
                        proposal_info: {
                            [CONTRACT_TYPES.CALL]: {
                                has_error: false,
                                message:
                                    'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 5 minutes after contract start time.',
                                payout: 19.55,
                            },
                            [CONTRACT_TYPES.PUT]: {
                                has_error: false,
                                message:
                                    'Win payout if Volatility 100 (1s) Index is strictly lower than entry spot at 5 minutes after contract start time.',
                                payout: 19.51,
                            },
                        },
                        trade_types: {
                            [CONTRACT_TYPES.CALL]: 'Higher',
                            [CONTRACT_TYPES.PUT]: 'Lower',
                        },
                        trade_type_tab: 'CALL',
                        validation_params: {
                            [CONTRACT_TYPES.CALL]: { payout: { max: '50000.00' } },
                            [CONTRACT_TYPES.PUT]: { payout: { max: '50000.00' } },
                        },
                    },
                },
            }))
    );

    const MockedStake = ({ store = default_mock_store }: { store?: ReturnType<typeof mockStore> }) => (
        <TraderProviders store={store}>
            <ModulesProvider store={store}>
                <Stake is_minimized />
            </ModulesProvider>
        </TraderProviders>
    );

    it('renders trade param with "Stake" label and input with a value equal to the current stake amount value', () => {
        render(<MockedStake />);
        const { amount, currency } = default_mock_store.modules.trade;
        expect(screen.getByText(stake_param_label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue(`${amount} ${currency}`);
    });

    it('opens ActionSheet with input, details and "Save" button if user clicks on "Stake" trade param', async () => {
        render(<MockedStake />);

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        await userEvent.click(screen.getByText(stake_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(input_placeholder)).toBeInTheDocument();
        expect(screen.getAllByText(/payout/i)).toHaveLength(2);
        expect(screen.getByRole('button', { name: save_button_label })).toBeInTheDocument();
    });

    it('calls onChange if user clicks on Save', async () => {
        render(<MockedStake />);

        await userEvent.click(screen.getByText(stake_param_label));
        await userEvent.type(screen.getByPlaceholderText(input_placeholder), '10');
        await userEvent.click(screen.getByRole('button', { name: save_button_label }));

        expect(default_mock_store.modules.trade.onChange).toHaveBeenCalledWith({
            target: { name: 'amount', value: 10 },
        });
    });

    it('does not render payout details for Accumulators', async () => {
        default_mock_store.modules.trade.is_accumulator = true;
        render(<MockedStake />);
        await userEvent.click(screen.getByText(stake_param_label));
        expect(screen.queryByText(/payout/i)).not.toBeInTheDocument();
    });

    it('does not render payout details for Turbos', async () => {
        default_mock_store.modules.trade.is_turbos = true;
        render(<MockedStake />);
        await userEvent.click(screen.getByText(stake_param_label));
        expect(screen.queryByText(/payout/i)).not.toBeInTheDocument();
    });

    it('does not render payout details for Vanillas', async () => {
        default_mock_store.modules.trade.is_vanilla = true;
        render(<MockedStake />);
        await userEvent.click(screen.getByText(stake_param_label));
        expect(screen.queryByText(/payout/i)).not.toBeInTheDocument();
    });

    it('renders Stop out and Commission details instead of payout details for Multipliers', async () => {
        render(
            <MockedStake
                store={{
                    ...default_mock_store,
                    modules: {
                        ...default_mock_store.modules,
                        trade: {
                            ...default_mock_store.modules.trade,
                            commission: 0.36,
                            contract_type: TRADE_TYPES.MULTIPLIER,
                            is_multiplier: true,
                            proposal_info: {
                                [CONTRACT_TYPES.MULTIPLIER.UP]: {
                                    has_error: false,
                                    message:
                                        "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                                    payout: 0,
                                },
                                [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
                                    has_error: false,
                                    message:
                                        "If you select 'Down', your total profit/loss will be the percentage decrease in Volatility 100 (1s) Index, multiplied by 1000, minus commissions.",
                                    payout: 0,
                                },
                            },
                            stop_out: -10,
                            trade_types: {
                                [CONTRACT_TYPES.MULTIPLIER.UP]: 'Multiply Up',
                                [CONTRACT_TYPES.MULTIPLIER.DOWN]: 'Multiply Down',
                            },
                            validation_params: {
                                [CONTRACT_TYPES.MULTIPLIER.UP]: {
                                    stake: {
                                        max: '2000.00',
                                        min: '1.00',
                                    },
                                },
                                [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
                                    stake: {
                                        max: '2000.00',
                                        min: '1.00',
                                    },
                                },
                            },
                        },
                    },
                }}
            />
        );

        await userEvent.click(screen.getByText(stake_param_label));
        expect(screen.getByText('Acceptable range: 1.00 to 2,000.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Stop out')).toBeInTheDocument();
        expect(screen.getByText('Commission')).toBeInTheDocument();
    });

    it('shows error in case of a validation error if input is non-empty', async () => {
        const error_text = "Please enter a stake amount that's at least 0.35.";
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.HIGH_LOW;
        default_mock_store.modules.trade.trade_type_tab = 'CALL';
        default_mock_store.modules.trade.proposal_info = {
            CALL: { has_error: true, message: error_text, error_field: 'amount' },
        };

        (useDtraderQuery as jest.Mock).mockReturnValue({
            data: {
                error: { has_error: true, message: error_text, details: { error_field: 'amount' } },
                proposal: {},
            },
        });
        render(<MockedStake />);

        await userEvent.click(screen.getByText(stake_param_label));
        expect(screen.getByText(error_text)).toBeInTheDocument();
        expect(screen.getByText('- USD')).toBeInTheDocument();
    });

    it('disables trade param if is_market_closed == true', () => {
        default_mock_store.modules.trade.is_market_closed = true;
        render(<MockedStake />);

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
