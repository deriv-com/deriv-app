import { getUpdatedTicksHistoryStats } from '../accumulator';

describe('getUpdatedTicksHistoryStats', () => {
    const existing_ticks_history_stats = {
        ticks_stayed_in: [1, 65, 1234, 675, 234],
        last_tick_epoch: 1005,
    };
    const new_ticks_history_stats = [1573, 33, 423, 2853, 131];
    const new_tick_epoch = 1006;

    const current_counter_same_value = { counter_value: 1, epoch: 1005 };
    const current_counter_new_value = { counter_value: 2, epoch: 1006 };
    const next_counter_initial_value = { counter_value: 0, epoch: 1006 };
    const next_counter_latest_value = { counter_value: 1, epoch: 1007 };

    it('returns a ticks_history_stats with reversed ticks_stayed_in when new_ticks_history_stats.length > 1', () => {
        const expected_ticks_history_stats = { ticks_stayed_in: [131, 2853, 423, 33, 1573], last_tick_epoch: 1006 };
        expect(
            getUpdatedTicksHistoryStats({
                previous_ticks_history_stats: {},
                new_ticks_history_stats,
                last_tick_epoch: new_tick_epoch,
            })
        ).toEqual(expected_ticks_history_stats);
        const new_ticks_history = getUpdatedTicksHistoryStats({
            previous_ticks_history_stats: existing_ticks_history_stats,
            new_ticks_history_stats,
            last_tick_epoch: new_tick_epoch,
        });
        expect(new_ticks_history).toEqual(expected_ticks_history_stats);
        expect(new_ticks_history).not.toEqual(existing_ticks_history_stats);
    });

    it('returns the same ticks_history_stats when new_ticks_history_stats is undefined', () => {
        expect(
            getUpdatedTicksHistoryStats({
                previous_ticks_history_stats: existing_ticks_history_stats,
                last_tick_epoch: new_tick_epoch,
            })
        ).toEqual(existing_ticks_history_stats);
    });

    it('returns the same ticks_history_stats when new_ticks_history_stats contains the same single value of the current counter', () => {
        expect(
            getUpdatedTicksHistoryStats({
                previous_ticks_history_stats: existing_ticks_history_stats,
                new_ticks_history_stats: [current_counter_same_value.counter_value],
                last_tick_epoch: current_counter_same_value.epoch,
            })
        ).toEqual(existing_ticks_history_stats);
    });

    it('returns a new ticks_history_stats with 1st item in ticks_stayed_in replaced with a current counter new value', () => {
        const expected_ticks_history_stats = {
            ticks_stayed_in: [2, 65, 1234, 675, 234],
            last_tick_epoch: 1006,
        };
        expect(
            getUpdatedTicksHistoryStats({
                previous_ticks_history_stats: existing_ticks_history_stats,
                new_ticks_history_stats: [current_counter_new_value.counter_value],
                last_tick_epoch: current_counter_new_value.epoch,
            })
        ).toEqual(expected_ticks_history_stats);
    });

    it('returns a new ticks_history_stats with a shifted ticks_stayed_in array of the same length & with new_ticks_history_stats[0] placed as 1st item when its a counter_value < previous counter_value & an epoch > a previous epoch', () => {
        const expected_ticks_history_stats = {
            ticks_stayed_in: [0, 1, 65, 1234, 675],
            last_tick_epoch: 1006,
        };
        const new_ticks_history = getUpdatedTicksHistoryStats({
            previous_ticks_history_stats: existing_ticks_history_stats,
            new_ticks_history_stats: [next_counter_initial_value.counter_value],
            last_tick_epoch: next_counter_initial_value.epoch,
        });
        expect(new_ticks_history).toEqual(expected_ticks_history_stats);
        expect(new_ticks_history.ticks_stayed_in).toHaveLength(existing_ticks_history_stats.ticks_stayed_in.length);
    });

    it('returns a new ticks_history_stats with a shifted ticks_stayed_in array of the same length & with new_ticks_history_stats[0] placed as 1st item when counter value === previous counter_value & an epoch > previous epoch', () => {
        const expected_ticks_history_stats = {
            ticks_stayed_in: [1, 1, 65, 1234, 675],
            last_tick_epoch: 1007,
        };
        const new_ticks_history = getUpdatedTicksHistoryStats({
            previous_ticks_history_stats: existing_ticks_history_stats,
            new_ticks_history_stats: [next_counter_latest_value.counter_value],
            last_tick_epoch: next_counter_latest_value.epoch,
        });
        expect(new_ticks_history).toEqual(expected_ticks_history_stats);
        expect(new_ticks_history.ticks_stayed_in).toHaveLength(existing_ticks_history_stats.ticks_stayed_in.length);
    });
});
