import { action, computed, observable, makeObservable } from 'mobx';
import { BARRIER_LINE_STYLES, CONTRACT_SHADES, DEFAULT_SHADES } from '../constants';
import { barriersToString } from './barriers';

type TOnChartBarrierChange = null | ((barrier_1: string, barrier_2?: string) => void);
type TOnChangeParams = { high: string | number; low?: string | number; title?: string; hidePriceLines?: boolean };
type TChartBarrierStoreOptions =
    | {
          color?: string;
          hideBarrierLine?: boolean;
          line_style?: string;
          not_draggable?: boolean;
          shade?: string;
      }
    | Record<string, never>;

export class ChartBarrierStore {
    color?: string;
    lineStyle: string;
    shade?: string;
    shadeColor?: string;
    high?: string | number;
    low?: string | number;
    onChange: (barriers: TOnChangeParams) => void;
    relative: boolean;
    draggable: boolean;
    hidePriceLines: boolean;
    hideBarrierLine?: boolean;
    hideOffscreenLine?: boolean;
    title?: string;
    onChartBarrierChange: TOnChartBarrierChange | null;

    constructor(
        high_barrier?: string | number,
        low_barrier?: string | number,
        onChartBarrierChange: TOnChartBarrierChange = null,
        { color, hideBarrierLine, line_style, not_draggable, shade }: TChartBarrierStoreOptions = {}
    ) {
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
            barrier_count: computed,
            default_shade: computed,
        });

        this.color = color;
        this.hideBarrierLine = hideBarrierLine;
        this.lineStyle = line_style || BARRIER_LINE_STYLES.SOLID;
        this.onChange = this.onBarrierChange;

        // trade_store's action to process new barriers on dragged
        this.onChartBarrierChange =
            typeof onChartBarrierChange === 'function' ? onChartBarrierChange.bind(this) : () => undefined;

        this.high = high_barrier || 0; // 0 to follow the price
        if (low_barrier) {
            this.low = low_barrier;
        }

        this.shade = shade ?? this.default_shade;

        const has_barrier = !!high_barrier;
        this.relative = !has_barrier || /^[+-]/.test(high_barrier.toString());
        this.draggable = !not_draggable && has_barrier;
        this.hidePriceLines = !has_barrier;
    }

    updateBarriers(
        high: string | number,
        low?: string | number,
        title?: string,
        hidePriceLines?: boolean,
        isFromChart = false
    ) {
        if (!isFromChart) {
            this.relative = /^[+-]/.test(high.toString());
        }
        this.high = high || undefined;
        this.low = low || undefined;
        this.title = title ?? this.title;
        this.hidePriceLines = hidePriceLines ?? this.hidePriceLines;
    }

    updateBarrierShade(should_display: boolean, contract_type: string) {
        this.shade =
            (should_display && CONTRACT_SHADES[contract_type as keyof typeof CONTRACT_SHADES]) || this.default_shade;
    }

    onBarrierChange({ high, low, title, hidePriceLines }: TOnChangeParams) {
        this.updateBarriers(high, low, title, hidePriceLines, true);
        this.onChartBarrierChange?.(...(barriersToString(this.relative, high, low) as [string, string | undefined]));
    }

    get barrier_count(): number {
        return +(typeof this.high !== 'undefined') + +(typeof this.low !== 'undefined');
    }

    get default_shade() {
        return DEFAULT_SHADES[this.barrier_count as keyof typeof DEFAULT_SHADES];
    }
}
