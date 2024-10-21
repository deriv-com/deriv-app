import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../../trader-providers';
import PayoutPerPoint from '../payout-per-point';

const payout_per_point_label = 'Payout per point';

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

describe('PayoutPerPoint', () => {
    let default_mock_store: ReturnType<typeof mockStore>,
        default_mock_prop: React.ComponentProps<typeof PayoutPerPoint>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    ...mockStore({}),
                    barrier_1: '+1.80',
                    payout_choices: ['6', '5', '4', '3', '2', '1'],
                    currency: 'USD',
                    payout_per_point: '3',
                },
            },
        });
        default_mock_prop = { is_minimized: true, is_disabled: false };
    });

    afterEach(() => jest.clearAllMocks());

    const mockPayoutPerPoint = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <PayoutPerPoint {...default_mock_prop} />
                </ModulesProvider>
            </TraderProviders>
        );
    it('renders Skeleton loader if payout_per_point is falsy', () => {
        default_mock_store.modules.trade.payout_per_point = '';
        mockPayoutPerPoint();

        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
        expect(screen.queryByText(payout_per_point_label)).not.toBeInTheDocument();
    });

    it('renders trade param with "Payout per point" label and input with value equal to current payout_per_point value', () => {
        mockPayoutPerPoint();

        expect(screen.getByText(payout_per_point_label)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('3 USD');
    });

    it('disables trade param if is_disabled === true', () => {
        default_mock_prop.is_disabled = true;
        mockPayoutPerPoint();

        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('opens ActionSheet with WheelPicker component, barrier information, "Save" button and text content with definition if user clicks on trade param', () => {
        mockPayoutPerPoint();

        expect(screen.queryByTestId('dt-actionsheet-overlay')).not.toBeInTheDocument();

        userEvent.click(screen.getByText(payout_per_point_label));

        expect(screen.getByTestId('dt-actionsheet-overlay')).toBeInTheDocument();
        expect(screen.getByText('WheelPicker')).toBeInTheDocument();
        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.getByText('+1.80')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(
            screen.getByText(
                'The amount you choose to receive at expiry for every point of change between the final price and the barrier.'
            )
        ).toBeInTheDocument();
    });

    it('does not render barrier information if barrier is not defined', () => {
        default_mock_store.modules.trade.barrier_1 = undefined;
        mockPayoutPerPoint();

        userEvent.click(screen.getByText(payout_per_point_label));

        expect(screen.getByText('Barrier')).toBeInTheDocument();
        expect(screen.queryByText('+1.80')).not.toBeInTheDocument();
    });

    it('applies specific className if innerHeight is <= 640px', () => {
        const original_height = window.innerHeight;
        window.innerHeight = 640;
        mockPayoutPerPoint();

        userEvent.click(screen.getByText(payout_per_point_label));

        expect(screen.getByTestId('dt_carousel')).toHaveClass('payout-per-point__carousel--small');
        window.innerHeight = original_height;
    });

    it('calls setPayoutPerPoint function if user changes selected value', async () => {
        jest.useFakeTimers();
        mockPayoutPerPoint();

        const new_selected_value = default_mock_store.modules.trade.payout_choices[1];
        userEvent.click(screen.getByText(payout_per_point_label));
        userEvent.click(screen.getByText(new_selected_value));
        userEvent.click(screen.getByText('Save'));

        await waitFor(() => jest.advanceTimersByTime(200));

        expect(default_mock_store.modules.trade.setPayoutPerPoint).toBeCalled();
        jest.useRealTimers();
    });
});
