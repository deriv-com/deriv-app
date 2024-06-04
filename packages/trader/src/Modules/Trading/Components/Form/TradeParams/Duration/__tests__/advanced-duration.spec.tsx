import React from 'react';
import { screen, render } from '@testing-library/react';
import TraderProviders from '../../../../../../../trader-providers';
import AdvancedDuration from '../advanced-duration';
import { mockStore } from '@deriv/stores';

const button_toggle = 'MockedButtonToggle';
const dropdown = 'MockedDropDown';
const input_field = 'MockedInputField';
const range_slider = 'MockedRangeSlider';
const date_picker = 'MockedDatePicker';
const time_picker = 'MockedTimePicker';
const expiry_text = 'MockedExpiryText';
const duration_range_text = 'MockedDurationRangeText';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ButtonToggle: jest.fn(() => <div>{button_toggle}</div>),
    Dropdown: jest.fn(() => <div>{dropdown}</div>),
    InputField: jest.fn(() => <div>{input_field}</div>),
}));
jest.mock('App/Components/Form/RangeSlider', () => jest.fn(() => <div>{range_slider}</div>));
jest.mock('../../../DatePicker', () => jest.fn(() => <div>{date_picker}</div>));
jest.mock('../../../TimePicker', () => jest.fn(() => <div>{time_picker}</div>));
jest.mock('../expiry-text', () => jest.fn(() => <div>{expiry_text}</div>));
jest.mock('../duration-range-text', () => jest.fn(() => <div>{duration_range_text}</div>));

describe('<AdvancedDuration />', () => {
    let mock_store: ReturnType<typeof mockStore>, default_props: React.ComponentProps<typeof AdvancedDuration>;
    beforeEach(() => {
        mock_store = {
            ...mockStore({
                ui: {
                    current_focus: '',
                    setCurrentFocus: jest.fn(),
                },
                modules: {
                    trade: {
                        contract_expiry_type: 'intraday',
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
                        validation_errors: {},
                    },
                },
            }),
        };
        default_props = {
            advanced_duration_unit: 't',
            advanced_expiry_type: 'duration',
            changeDurationUnit: jest.fn(),
            duration_t: 10,
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
            expiry_date: '',
            expiry_epoch: 1703057788,
            expiry_list: [
                {
                    text: 'Duration',
                    value: 'duration',
                },
                {
                    text: 'End time',
                    value: 'endtime',
                },
            ],
            expiry_type: 'duration',
            getDurationFromUnit: jest.fn(),
            number_input_props: {
                type: 'number',
                is_incrementable: false,
            },
            onChange: jest.fn(),
            onChangeUiStore: jest.fn(),
            server_time: 0,
            shared_input_props: {
                is_hj_whitelisted: true,
                max_value: 86400,
                min_value: 15,
                onChange: jest.fn(),
            },
            start_date: 0,
        };
    });
    const renderAdvancedDuration = (
        mock_store: ReturnType<typeof mockStore>,
        default_props: React.ComponentProps<typeof AdvancedDuration>
    ) => {
        return render(
            <TraderProviders store={mock_store}>
                <AdvancedDuration {...default_props} />
            </TraderProviders>
        );
    };
    it('Should render mocked button toggle if expiry_list is of length > 1', () => {
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(button_toggle)).toBeInTheDocument();
    });
    it('Should not render mocked button toggle if expiry_list is of length <= 1', () => {
        default_props.expiry_list = [
            {
                text: 'Duration',
                value: 'duration',
            },
        ];
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.queryByText(button_toggle)).not.toBeInTheDocument();
    });
    it('Should render mocked trading date and trading time picker if contract is 24 hours and expiry type is endtime', () => {
        default_props.expiry_type = 'endtime';
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(date_picker)).toBeInTheDocument();
        expect(screen.getByText(time_picker)).toBeInTheDocument();
    });
    it('Should render mocked expiry text and should not render trading time picker if contract is not 24 hours and expiry type is endtime', () => {
        default_props.expiry_type = 'endtime';
        default_props.duration_units_list = [
            {
                text: 'Ticks',
                value: 't',
            },
            {
                text: 'Seconds',
                value: 's',
            },
            {
                text: 'Days',
                value: 'd',
            },
        ];
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(expiry_text)).toBeInTheDocument();
        expect(screen.queryByText(time_picker)).not.toBeInTheDocument();
    });
    it('Should render mocked dropdown if duration_units_list length is > 1', () => {
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(dropdown)).toBeInTheDocument();
    });
    it('Should not render mocked dropdown if duration_units_list length is > 0', () => {
        default_props.duration_units_list = [];
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.queryByText(dropdown)).not.toBeInTheDocument();
    });
    it('Should render mocked trading date picker and mocked expiry text if advanced_duration_unit === d & !==t', () => {
        default_props.advanced_duration_unit = 'd';
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(duration_range_text)).toBeInTheDocument();
        expect(screen.getByText(expiry_text)).toBeInTheDocument();
    });
    it('Should render mocked trading date picker and mocked expiry text if advanced_duration_unit === t && contract_expiry_type === tick', () => {
        mock_store.modules.trade.contract_expiry_type = 'tick';
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(range_slider)).toBeInTheDocument();
    });
    it('Should render mocked mocked input field if advanced_duration_unit is intraday like h or m', () => {
        default_props.advanced_duration_unit = 'm';
        renderAdvancedDuration(mock_store, default_props);
        expect(screen.getByText(input_field)).toBeInTheDocument();
    });
});
