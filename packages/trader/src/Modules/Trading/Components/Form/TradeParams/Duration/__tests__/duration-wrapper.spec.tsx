import React from 'react';
import { render, screen } from '@testing-library/react';
import { TCoreStores } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import userEvent from '@testing-library/user-event';
import DurationWrapper from '../duration-wrapper';
import TraderProviders from '../../../../../../../trader-providers';

jest.mock('../../../DatePicker', () => jest.fn(() => <div>TradingDatePicker</div>));
jest.mock('../../../TimePicker', () => jest.fn(() => <div>TradingTimePicker</div>));

describe('<DurationWrapper />', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    beforeEach(() => {
        default_mock_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    contract_expiry_type: 'intraday',
                    contract_type: TRADE_TYPES.RISE_FALL,
                    duration: 3,
                    duration_unit: 'm',
                    duration_units_list: [
                        {
                            text: 'Ticks',
                            value: 't',
                        },
                        {
                            text: 'Seconds',
                            value: 's',
                        },
                        {
                            text: 'Minutes',
                            value: 'm',
                        },
                        {
                            text: 'Hours',
                            value: 'h',
                        },
                        {
                            text: 'Days',
                            value: 'd',
                        },
                    ],
                    duration_min_max: {
                        daily: {
                            min: 86400,
                            max: 31536000,
                        },
                        intraday: {
                            min: 15,
                            max: 86400,
                        },
                        tick: {
                            min: 1,
                            max: 10,
                        },
                    },
                    expiry_type: 'duration',
                    expiry_date: null,
                    expiry_epoch: '',
                    expiry_time: null,
                    onChange: jest.fn(),
                    onChangeMultiple: jest.fn(),
                    start_date: 0,
                    market_close_times: [],
                    market_open_times: [],
                    validation_errors: { duration: [] },
                },
            },
            ui: {
                ...mockStore({}).ui,
                advanced_expiry_type: 'duration',
                advanced_duration_unit: 'm',
                duration_t: 5,
                getDurationFromUnit: jest.fn(() => 3),
                is_advanced_duration: true,
                onChangeUiStore: jest.fn(),
                simple_duration_unit: 't',
            },
        };
    });
    const mockDurationWrapper = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <DurationWrapper />
            </TraderProviders>
        );
    };
    it('should render advanced duration with Duration & End time toggle, and 3 Minutes', () => {
        render(mockDurationWrapper(default_mock_store));
        expect(screen.getByText(/Duration/i)).toBeInTheDocument();
        expect(screen.getByText(/End time/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/3/i)).toBeInTheDocument();
        expect(screen.getByText(/Minutes/i)).toBeInTheDocument();
    });
    it('should render 15 Seconds duration', () => {
        default_mock_store.modules.trade.duration = 15;
        default_mock_store.modules.trade.duration_unit = 's';
        default_mock_store.ui.advanced_duration_unit = 's';
        default_mock_store.ui.getDurationFromUnit = jest.fn(() => 15);
        render(mockDurationWrapper(default_mock_store));
        expect(screen.getByText(/Seconds/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/15/i)).toBeInTheDocument();
    });
    it('should execute onChange & onChangeUiStore when a user is typing a new value', () => {
        default_mock_store.modules.trade.duration = 2;
        default_mock_store.ui.getDurationFromUnit = jest.fn(() => 2);
        render(mockDurationWrapper(default_mock_store));
        const duration_input = screen.getByDisplayValue(/2/i);
        userEvent.type(duration_input, '5');
        expect(default_mock_store.modules.trade.onChange).toHaveBeenCalledWith({
            target: { name: 'duration', value: 25 },
        });
        expect(default_mock_store.ui.onChangeUiStore).toHaveBeenCalledWith({ name: 'duration_m', value: 25 });
        expect(default_mock_store.modules.trade.onChangeMultiple).toHaveBeenCalledTimes(0);
    });
    it('should render simple duration with Ticks & Minutes toggle, and 3 Minutes', () => {
        default_mock_store.ui.is_advanced_duration = false;
        default_mock_store.ui.simple_duration_unit = 'm';
        render(mockDurationWrapper(default_mock_store));
        expect(screen.getByText(/Ticks/i)).toBeInTheDocument();
        expect(screen.getByText(/Minutes/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/3/i)).toBeInTheDocument();
    });
    it('should render advanced Duration & End time toggle with date & time pickers when expiry_type is endtime', () => {
        default_mock_store.modules.trade.expiry_type = 'endtime';
        render(mockDurationWrapper(default_mock_store));
        expect(screen.getByText(/Duration/i)).toBeInTheDocument();
        expect(screen.getByText(/End time/i)).toBeInTheDocument();
        expect(screen.getByText(/TradingDatePicker/i)).toBeInTheDocument();
        expect(screen.getByText(/TradingTimePicker/i)).toBeInTheDocument();
    });
    it('should render simple Duration & End time toggle with date & time pickers when expiry_type is intraday', () => {
        default_mock_store.ui.is_advanced_duration = false;
        default_mock_store.modules.trade.expiry_type = 'intraday';
        render(mockDurationWrapper(default_mock_store));
        expect(screen.getByText(/Ticks/i)).toBeInTheDocument();
        expect(screen.getByText(/Minutes/i)).toBeInTheDocument();
        expect(screen.queryByText(/TradingDatePicker/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/TradingTimePicker/i)).not.toBeInTheDocument();
    });
});
