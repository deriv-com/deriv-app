import { action, computed, observable, makeObservable } from 'mobx';
import { BARRIER_COLORS, BARRIER_LINE_STYLES, CONTRACT_SHADES, DEFAULT_SHADES } from './Constants/barriers';
import { barriersToString } from './Helpers/barriers';

export class ChartBarrierStore {
    color;
    lineStyle;
    shade;
    shadeColor;

    high;
    low;

    relative;
    draggable;

    hidePriceLines;
    hideBarrierLine;
    hideOffscreenLine;
    title;

    onChartBarrierChange;

    constructor(high_barrier, low_barrier, onChartBarrierChange = null, { color, line_style, not_draggable } = {}) {
        makeObservable(this, {
            color: observable,
            lineStyle: observable,
            shade: observable,
            shadeColor: observable,
            high: observable,
            low: observable,
            relative: observable,
            draggable: observable,
            hidePriceLines: observable,
            hideBarrierLine: observable,
            hideOffscreenLine: observable,
            title: observable,
            updateBarriers: action.bound,
            updateBarrierShade: action.bound,
            onBarrierChange: action.bound,
            updateBarrierColor: action.bound,
            barrier_count: computed,
            default_shade: computed,
        });

        this.color = color;
        this.lineStyle = line_style || BARRIER_LINE_STYLES.SOLID;
        this.onChange = this.onBarrierChange;

        // trade_store's action to process new barriers on dragged
        this.onChartBarrierChange =
            typeof onChartBarrierChange === 'function' ? onChartBarrierChange.bind(this) : () => {};

        this.high = +high_barrier || 0; // 0 to follow the price
        if (low_barrier) {
            this.low = +low_barrier;
        }

        this.shade = this.default_shade;

        const has_barrier = !!high_barrier;
        this.relative = !has_barrier || /^[+-]/.test(high_barrier);
        this.draggable = !not_draggable && has_barrier;
        this.hidePriceLines = !has_barrier;
    }

    updateBarriers(high, low, isFromChart = false) {
        if (!isFromChart) {
            this.relative = /^[+-]/.test(high);
        }
        this.high = +high || undefined;
        this.low = +low || undefined;
    }

    updateBarrierShade(should_display, contract_type) {
        this.shade = (should_display && CONTRACT_SHADES[contract_type]) || this.default_shade;
    }

    onBarrierChange({ high, low }) {
        this.updateBarriers(high, low, true);
        this.onChartBarrierChange(...barriersToString(this.relative, high, low));
    }

    updateBarrierColor(is_dark_mode) {
        this.color = is_dark_mode ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY;
    }

    get barrier_count() {
        return (typeof this.high !== 'undefined') + (typeof this.low !== 'undefined');
    }

    get default_shade() {
        return DEFAULT_SHADES[this.barrier_count];
    }
}
