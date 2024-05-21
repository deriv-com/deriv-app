import { makeObservable, observable, action } from 'mobx';
import { TRootStore } from 'Types';
import BaseStore from 'Stores/base-store';

export default class PositionsStore extends BaseStore {
    openContractTypeFilter: string[] = [];
    closedContractTypeFilter: string[] = [];

    constructor({ root_store }: { root_store: TRootStore }) {
        super({ root_store });

        makeObservable(this, {
            openContractTypeFilter: observable,
            closedContractTypeFilter: observable,
            addToClosedContractTypeFilter: action.bound,
        });
    }

    addToClosedContractTypeFilter(contractType: string) {
        this.closedContractTypeFilter = [...this.closedContractTypeFilter, contractType];
    }
}
