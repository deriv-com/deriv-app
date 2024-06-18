import { configure } from 'mobx';
import { ChartBarrierStore } from '../chart-barrier-store';
import { BARRIER_COLORS, BARRIER_LINE_STYLES, CONTRACT_SHADES, DEFAULT_SHADES } from '../../constants';
import { CONTRACT_TYPES } from '../../contract';

type TOnChartBarrierChange = (high: string, low?: string) => void;

configure({ safeDescriptors: false });

let mockedChartBarrierStore: ChartBarrierStore;
const initialHigh = '1.234';
const initialLow = '1.200';
const newBarriersData = { high: '+0.12', low: '-0.12', title: 'new title', hidePriceLines: true };
const newBarriersValuesArray = Object.values(newBarriersData) as [string, string, string];

beforeEach(async () => {
    mockedChartBarrierStore = new ChartBarrierStore(initialHigh, initialLow, jest.fn(), {
        not_draggable: true,
        color: BARRIER_COLORS.BLUE,
        line_style: BARRIER_LINE_STYLES.SOLID,
        hideBarrierLine: false,
        shade: DEFAULT_SHADES['2'],
    });
});

describe('ChartBarrierStore', () => {
    it('should be initialized with properties', () => {
        expect(mockedChartBarrierStore.barrier_count).toEqual(2);
        expect(mockedChartBarrierStore.default_shade).toEqual(
            DEFAULT_SHADES[mockedChartBarrierStore.barrier_count as keyof typeof DEFAULT_SHADES]
        );
        expect(mockedChartBarrierStore.draggable).toEqual(false);
    });
    it('should have draggable as true when initialized with not_draggable: false', () => {
        mockedChartBarrierStore = new ChartBarrierStore(initialHigh, undefined, jest.fn(), {
            not_draggable: false,
        });
        expect(mockedChartBarrierStore.draggable).toEqual(true);
    });
    it('should have high_barrier as 0 when initialized with empty args', () => {
        mockedChartBarrierStore = new ChartBarrierStore();
        expect(mockedChartBarrierStore.high).toEqual(0);
    });
    describe('updateBarriers', () => {
        it('should update high barrier to the new value, and update low barrier to undefined if only high is provided', () => {
            mockedChartBarrierStore.updateBarriers(newBarriersData.high);
            expect(mockedChartBarrierStore.high).toEqual(newBarriersData.high);
            expect(mockedChartBarrierStore.low).toEqual(undefined);
        });
        it('should update low barrier to the new value, and update high barrier to undefined if only low is provided', () => {
            mockedChartBarrierStore.updateBarriers('', newBarriersData.low);
            expect(mockedChartBarrierStore.high).toEqual(undefined);
            expect(mockedChartBarrierStore.low).toEqual(newBarriersData.low);
        });
        it('should update high & low barriers, and title when provided, and should not update title if it is not passed', () => {
            mockedChartBarrierStore.updateBarriers(...newBarriersValuesArray);
            expect(mockedChartBarrierStore.high).toEqual(newBarriersData.high);
            expect(mockedChartBarrierStore.low).toEqual(newBarriersData.low);
            expect(mockedChartBarrierStore.title).toEqual(newBarriersData.title);

            mockedChartBarrierStore.updateBarriers(initialHigh);
            expect(mockedChartBarrierStore.title).toEqual(newBarriersData.title);
        });
        it('should not update hidePriceLines if not provided, and should update it otherwise', () => {
            mockedChartBarrierStore.updateBarriers(initialHigh);
            expect(mockedChartBarrierStore.hidePriceLines).toEqual(false);

            mockedChartBarrierStore.updateBarriers(...newBarriersValuesArray);
            expect(mockedChartBarrierStore.hidePriceLines).toEqual(newBarriersData.hidePriceLines);
        });
        it('should update relative property if isFromChart === false', () => {
            expect(mockedChartBarrierStore.relative).toEqual(false);

            mockedChartBarrierStore.updateBarriers(...newBarriersValuesArray);
            expect(mockedChartBarrierStore.relative).toEqual(true);
        });
        it('should not update relative property if isFromChart === true', () => {
            expect(mockedChartBarrierStore.relative).toEqual(false);

            mockedChartBarrierStore.updateBarriers(...newBarriersValuesArray, true);
            expect(mockedChartBarrierStore.relative).toEqual(false);
        });
    });
    describe('updateBarrierShade', () => {
        it('should set a shade for a contract if should_display === true, otherwise - a default shade', () => {
            mockedChartBarrierStore.updateBarrierShade(true, CONTRACT_TYPES.ACCUMULATOR);
            expect(mockedChartBarrierStore.shade).toEqual(CONTRACT_SHADES.ACCU);
            mockedChartBarrierStore.updateBarrierShade(false, CONTRACT_TYPES.ACCUMULATOR);
            expect(mockedChartBarrierStore.shade).toEqual(
                DEFAULT_SHADES[mockedChartBarrierStore.barrier_count as keyof typeof DEFAULT_SHADES]
            );
        });
    });
    describe('onChange', () => {
        it('should call updateBarriers() and onChartBarrierChange() methods', () => {
            const spyUpdateBarriers = jest.spyOn(mockedChartBarrierStore, 'updateBarriers');
            const spyOnChartBarrierChange = jest.spyOn(
                mockedChartBarrierStore,
                'onChartBarrierChange' as keyof TOnChartBarrierChange
            );
            mockedChartBarrierStore.onChange(newBarriersData);
            expect(spyUpdateBarriers).toHaveBeenCalledWith(...newBarriersValuesArray, true);
            expect(spyOnChartBarrierChange).toHaveBeenCalledWith(newBarriersData.high, newBarriersData.low);
        });
        it('should call updateBarriers() and onChartBarrierChange() methods even if the latter was not provided during store initialization', () => {
            mockedChartBarrierStore = new ChartBarrierStore();
            const spyUpdateBarriers = jest.spyOn(mockedChartBarrierStore, 'updateBarriers');
            const spyOnChartBarrierChange = jest.spyOn(
                mockedChartBarrierStore,
                'onChartBarrierChange' as keyof TOnChartBarrierChange
            );
            mockedChartBarrierStore.onChange(newBarriersData);
            expect(spyUpdateBarriers).toHaveBeenCalledWith(...newBarriersValuesArray, true);
            expect(spyOnChartBarrierChange).toHaveBeenCalledWith(newBarriersData.high, newBarriersData.low);
        });
    });
    describe('onChartBarrierChange', () => {
        it('should be called when onChange() is called', () => {
            const spyOnChartBarrierChange = jest.spyOn(
                mockedChartBarrierStore,
                'onChartBarrierChange' as keyof TOnChartBarrierChange
            );
            mockedChartBarrierStore.onChange(newBarriersData);
            expect(spyOnChartBarrierChange).toHaveBeenCalledWith(newBarriersData.high, newBarriersData.low);
        });
    });
});
