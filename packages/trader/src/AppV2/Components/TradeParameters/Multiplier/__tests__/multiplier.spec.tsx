import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import Multiplier from '../multiplier';

const multiplier_param_label = 'Multiplier';
const multiplier_carousel_testid = 'dt_carousel';
const skeleton_testid = 'square-skeleton';
const mocked_definition = 'Multiplier is...';

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

describe('<Multiplier />', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(
        () =>
            (default_mock_store = mockStore({
                modules: {
                    trade: {
                        ...mockStore({}),
                        multiplier_range_list: [
                            { text: 'x1', value: 1 },
                            { text: 'x2', value: 2 },
                        ],
                        multiplier: 1,
                        is_purchase_enabled: true,
                        commission: 0.01,
                    },
                },
            }))
    );

    afterEach(() => jest.clearAllMocks());

    const mockMultiplier = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <Multiplier is_minimized />
                </ModulesProvider>
            </TraderProviders>
        );
    it('should render Skeleton loader if multiplier is falsy', () => {
        default_mock_store.modules.trade.multiplier = 0;
        mockMultiplier();

        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
        expect(screen.queryByText(multiplier_param_label)).not.toBeInTheDocument();
    });
    it('should render trade param with multiplier label and input with a value equal to the current multiplier value', () => {
        mockMultiplier();

        expect(screen.getByText(multiplier_param_label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('x1');
    });
    it('should open ActionSheet with WheelPicker component, details, "Save" button and trade param definition if user clicks on multiplier trade param', () => {
        mockMultiplier();

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(multiplier_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.getByText('WheelPicker')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText(mocked_definition)).toBeInTheDocument();
        expect(screen.getByText('Commission')).toBeInTheDocument();
        expect(screen.getByText('0.01')).toBeInTheDocument();
    });
    it('should render skeleton instead of WheelPicker if multiplier_range_list is empty', () => {
        default_mock_store.modules.trade.multiplier_range_list = [];
        mockMultiplier();

        userEvent.click(screen.getByText(multiplier_param_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.queryByText('WheelPicker')).not.toBeInTheDocument();
        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
    });
    it('should render skeleton instead of detail if commission not available', () => {
        default_mock_store.modules.trade.commission = null;
        mockMultiplier();

        userEvent.click(screen.getByText(multiplier_param_label));

        expect(screen.getByTestId(skeleton_testid)).toBeInTheDocument();
    });
    it('should apply specific className if innerHeight is <= 640px', () => {
        const original_height = window.innerHeight;
        window.innerHeight = 640;
        mockMultiplier();

        userEvent.click(screen.getByText(multiplier_param_label));

        expect(screen.getByTestId(multiplier_carousel_testid)).toHaveClass('multiplier__carousel--small');
        window.innerHeight = original_height;
    });
    it('should call onChange function if user changes selected value', async () => {
        jest.useFakeTimers();
        mockMultiplier();

        userEvent.click(screen.getByText(multiplier_param_label));
        userEvent.click(screen.getByText('x2'));
        userEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            jest.advanceTimersByTime(200);
        });

        expect(default_mock_store.modules.trade.onChange).toBeCalled();
        jest.useRealTimers();
    });
});
