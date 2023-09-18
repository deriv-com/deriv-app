import { action, makeObservable, observable } from 'mobx';
// import { api_base, ApiHelpers } from '@deriv/bot-skeleton';
import RootStore from './root-store';

interface IServerBot {
    bot_list: TBotListItem[];
    getBotList: () => void;
}

export type TBotListItem = {
    bot_id: string;
    name: string;
    status: string;
    strategy: string;
};

export default class ServerBot implements IServerBot {
    bot_list: TBotListItem[] = [];
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        makeObservable(this, {
            bot_list: observable,
            getBotList: action.bound,
        });
    }

    getBotList() {
        // eslint-disable-next-line no-console
        console.log(this.bot_list);
    }
}
