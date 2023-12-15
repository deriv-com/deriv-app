import React from 'react';
import moment from 'moment';
import TradingTimePicker from '../trading-time-picker';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';
import { render, screen } from '@testing-library/react';

jest.mock('App/Components/Form/TimePicker', () => jest.fn(() => <div>MockedTimePicker</div>));

describe('<TradingTimePicker />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({
                common: {
                    server_time: moment('2023-11-21T14:30:00'),
                },
                modules: {
                    trade: {
                        expiry_date: '2023-11-22',
                        expiry_time: '12:45',
                        market_open_times: ['00:00'],
                        market_close_times: ['20:55'],
                        onChange: jest.fn(),
                        is_market_closed: false,
                    },
                },
            }),
        };
    });

    const mockTradingTimePicker = (mock_store: ReturnType<typeof mockStore>) => {
        return (
            <TraderProviders store={mock_store}>
                <TradingTimePicker />
            </TraderProviders>
        );
    };
    it('Should render Mocked Time Picker', () => {
        render(mockTradingTimePicker(default_mocked_store));
        expect(screen.getByText(/MockedTimePicker/i)).toBeInTheDocument();
    });
    it('Should call onChange if expiry_time is outside of market opening times', () => {
        default_mocked_store.modules.trade.expiry_time = '21:45';
        render(mockTradingTimePicker(default_mocked_store));
        expect(default_mocked_store.modules.trade.onChange).toHaveBeenCalled();
    });
});
