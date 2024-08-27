import React from 'react';
import { setTime, toMoment } from '@deriv/shared';
import TimePicker from 'App/Components/Form/TimePicker';
import { getSelectedTime, getBoundaries } from 'Stores/Modules/Trading/Helpers/end-time';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const TradingTimePicker = observer(() => {
    const { common } = useStore();
    const { server_time } = common;
    const { expiry_date, expiry_time, market_open_times, market_close_times, onChange, is_market_closed } =
        useTraderStore();
    const moment_expiry_date = toMoment(expiry_date);
    const market_open_datetimes = market_open_times.map(open_time => setTime(moment_expiry_date.clone(), open_time));
    const market_close_datetimes = market_close_times.map(close_time =>
        setTime(moment_expiry_date.clone(), close_time)
    );
    const expiry_datetime = setTime(moment_expiry_date.clone(), expiry_time);
    const server_datetime = toMoment(server_time);

    const boundaries = getBoundaries(server_datetime.clone(), market_open_datetimes, market_close_datetimes);
    const selected_time = getSelectedTime(
        server_datetime.clone(),
        expiry_datetime,
        market_open_datetimes,
        market_close_datetimes
    );

    React.useEffect(() => {
        if (expiry_time !== selected_time && !is_market_closed) {
            onChange({
                target: { name: 'expiry_time', value: selected_time },
            });
        }
    }, [expiry_time, selected_time, onChange, is_market_closed]);

    return (
        <TimePicker
            end_times={boundaries.end}
            onChange={onChange}
            name='expiry_time'
            placeholder='12:00'
            start_times={boundaries.start}
            selected_time={selected_time}
        />
    );
});

export default TradingTimePicker;
