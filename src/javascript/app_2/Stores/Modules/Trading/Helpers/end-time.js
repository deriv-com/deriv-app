const getClosestTime = (
    time,
    interval,
) => time.minute((Math.ceil(time.minute() / interval) * interval));

export const getSelectedTime = (
    server_time,
    selected_time,
    market_open_time,
) => {
    let value = selected_time.isBefore(market_open_time)
        ? market_open_time.isBefore(server_time)
            ? server_time
            : market_open_time
        : selected_time;

    value = getClosestTime(value, 5);
    return value.format('HH:mm');
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
