import { action, makeObservable, observable } from 'mobx';
import RootStore from './root-store';

interface IServerBotStore {
    bot_list: TBotListItem[];
    getBotList: () => void;
    createBot: () => void;
    removeBot: () => void;
}

export type TBotListItem = {
    bot_id: string;
    name: string;
    status: string;
    strategy: string;
};

export default class ServerBotStore implements IServerBotStore {
    bot_list: TBotListItem[] = [];
    root_store: RootStore;

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        makeObservable(this, {
            bot_list: observable,
            getBotList: action.bound,
            createBot: action.bound,
            removeBot: action.bound,
        });
    }

    getBotList() {
        this.bot_list = [];
    }
    createBot() {
        this.bot_list = [];
    }
    removeBot() {
        this.bot_list = [];
    }
}
