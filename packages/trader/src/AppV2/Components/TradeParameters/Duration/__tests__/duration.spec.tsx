import React from 'react';
import { render, screen } from '@testing-library/react';
import Duration from '../index';
import TraderProviders from '../../../../../trader-providers';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import userEvent from '@testing-library/user-event';
import { useSnackbar } from '@deriv-com/quill-ui';
import moment from 'moment';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.ResizeObserver = ResizeObserver;

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    useSnackbar: jest.fn(),
}));

jest.mock('AppV2/Hooks/useActiveSymbols', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        activeSymbols: [
            { symbol: 'EURUSD', display_name: 'EUR/USD', exchange_is_open: 1 },
            { symbol: 'GBPUSD', display_name: 'GBP/USD', exchange_is_open: 0 },
            { symbol: 'CADAUD', display_name: 'CAD/AUD', exchange_is_open: 0 },
        ],
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    toMoment: jest.fn(() => ({
        clone: jest.fn(),
        isSame: jest.fn(() => true),
    })),
}));

describe('Duration', () => {
    let default_trade_store: TCoreStores, mockOnChangeMultiple: jest.Mock;

    beforeEach(() => {
        mockOnChangeMultiple = jest.fn();
        default_trade_store = mockStore({
            modules: {
                trade: {
                    onChange: jest.fn(),
                    validation_errors: { duration: [] },
                    duration: 30,
                    duration_unit: 'm',
                    expiry_type: 'duration',
                    expiry_time: '',
                    proposal_info: {},
                    onChangeMultiple: mockOnChangeMultiple,
                    duration_min_max: {
                        tick: { min: 1, max: 10 },
                        intraday: { min: 60, max: 3600 },
                        daily: { min: 86400, max: 172800 },
                    },
                    start_time: null,
                    symbol: 'EURUSD',
                },
            },
            common: {
                server_time: moment('2024-10-10T11:23:10.895Z'),
            },
        });
    });

    const mockAddSnackbar = jest.fn();

    beforeAll(() => {
        (useSnackbar as jest.Mock).mockReturnValue({ addSnackbar: mockAddSnackbar });
    });
    const mockDuration = () => {
        render(
            <TraderProviders store={default_trade_store}>
                <Duration />
            </TraderProviders>
        );
    };

    it('should render the Duration component with default values', () => {
        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('30 minutes')).toBeInTheDocument();
    });

    it('should render the correct value for duration in hours and minutes', () => {
        default_trade_store.modules.trade.duration = 125;
        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2 hours 5 minutes')).toBeInTheDocument();
    });

    it('should render the correct value for duration in end time', () => {
        default_trade_store.modules.trade.duration = 1;
        default_trade_store.modules.trade.expiry_time = '23:55';
        default_trade_store.modules.trade.expiry_type = 'endtime';
        const RealDate = Date;
        global.Date = jest.fn(() => new RealDate(2024, 0, 1)) as any;
        mockDuration();
        expect(screen.getByLabelText('Duration')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Ends on 1 Jan 2024 23:55 GMT')).toBeInTheDocument();
        global.Date = RealDate;
    });

    it('should open the ActionSheet when the text field is clicked', () => {
        default_trade_store.modules.trade.expiry_time = '12:30';
        mockDuration();
        const textField = screen.getByLabelText('Duration');
        expect(textField).toBeInTheDocument();
        userEvent.click(textField);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display a validation error message if there is a duration error', async () => {
        default_trade_store.modules.trade.validation_errors.duration = [
            { message: 'Invalid duration', error_field: 'duration' },
        ];
        mockDuration();
        await expect(mockAddSnackbar).toHaveBeenCalled();
    });

    it('should display the market closed message when the market is closed', () => {
        default_trade_store.modules.trade.symbol = 'GBPUSD';
        mockDuration();
        expect(screen.getByText(/duration/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should set the correct end date when duration is set in days', () => {
        default_trade_store.modules.trade.duration = 3;
        default_trade_store.modules.trade.duration_unit = 'd';
        mockDuration();
        expect(screen.getByDisplayValue(/ends on/i)).toBeInTheDocument();
    });

    it('should calculate the correct duration based on the smallest unit from the store', () => {
        mockDuration();
        const smallest_duration = screen.getByDisplayValue('30 minutes');
        expect(smallest_duration).toBeInTheDocument();
    });

    it('should display duration in seconds if provided', () => {
        default_trade_store.modules.trade.duration = 45;
        default_trade_store.modules.trade.duration_unit = 's';
        mockDuration();
        expect(screen.getByDisplayValue('45 seconds')).toBeInTheDocument();
    });

    it('should display correct duration in ticks when tick duration is selected', () => {
        default_trade_store.modules.trade.duration = 5;
        default_trade_store.modules.trade.duration_unit = 't';
        mockDuration();
        expect(screen.getByDisplayValue('5 ticks')).toBeInTheDocument();
    });

    it('should update the selected hour and unit when the component is opened', () => {
        default_trade_store.modules.trade.duration_unit = 'm';
        default_trade_store.modules.trade.duration = 125;
        mockDuration();

        const textField = screen.getByLabelText('Duration');
        userEvent.click(textField);

        expect(screen.getByDisplayValue('2 hours 5 minutes')).toBeInTheDocument();
    });

    it('should update the selected unit and time when expiry_time is set', () => {
        const mockDate = new Date('2024-10-08T08:00:00Z');
        jest.spyOn(global.Date.prototype, 'getTime').mockReturnValue(mockDate.getTime());
        jest.spyOn(global.Date.prototype, 'toLocaleDateString').mockReturnValue('8 Oct 2024');
        jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2024-10-08T08:00:00Z');

        default_trade_store.modules.trade.expiry_time = '14:00';
        default_trade_store.modules.trade.expiry_type = 'endtime';

        mockDuration();

        const textField = screen.getByLabelText('Duration');
        userEvent.click(textField);

        expect(screen.getByDisplayValue('Ends on 8 Oct 2024 14:00 GMT')).toBeInTheDocument();

        jest.restoreAllMocks();
    });
});
