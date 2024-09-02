import { makeObservable, observable, action, override } from 'mobx';
import { TRootStore } from 'Types';
import { getFilteredContractTypes } from 'AppV2/Utils/positions-utils';
import BaseStore from 'Stores/base-store';

export default class PositionsStore extends BaseStore {
    openContractTypeFilter: string[] | [] = [];
    closedContractTypeFilter: string[] | [] = [];
    filteredContractTypes: string[] | [] = [];
    timeFilter = '';
    customTimeRangeFilter = '';
    dateFrom: number | null = null;
    dateTo: number | null = null;

    constructor({ root_store }: { root_store: TRootStore }) {
        super({ root_store });

        makeObservable(this, {
            openContractTypeFilter: observable,
            closedContractTypeFilter: observable,
            timeFilter: observable,
            customTimeRangeFilter: observable,
            dateFrom: observable,
            dateTo: observable,
            setClosedContractTypeFilter: action.bound,
            setOpenContractTypeFilter: action.bound,
            setTimeFilter: action.bound,
            setCustomTimeRangeFilter: action.bound,
            setDateFrom: action.bound,
            setDateTo: action.bound,
            onUnmount: override,
        });
    }

    setClosedContractTypeFilter(contractTypes: string[] | []) {
        this.closedContractTypeFilter = [...contractTypes];
        this.filteredContractTypes = getFilteredContractTypes(contractTypes);
    }

    setOpenContractTypeFilter(contractTypes: string[] | []) {
        this.openContractTypeFilter = [...contractTypes];
    }

    setTimeFilter(newTimeFilter?: string) {
        this.timeFilter = newTimeFilter || '';
    }

    setCustomTimeRangeFilter(newCustomTimeFilter?: string) {
        this.customTimeRangeFilter = newCustomTimeFilter || '';
    }

    setDateFrom(newDateFrom: number | null) {
        this.dateFrom = newDateFrom;
    }

    setDateTo(newDateTo: number | null) {
        this.dateTo = newDateTo;
    }

    onUnmount() {
        this.setClosedContractTypeFilter([]);
        this.setOpenContractTypeFilter([]);
        this.setTimeFilter('');
        this.setCustomTimeRangeFilter('');
        this.setDateFrom(null);
        this.setDateTo(null);
    }
}
