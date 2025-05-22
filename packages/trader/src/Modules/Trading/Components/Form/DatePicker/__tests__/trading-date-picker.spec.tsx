import React from 'react';
import moment from 'moment';
import TradingDatePicker from '../trading-date-picker';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';
import { render, screen } from '@testing-library/react';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DatePicker: jest.fn(() => 'MockedDatePicker'),
}));
jest.mock('Stores/Modules/Trading/Helpers/contract-type', () => ({
    ContractType: {
        getTradingEvents: jest.fn(() => [
            {
                dates: 'today, Fridays',
                descrip: 'Closes early (at 20:55)',
            },
            {
                dates: '2023-12-25',
                descrip: 'Christmas Day',
            },
            {
                dates: '2024-01-01',
                descrip: "New Year's Day",
            },
        ]),
        getTradingDays: jest.fn(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
    },
}));
describe('<TradingTimePicker />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;
    const mocked_props = {
        id: 'test_id',
        is_24_hours_contract: false,
        mode: 'duration',
        name: 'test_time_picker',
    };
    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({
                common: {
                    server_time: moment('2023-11-21T14:30:00'),
                },
                modules: {
                    trade: {
                        duration: 1,
                        duration_min_max: {
                            daily: {
                                min: 1234,
                                max: 2345,
                            },
                            intraday: {
                                min: 12345,
                                max: 23456,
                            },
                        },
                        duration_units_list: [
                            { text: 'Minutes', value: 'm' },
                            { text: 'Hours', value: 'h' },
                            { text: 'Days', value: 'd' },
                        ],
                        expiry_type: 'duration',
                        onChange: jest.fn(),
                        start_date: 0,
                        start_time: null,
                        symbol: '100HZ',
                        validation_errors: {},
                    },
                },
            }),
        };
    });

    const mockTradingDatePicker = (mock_store: ReturnType<typeof mockStore>) => {
        return (
            <TraderProviders store={mock_store}>
                <TradingDatePicker {...mocked_props} />
            </TraderProviders>
        );
    };
    it('Should render Mocked Date Picker and tooltip should be rendered', () => {
        render(mockTradingDatePicker(default_mocked_store));
        const date_picker = screen.getByText(/mockeddatepicker/i);
        expect(date_picker).toBeInTheDocument();
        expect(date_picker).toHaveClass('trade-container__tooltip');
    });
});
