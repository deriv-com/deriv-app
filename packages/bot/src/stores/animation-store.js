import { observable, action, computed } from 'mobx';

export default class AnimationStore {
    
    @observable contract_status = 0;

    @action.bound setContractStatus = status => {
        this.contract_status = status;
    }

    @computed get getContractStatus () {
        return this.contract_status;
    }
}
