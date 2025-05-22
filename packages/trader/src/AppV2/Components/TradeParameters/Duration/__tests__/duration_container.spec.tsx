import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DurationActionSheetContainer from '../container';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../../../../../trader-providers';
import userEvent from '@testing-library/user-event';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import moment from 'moment';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.ResizeObserver = ResizeObserver;
global.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('Stores/Modules/Trading/Helpers/contract-type', () => ({
    ContractType: {
        getTradingEvents: jest.fn(),
        getTradingDays: jest.fn(),
    },
}));

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [{ symbol: '1HZ100V', display_name: '"Volatility 100 (1s) Index"', exchange_is_open: 1 }],
    })),
}));

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    DatePicker: jest.fn(({ onChange }) => (
        <div>
            <button
                onClick={() => {
                    const mockDate = new Date(2024, 8, 10);
                    onChange(mockDate);
                }}
            >
                Date Picker
            </button>
        </div>
    )),
}));

describe('DurationActionSheetContainer', () => {
    let default_trade_store: TCoreStores;

    beforeEach(() => {
        default_trade_store = mockStore({
            modules: {
                trade: {
                    duration: 30,
                    duration_unit: 'm',
                    duration_units_list: [
                        { value: 's', text: 'seconds' },
                        { value: 't', text: 'ticks' },
                        { value: 'm', text: 'minutes' },
                        { value: 'h', text: 'hours' },
                        { value: 'd', text: 'days' },
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
                    onChangeMultiple: jest.fn(),
                    expiry_time: null,
                    contract_type: 'call',
                    symbol: '1HZ100V',
                    saved_expiry_date_v2: '',
                    setSavedExpiryDateV2: jest.fn(),
                    setUnsavedExpiryDateV2: jest.fn(),
                    unsaved_expiry_date_v2: '',
                },
            },
            common: {
                server_time: moment('2024-10-10T11:23:10.895Z'),
            },
        });
    });

    const renderDurationContainer = (
        mocked_store: TCoreStores,
        unit = 'm',
        setUnit = jest.fn(),
        selected_hour = [0, 0],
        setSelectedHour = jest.fn(),
        saved_expiry_date_v2 = new Date().toISOString().slice(0, 10),
        setSavedExpiryDateV2 = jest.fn(),
        end_time = '',
        setEndTime = jest.fn()
    ) => {
        render(
            <TraderProviders store={mocked_store}>
                <DurationActionSheetContainer
                    selected_hour={selected_hour}
                    setSelectedHour={setSelectedHour}
                    unit={unit}
                    setUnit={setUnit}
                    saved_expiry_date_v2={saved_expiry_date_v2}
                    setSavedExpiryDateV2={setSavedExpiryDateV2}
                    end_time={end_time}
                    setEndTime={setEndTime}
                    expiry_time_string='24th Aug 2024'
                    setExpiryTimeString={() => jest.fn()}
                    unsaved_expiry_date_v2={''}
                    setUnsavedExpiryDateV2={() => jest.fn()}
                />
            </TraderProviders>
        );
    };

    it('should render the DurationActionSheetContainer with default values', () => {
        renderDurationContainer(default_trade_store);
        expect(screen.getByText('Duration')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should select duration in hours if duration is more than 59 minutes', async () => {
        default_trade_store.modules.trade.duration = 130;
        renderDurationContainer(default_trade_store, 'h', jest.fn(), [2, 10]);

        const duration_chip = screen.getByText('1 h');
        await userEvent.click(duration_chip);

        expect(default_trade_store.modules.trade.onChangeMultiple).not.toHaveBeenCalled();
    });

    it('should call onChangeMultiple with correct data with hours', async () => {
        default_trade_store.modules.trade.duration = 130;
        renderDurationContainer(default_trade_store, 'm', jest.fn(), [2, 10], jest.fn());

        await userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 'm',
            duration: 1,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call onChangeMultiple with correct data with ticks', async () => {
        default_trade_store.modules.trade.duration = 5;

        renderDurationContainer(default_trade_store, 't');

        await userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 't',
            duration: 5,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call change duration on changing chips', async () => {
        renderDurationContainer(default_trade_store, 'h');

        await userEvent.click(screen.getByText('minutes'));
        expect(screen.getByText('1 min')).toBeInTheDocument();
        await userEvent.click(screen.getByText('hours'));
        expect(screen.getByText('1 h')).toBeInTheDocument();
    });

    it('should call onChangeMultiple with correct data with seconds', async () => {
        default_trade_store.modules.trade.duration = 20;

        renderDurationContainer(default_trade_store, 's');
        await userEvent.click(screen.getByText('22 sec'));
        await userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 's',
            duration: 20,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call onChangeMultiple with correct data with hour', async () => {
        default_trade_store.modules.trade.duration = 4;

        renderDurationContainer(default_trade_store, 'h');
        await userEvent.click(screen.getByText('4 h'));
        await userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 'm',
            duration: 60,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call onChangeMultiple with correct endtime with endtime', async () => {
        default_trade_store.modules.trade.expiry_time = '23:35';

        renderDurationContainer(
            default_trade_store,
            'd',
            jest.fn(),
            [0, 0],
            jest.fn(),
            new Date().toISOString().slice(0, 10),
            jest.fn(),
            '11:35',
            jest.fn()
        );
        await userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            expiry_time: '11:35',
            expiry_type: 'endtime',
        });
    });

    it('should show Expiry Date when days are selected', () => {
        renderDurationContainer(default_trade_store, 'd');
        expect(screen.getByText('Expiry')).toBeInTheDocument();
    });

    it('should show End Time Screen on selecting the days unit', () => {
        renderDurationContainer(default_trade_store, 'd');
        const date_input = screen.getByTestId('dt_date_input');
        expect(date_input).toBeInTheDocument();
    });

    it('should open datepicker on clicking on date input in the days page', async () => {
        renderDurationContainer(default_trade_store, 'd');
        const mockEvents = [{ dates: 'Fridays, Saturdays', descrip: 'Some description' }];
        jest.spyOn(ContractType, 'getTradingEvents').mockResolvedValue(mockEvents);

        const date_input = screen.getByTestId('dt_date_input');
        expect(date_input).toBeInTheDocument();
        await userEvent.click(date_input);
        expect(screen.getByText('Pick an end date'));
    });

    it('should save and close datepicker on clicking done button', async () => {
        renderDurationContainer(default_trade_store, 'd');
        const date_input = screen.getByTestId('dt_date_input');
        expect(date_input).toBeInTheDocument();
        await userEvent.click(date_input);
        expect(screen.getByText('Pick an end date'));
        await userEvent.click(screen.getByText('Done'));
        await waitFor(() => expect(screen.queryByText('Pick an end date')).not.toBeInTheDocument());
    });

    it('should not render chips if duration_units_list contains only ticks', () => {
        default_trade_store.modules.trade.duration = 1;
        default_trade_store.modules.trade.duration_unit = 't';
        default_trade_store.modules.trade.duration_units_list = [{ value: 't' }];
        renderDurationContainer(default_trade_store);

        const chip_names = ['Ticks', 'Seconds', 'Minutes', 'Hours', 'Days', 'End Time'];
        chip_names.forEach(name => expect(screen.queryByText(name)).not.toBeInTheDocument());
    });
});
