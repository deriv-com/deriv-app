const getClosestTime = (time, interval) => time.minute(Math.ceil(time.minute() / interval) * interval);

export const getSelectedTime = (server_time, selected_time, market_open_times, market_close_times) => {
    for (let i = 0; i < market_open_times.length; i++) {
        if (selected_time.isAfter(market_open_times[i]) && selected_time.isBefore(market_close_times[i])) {
            return getClosestTime(selected_time, 5).format('HH:mm');
        }
    }

    for (let i = 0; i < market_open_times.length; i++) {
        if (market_open_times[i].isAfter(server_time)) {
            return getClosestTime(market_open_times[i], 5).format('HH:mm');
        }
    }

    return getClosestTime(server_time, 5).format('HH:mm');
};

export const getBoundaries = (server_time, market_open_times, market_close_times) => {
    const boundaries = {
        start: market_open_times.map(open_time => (server_time.isBefore(open_time) ? open_time.clone() : server_time)),
        end: market_close_times,
    };

    if (boundaries.start.length > 0) {
        boundaries.start[0] = getClosestTime(boundaries.start[0], 5);
    }

    return boundaries;
};
