import ServerTime   from '_common/base/server_time';
import { toMoment } from 'Utils/Date';

export const buildForwardStartingConfig = (contract, forward_starting_dates) => {
    const forward_starting_config = [];

    if ((contract.forward_starting_options || []).length) {
        contract.forward_starting_options.forEach(option => {
            const duplicated_option = forward_starting_config.find(opt => opt.value === parseInt(option.date));
            const current_session   = { open: toMoment(option.open), close: toMoment(option.close) };
            if (duplicated_option) {
                duplicated_option.sessions.push(current_session);
            } else {
                forward_starting_config.push({
                    text    : toMoment(option.date).format('ddd - DD MMM, YYYY'),
                    value   : parseInt(option.date),
                    sessions: [current_session],
                });
            }
        });
    }

    return forward_starting_config.length ? forward_starting_config : forward_starting_dates;
};

// returns false if same as now
const isBeforeDate = (compare_moment, start_moment, should_only_check_hour) => {
    const now_moment = toMoment(start_moment);
    if (should_only_check_hour) {
        now_moment.minute(0).second(0);
    }
    return compare_moment.isBefore(now_moment) && now_moment.unix() !== compare_moment.unix();
};

export const isSessionAvailable = (
    sessions               = [],
    compare_moment         = toMoment(ServerTime.get()),
    start_moment           = toMoment(ServerTime.get()),
    should_only_check_hour = false,
) => (
    !isBeforeDate(compare_moment, ServerTime.get(), should_only_check_hour) &&
    !isBeforeDate(compare_moment, start_moment, should_only_check_hour) &&
        (!sessions.length ||
            !!sessions.find(session =>
                compare_moment.isBetween(session.open, session.close, should_only_check_hour ? 'hour' : null, '[]')))
);
