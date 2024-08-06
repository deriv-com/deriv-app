import TicksService from '@deriv/bot-skeleton/src/services/api/ticks_service';
import { getUpdatedTicksHistoryStats, ROW_SIZES } from './utils';

interface AccumlatorStatsProps {
    accumlator_stats: [];
    ticks_history_stats: [];
    addAccumlatorStats: (accumlator_stats: []) => void;
}

export default class Accumlators implements AccumlatorStatsProps {
    accumlator_stats: [];
    ticks_history_stats: [];

    constructor() {
        this.accumlator_stats = [];
        this.ticks_history_stats = [];
    }

    addAccumlatorStats(accumlator_stats: []) {
        this.accumlator_stats.push(accumlator_stats);
    }

    static getAccumlatorStats() {
        const tick_service = new TicksService();
        //console.log(tick_service, 'test tick service');
        tick_service.request({ symbol: 'R_50', granularity: 60 }).then(tick_service_response => {
            //console.log(tick_service_response, 'test response');
        });

        // const ticks_history_stats = getUpdatedTicksHistoryStats({
        //     previous_ticks_history_stats:  [],
        //     new_ticks_history_stats: [],
        //     last_tick_epoch: [],
        // });

        // const ticks_history = ticks_history_stats?.ticks_stayed_in ?? [];
        // const tick_history = ticks_history.reduce((acc: number[][], _el, index) => {
        //     const desktop_row_size = ROW_SIZES.DESKTOP_COLLAPSED;
        //     const mobile_row_size = ROW_SIZES.MOBILE_COLLAPSED;
        //     const row_size = desktop_row_size;
        //     if (index % row_size === 0) {
        //         acc.push(ticks_history.slice(index, index + row_size));
        //     }
        //     console.log(acc, 'test acc');
        //     return acc;
        // }, []);

        // console.log(tick_history);
    }
}
