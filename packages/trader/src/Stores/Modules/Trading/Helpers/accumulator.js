/**
 *
 * @param {Object[]} ticks_history_stats - array of 100 objects of type: { counter_value: number, epoch: number }
 * @param {Object|Object[]} new_ticks_history_stats - array of 100 objects or a single object of type: { counter_value: number, epoch: number }
 * @returns an array of 100 objects of type: { counter_value: number, epoch: number } starting with the latest counter.
 */
export const getUpdatedTicksHistoryStats = (ticks_history_stats = [], new_ticks_history_stats = []) => {
    // we anticipate that the latest counter object will be the last one in the array:
    if (Array.isArray(new_ticks_history_stats)) return [...new_ticks_history_stats].reverse();
    else if (
        new_ticks_history_stats.counter_value <= ticks_history_stats[0].counter_value &&
        new_ticks_history_stats.epoch > ticks_history_stats[0].epoch
    ) {
        return [new_ticks_history_stats, ...ticks_history_stats.slice(0, ticks_history_stats.length - 1)];
    }
    return [new_ticks_history_stats, ...ticks_history_stats.slice(1)];
};
