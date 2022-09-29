import { expect } from 'chai';
import { getUpdatedTicksHistoryStats } from '../accumulator';

describe('getUpdatedTicksHistoryStats', () => {
    const existing_ticks_history_stats = [
        { counter_value: 1, epoch: 1005 },
        { counter_value: 65, epoch: 1004 },
        { counter_value: 1234, epoch: 1003 },
        { counter_value: 675, epoch: 1002 },
        { counter_value: 234, epoch: 1001 },
    ];
    const new_ticks_history_stats = [
        { counter_value: 1573, epoch: 1006 },
        { counter_value: 33, epoch: 1007 },
        { counter_value: 423, epoch: 1008 },
        { counter_value: 2853, epoch: 1009 },
        { counter_value: 131, epoch: 1010 },
    ];
    const current_counter_same_value = { counter_value: 1, epoch: 1005 };
    const current_counter_new_value = { counter_value: 2, epoch: 1006 };
    const next_counter_initial_value = { counter_value: 0, epoch: 1006 };
    const next_counter_latest_value = { counter_value: 1, epoch: 1007 };

    it('returns a reversed new_ticks_history_stats when new_ticks_history_stats is an array', () => {
        const expected_array = [
            { counter_value: 131, epoch: 1010 },
            { counter_value: 2853, epoch: 1009 },
            { counter_value: 423, epoch: 1008 },
            { counter_value: 33, epoch: 1007 },
            { counter_value: 1573, epoch: 1006 },
        ];
        expect(getUpdatedTicksHistoryStats([], new_ticks_history_stats)).to.eql(expected_array);
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, new_ticks_history_stats)).to.eql(
            expected_array
        );
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, new_ticks_history_stats)).to.not.eql(
            existing_ticks_history_stats
        );
    });

    it('returns the same array when new_ticks_history_stats is undefined', () => {
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats)).to.eql(existing_ticks_history_stats);
    });

    it('returns the same array of objects when received a new_ticks_history_stats object containing the same value of the current counter', () => {
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, current_counter_same_value)).to.eql(
            existing_ticks_history_stats
        );
    });

    it('returns a new array of objects with first item replaced with a new_ticks_history_stats object containing a current counter new value', () => {
        const expected_array = [
            { counter_value: 2, epoch: 1006 },
            { counter_value: 65, epoch: 1004 },
            { counter_value: 1234, epoch: 1003 },
            { counter_value: 675, epoch: 1002 },
            { counter_value: 234, epoch: 1001 },
        ];
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, current_counter_new_value)).to.eql(
            expected_array
        );
    });

    it('returns a shifted array of the same length with new_ticks_history_stats object placed as 1st item when its a counter_value < a previous counter_value & an epoch > a previous epoch', () => {
        const expected_array = [
            { counter_value: 0, epoch: 1006 },
            { counter_value: 1, epoch: 1005 },
            { counter_value: 65, epoch: 1004 },
            { counter_value: 1234, epoch: 1003 },
            { counter_value: 675, epoch: 1002 },
        ];
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, next_counter_initial_value)).to.eql(
            expected_array
        );
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, next_counter_initial_value)).to.have.lengthOf(
            existing_ticks_history_stats.length
        );
    });

    it('returns a shifted array of the same length with new_ticks_history_stats object placed as 1st item when its a counter_value === a previous counter_value & an epoch > a previous epoch', () => {
        const expected_array = [
            { counter_value: 1, epoch: 1007 },
            { counter_value: 1, epoch: 1005 },
            { counter_value: 65, epoch: 1004 },
            { counter_value: 1234, epoch: 1003 },
            { counter_value: 675, epoch: 1002 },
        ];
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, next_counter_latest_value)).to.eql(
            expected_array
        );
        expect(getUpdatedTicksHistoryStats(existing_ticks_history_stats, next_counter_latest_value)).to.have.lengthOf(
            existing_ticks_history_stats.length
        );
    });
});
