import { makeObservable, observable, action } from 'mobx';
import { TRootStore } from 'Types';
import { getFilteredContractTypes } from 'AppV2/Utils/positions-utils';
import BaseStore from 'Stores/base-store';

export default class PositionsStore extends BaseStore {
    openContractTypeFilter: string[] | [] = [];
    closedContractTypeFilter: string[] | [] = [];
    filteredContractTypes: string[] | [] = [];
    timeFilter = '';
    customTimeRangeFilter = '';

    constructor({ root_store }: { root_store: TRootStore }) {
        super({ root_store });

        makeObservable(this, {
            openContractTypeFilter: observable,
            closedContractTypeFilter: observable,
            timeFilter: observable,
            customTimeRangeFilter: observable,
            setClosedContractTypeFilter: action.bound,
            setOpenContractTypeFilter: action.bound,
            setTimeFilter: action.bound,
            setCustomTimeRangeFilter: action.bound,
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
}
