import { useStore } from '@deriv/stores';
import { TTradeStore } from 'Types';
import dayjs from 'dayjs';

type TTime = {
    server_time: NonNullable<ReturnType<typeof useStore>['common']['server_time']>;
    selected_time: dayjs.Dayjs;
    market_open_times: TTradeStore['market_open_times'];
    market_close_times: TTradeStore['market_close_times'];
};

const getClosestTime = (time: dayjs.Dayjs | string, interval: number): dayjs.Dayjs => {
    const dayjs_time = dayjs(time); // Convert time to a dayjs object if it's a string
    return dayjs_time.minute(Math.ceil(dayjs_time.minute() / interval) * interval);
};

export const getSelectedTime = (
    server_time: TTime['server_time'],
    selected_time: TTime['selected_time'],
    market_open_times: dayjs.Dayjs[],
    market_close_times: dayjs.Dayjs[]
) => {
    for (let i = 0; i < market_open_times.length; i++) {
        if (selected_time.isAfter(market_open_times[i]) && selected_time.isBefore(market_close_times[i])) {
            return getClosestTime(selected_time, 5).format('HH:mm');
        }
    }

    for (let i = 0; i < market_open_times.length; i++) {
        const dayjs_market_open_time = dayjs(market_open_times[i]); // Convert market open time to a dayjs object
        if (dayjs_market_open_time.isAfter(server_time)) {
            return getClosestTime(dayjs_market_open_time, 5).format('HH:mm');
        }
    }

    return getClosestTime(server_time, 5).format('HH:mm');
};

export const getBoundaries = (
    server_time: TTime['server_time'],
    market_open_times: dayjs.Dayjs[],
    market_close_times: dayjs.Dayjs[]
) => {
    const boundaries = {
        start: market_open_times.map(open_time =>
            server_time.isBefore(open_time) ? dayjs(open_time).clone() : server_time
        ),
        end: market_close_times,
    };

    if (boundaries.start.length > 0) {
        boundaries.start[0] = getClosestTime(boundaries.start[0], 5);
    }

    return boundaries;
};
