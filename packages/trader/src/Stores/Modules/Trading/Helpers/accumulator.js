export const getUpdatedTicksHistoryStats = (ticks_history_stats = [], new_ticks_history_stats = []) => {
    if (Array.isArray(new_ticks_history_stats)) return [...new_ticks_history_stats].reverse();
    else if (new_ticks_history_stats !== 0) return [new_ticks_history_stats, ...ticks_history_stats.slice(1)];
    return [new_ticks_history_stats, ...ticks_history_stats.slice(0, ticks_history_stats.length - 1)];
};
