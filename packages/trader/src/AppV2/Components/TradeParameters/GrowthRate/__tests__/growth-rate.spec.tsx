import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { CONTRACT_TYPES, getGrowthRatePercentage } from '@deriv/shared';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import GrowthRate from '../growth-rate';

const growth_rate_param_label = 'Growth rate';
const growth_rate_carousel_testid = 'dt_carousel';
const skeleton_testid = 'dt_skeleton';
const mocked_definition = 'A growth rate is...';

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
jest.mock('AppV2/Components/TradeParamDefinition', () => jest.fn(() => <div>{mocked_definition}</div>));
jest.mock('lodash.debounce', () =>
    jest.fn(fn => {
        fn.cancel = () => null;
        return fn;
    })
);

describe('GrowthRate', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        accumulator_range_list: [0.01, 0.02, 0.03, 0.04, 0.05],
                        growth_rate: 0.01,
                        is_purchase_enabled: true,
                        proposal_info: {
                            [CONTRACT_TYPES.ACCUMULATOR]: { id: 12345 },
                        },
                        tick_size_barrier_percentage: '0.03612%',
                    },
                },
            }))
    );

    afterEach(() => jest.clearAllMocks());

    const mockGrowthRate = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <GrowthRate is_minimized />
                </ModulesProvider>
            </TraderProviders>
        );
    it('renders Skeleton loader if growth_rate is falsy', () => {
        default_mock_store.modules.trade.growth_rate = 0;
        mockGrowthRate();

        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
        expect(screen.queryByText(growth_rate_param_label)).not.toBeInTheDocument();
    });
    it('renders trade param with "Growth rate" label and input with a value equal to the current growth_rate value in %', () => {
        mockGrowthRate();

        expect(screen.getByText(growth_rate_param_label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue(
            `${getGrowthRatePercentage(default_mock_store.modules.trade.growth_rate)}%`
        );
    });
    it('disables trade param if has_open_accu_contract === true', () => {
        default_mock_store.modules.trade.has_open_accu_contract = true;
        mockGrowthRate();

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
    it('disables trade param if is_market_closed === true', () => {
        default_mock_store.modules.trade.is_market_closed = true;
        mockGrowthRate();

        expect(screen.getByRole('textbox')).toBeDisabled();
    });
    it('opens ActionSheet with WheelPicker component, details, "Save" button and trade param definition if user clicks on "Growth rate" trade param', () => {
        default_mock_store.modules.trade.maximum_ticks = 55;
        mockGrowthRate();

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(growth_rate_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.getByText('WheelPicker')).toBeInTheDocument();
        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(
            screen.getByText(`±${default_mock_store.modules.trade.tick_size_barrier_percentage}`)
        ).toBeInTheDocument();
        expect(screen.getByText('Max duration')).toBeInTheDocument();
        expect(screen.getByText(`${default_mock_store.modules.trade.maximum_ticks} ticks`)).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText(mocked_definition)).toBeInTheDocument();
    });
    it('renders skeleton instead of WheelPicker if accumulator_range_list is empty', () => {
        default_mock_store.modules.trade.accumulator_range_list = [];
        mockGrowthRate();

        userEvent.click(screen.getByText(growth_rate_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.queryByText('WheelPicker')).not.toBeInTheDocument();
        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
    });
    it('renders skeletons instead of details if proposal data is not available', () => {
        default_mock_store.modules.trade.proposal_info = {};
        default_mock_store.modules.trade.is_purchase_enabled = false;
        mockGrowthRate();

        userEvent.click(screen.getByText(growth_rate_param_label));

        expect(
            screen.queryByText(`±${default_mock_store.modules.trade.tick_size_barrier_percentage}`)
        ).not.toBeInTheDocument();
        expect(screen.queryByText(`${default_mock_store.modules.trade.maximum_ticks} ticks`)).not.toBeInTheDocument();
        expect(screen.getAllByTestId(skeleton_testid)).toHaveLength(2);
    });
    it('applies specific className if innerHeight is <= 640px', () => {
        const original_height = window.innerHeight;
        window.innerHeight = 640;
        mockGrowthRate();

        userEvent.click(screen.getByText(growth_rate_param_label));

        expect(screen.getByTestId(growth_rate_carousel_testid)).toHaveClass('growth-rate__carousel--small');
        window.innerHeight = original_height;
    });
    it('calls onChange function if user changes selected value', async () => {
        jest.useFakeTimers();
        mockGrowthRate();

        const new_selected_value = default_mock_store.modules.trade.accumulator_range_list[1];
        userEvent.click(screen.getByText(growth_rate_param_label));
        userEvent.click(screen.getByText(`${getGrowthRatePercentage(new_selected_value)}%`));
        userEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            jest.advanceTimersByTime(200);
        });

        expect(default_mock_store.modules.trade.onChange).toBeCalled();
        jest.useRealTimers();
    });
});
