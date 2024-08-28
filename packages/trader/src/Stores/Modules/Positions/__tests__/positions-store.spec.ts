import { mockStore } from '@deriv/stores';
import PositionsStore from '../positions-store';
import { configure } from 'mobx';
import { TRootStore } from 'Types';

configure({ safeDescriptors: false });

let mockedPositionsStore: PositionsStore;

beforeAll(async () => {
    mockedPositionsStore = new PositionsStore({
        root_store: mockStore({}) as unknown as TRootStore,
    });
});

describe('PositionsStore', () => {
    describe('setClosedContractTypeFilter', () => {
        it('should set closedContractTypeFilter', () => {
            mockedPositionsStore.setClosedContractTypeFilter(['Accumulators']);
            expect(mockedPositionsStore.closedContractTypeFilter).toEqual(['Accumulators']);
            expect(mockedPositionsStore.filteredContractTypes).toEqual(['ACCU']);
            mockedPositionsStore.setClosedContractTypeFilter([]);
            expect(mockedPositionsStore.closedContractTypeFilter).toEqual([]);
            expect(mockedPositionsStore.filteredContractTypes).toEqual([]);
        });
    });
    describe('setOpenContractTypeFilter', () => {
        it('should set openContractTypeFilter', () => {
            mockedPositionsStore.setOpenContractTypeFilter(['Rise/Fall']);
            expect(mockedPositionsStore.openContractTypeFilter).toEqual(['Rise/Fall']);
            mockedPositionsStore.setOpenContractTypeFilter([]);
            expect(mockedPositionsStore.openContractTypeFilter).toEqual([]);
        });
    });
    describe('setTimeFilter', () => {
        it('should set timeFilter', () => {
            mockedPositionsStore.setTimeFilter('All time');
            expect(mockedPositionsStore.timeFilter).toEqual('All time');
            mockedPositionsStore.setTimeFilter();
            expect(mockedPositionsStore.timeFilter).toEqual('');
        });
    });
    describe('setCustomTimeRangeFilter', () => {
        it('should set customTimeRangeFilter', () => {
            mockedPositionsStore.setCustomTimeRangeFilter('25 May 2024');
            expect(mockedPositionsStore.customTimeRangeFilter).toEqual('25 May 2024');
            mockedPositionsStore.setCustomTimeRangeFilter();
            expect(mockedPositionsStore.customTimeRangeFilter).toEqual('');
        });
    });
    describe('setDateFrom', () => {
        it('should set dateFrom', () => {
            mockedPositionsStore.setDateFrom(123424262);
            expect(mockedPositionsStore.dateFrom).toEqual(123424262);
            mockedPositionsStore.setDateFrom(null);
            expect(mockedPositionsStore.dateFrom).toEqual(null);
        });
    });
    describe('setDateTo', () => {
        it('should set dateTo', () => {
            mockedPositionsStore.setDateTo(12346779);
            expect(mockedPositionsStore.dateTo).toEqual(12346779);
            mockedPositionsStore.setDateTo(null);
            expect(mockedPositionsStore.dateTo).toEqual(null);
        });
    });
    describe('onUnmount', () => {
        it('should reset all filters, when onUnmount is called', () => {
            mockedPositionsStore.setDateTo(12346779);
            mockedPositionsStore.setDateFrom(123424262);
            mockedPositionsStore.setCustomTimeRangeFilter('25 May 2024');
            mockedPositionsStore.setTimeFilter('All time');
            mockedPositionsStore.setOpenContractTypeFilter(['Rise/Fall']);
            mockedPositionsStore.setClosedContractTypeFilter(['Accumulators']);

            mockedPositionsStore.onUnmount();

            expect(mockedPositionsStore.dateTo).toEqual(null);
            expect(mockedPositionsStore.dateFrom).toEqual(null);
            expect(mockedPositionsStore.customTimeRangeFilter).toEqual('');
            expect(mockedPositionsStore.timeFilter).toEqual('');
            expect(mockedPositionsStore.openContractTypeFilter).toEqual([]);
            expect(mockedPositionsStore.closedContractTypeFilter).toEqual([]);
        });
    });
});
