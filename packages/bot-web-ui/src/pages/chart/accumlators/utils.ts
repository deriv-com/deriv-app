export const ROW_SIZES = {
    DESKTOP_COLLAPSED: 10,
    DESKTOP_EXPANDED: 10,
    MOBILE_COLLAPSED: 15,
    MOBILE_EXPANDED: 5,
};

type TTradeStore = any;

type TGetUpdatedTicksHistoryStats = {
    previous_ticks_history_stats: TTradeStore['ticks_history_stats'];
    new_ticks_history_stats?: TTradeStore['ticks_history_stats']['ticks_stayed_in'];
    last_tick_epoch: TTradeStore['ticks_history_stats']['last_tick_epoch'];
};

export const getUpdatedTicksHistoryStats = ({
    previous_ticks_history_stats = {},
    new_ticks_history_stats = [],
    last_tick_epoch,
}: TGetUpdatedTicksHistoryStats) => {
    let ticks_stayed_in = [];
    const previous_history = previous_ticks_history_stats.ticks_stayed_in || [];
    const previous_epoch = previous_ticks_history_stats.last_tick_epoch ?? 0;
    if (!new_ticks_history_stats.length || !last_tick_epoch) return previous_ticks_history_stats;
    if (new_ticks_history_stats.length > 1) {
        ticks_stayed_in = [...new_ticks_history_stats].reverse();
    } else if (new_ticks_history_stats[0] <= previous_history[0] && last_tick_epoch > previous_epoch) {
        ticks_stayed_in = [new_ticks_history_stats[0], ...previous_history.slice(0, previous_history.length - 1)];
    } else if (last_tick_epoch === previous_epoch) {
        ticks_stayed_in = previous_history;
    } else {
        ticks_stayed_in = [new_ticks_history_stats[0], ...previous_history.slice(1)];
    }
    return { ticks_stayed_in, last_tick_epoch };
};
