const getClosestTime = (
    time,
    interval,
) => time.minute((Math.ceil(time.minute() / interval) * interval));

export const getSelectedTime = (
    server_time,
    selected_time,
    market_open_time,
) => {
    if (selected_time.isAfter(market_open_time)) {
        return getClosestTime(selected_time, 5).format('HH:mm');
    }
    if (market_open_time.isAfter(server_time)) {
        return getClosestTime(market_open_time, 5).format('HH:mm');
    }

    return getClosestTime(server_time, 5).format('HH:mm');
};

export const getBoundaries = (
    server_time,
    market_open_time,
    market_close_time,
) => {
    const boundaries = {
        start: server_time.isBefore(market_open_time)
            ? market_open_time
            : server_time,
        end: market_close_time,
    };

    boundaries.start = getClosestTime(boundaries.start, 5);
    return boundaries;
};
