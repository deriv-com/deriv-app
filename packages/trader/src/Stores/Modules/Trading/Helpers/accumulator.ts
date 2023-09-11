/**
 * @param {Object} previous_ticks_history_stats - an object of type: { ticks_stayed_in: number[], last_tick_epoch: number }
 *                                                with ticks_stayed_in starting with the latest counter value;
 * @param {number[]} new_ticks_history_stats - an array of ticks counters containing 100 last values at first, and then only 1 latest updated counter value;
 * @param {number} last_tick_epoch - an epoch of the latest tick counted by the latest (last) ticks counter in new_ticks_stayed_in array;
 * @returns an object of the same type as previous_ticks_history_stats.
 */

import { TTradeStore } from 'Types';

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
    // we anticipate that the latest counter value will be the last one in the received new_ticks_stayed_in array:
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
