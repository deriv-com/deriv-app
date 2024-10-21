import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import Strike from '../strike';

const strike_trade_param_label = 'Strike price';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    WheelPicker: jest.fn(({ data, setSelectedValue }) => (
        <div>
            <p>WheelPicker</p>
            <ul>
                {data.map(({ value }: { value: string }) => (
                    <li key={value}>
                        <button onClick={() => setSelectedValue(value)}>{value}</button>
                    </li>
                ))}
            </ul>
        </div>
    )),
}));

jest.mock('lodash.debounce', () =>
    jest.fn(fn => {
        fn.cancel = () => null;
        return fn;
    })
);

describe('Strike', () => {
    let default_mock_store: ReturnType<typeof mockStore>, default_mock_prop: React.ComponentProps<typeof Strike>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    ...mockStore({}),
                    barrier_1: '+1.80',
                    barrier_choices: ['+1.80', '+1.00', '+0.00', '-1.00', '-1.80'],
                    contract_type: TRADE_TYPES.VANILLA.CALL,
                    currency: 'USD',
                    proposal_info: {
                        [CONTRACT_TYPES.VANILLA.CALL]: { obj_contract_basis: { value: '14.245555' } },
                    },
                },
            },
        });
        default_mock_prop = { is_minimized: true, is_disabled: false };
    });

    afterEach(() => jest.clearAllMocks());

    const mockStrike = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <Strike {...default_mock_prop} />
                </ModulesProvider>
            </TraderProviders>
        );
    it('renders Skeleton loader if strike (barrier_1) is falsy', () => {
        default_mock_store.modules.trade.barrier_1 = '';
        mockStrike();

        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText(strike_trade_param_label)).not.toBeInTheDocument();
    });

    it('renders trade param with "Strike price" label and input with value equal to current strike value (barrier_1)', () => {
        mockStrike();

        expect(screen.getByText(strike_trade_param_label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('+1.80');
    });

    it('opens ActionSheet with WheelPicker component, Payout per point information, "Save" button and text content with definition if user clicks on trade param', () => {
        mockStrike();

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(strike_trade_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.getByText('WheelPicker')).toBeInTheDocument();
        expect(screen.getByText('Payout per point:')).toBeInTheDocument();
        expect(screen.getByText(/14.245555/)).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('does not render Payout per point information if proposal_info is empty object', () => {
        default_mock_store.modules.trade.proposal_info = {};
        mockStrike();

        userEvent.click(screen.getByText(strike_trade_param_label));

        expect(screen.getByText('Payout per point:')).toBeInTheDocument();
        expect(screen.queryByText(/14.245555/)).not.toBeInTheDocument();
    });

    it('applies specific className if innerHeight is <= 640px', () => {
        const original_height = window.innerHeight;
        window.innerHeight = 640;
        mockStrike();

        userEvent.click(screen.getByText(strike_trade_param_label));

        expect(screen.getByTestId('dt_carousel')).toHaveClass('strike__carousel--small');
        window.innerHeight = original_height;
    });

    it('calls onChange function if user changes selected value', async () => {
        jest.useFakeTimers();
        mockStrike();

        const new_selected_value = default_mock_store.modules.trade.barrier_choices[1];
        userEvent.click(screen.getByText(strike_trade_param_label));
        userEvent.click(screen.getByText(new_selected_value));
        userEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            jest.advanceTimersByTime(200);
        });

        expect(default_mock_store.modules.trade.onChange).toBeCalled();
        jest.useRealTimers();
    });

    it('disables trade param if is_disabled === true', () => {
        default_mock_prop.is_disabled = true;
        mockStrike();

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
