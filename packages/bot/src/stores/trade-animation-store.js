import { observable, action, reaction } from 'mobx';

export default class TradeAnimationStore {
    constructor(root_store) {
        this.root_store = root_store;
    }

    @observable status_class = ['', '', ''];
    @observable reactions = [];

    @action.bound onMount () {
        const contract_status_reaction = reaction(() => this.root_store.run_panel.contract_stage, contract_stage => {
            const { index } = contract_stage;
            const progress_status = index - (index === 3 ? 2 : 1);

            const status_class_temp = observable(['', '', '']);
            if (progress_status >= 0 && progress_status < status_class_temp.length) {
                status_class_temp[progress_status] =  'active';
            }

            if (progress_status) {
                for (let i = 0; i < progress_status; i++) {
                    status_class_temp[i] = 'completed';
                }
            }
            this.status_class = status_class_temp;
        });

        this.reactions.push(contract_status_reaction);
    }

    @action.bound onUnMount() {
        this.reactions.forEach(react => {
            react();
        });
    }
}
