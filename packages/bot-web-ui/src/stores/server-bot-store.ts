import { action, makeObservable, observable } from 'mobx';
import { api_base } from '@deriv/bot-skeleton';
import RootStore from './root-store';
import { initial_req_schema } from '../pages/server-bot/request_schema';

interface IServerBotStore {
    bot_list: TBotListItem[];
    getBotList: () => void;
    createBot: () => void;
    removeBot: (bot_id: string) => void;
}

export type TBotListItem = {
    bot_id: string;
    name: string;
    status: string;
    strategy: string;
};

type TBotList = {
    bot_listing: Array<TBotListItem>;
    message: string;
    status: string;
};

type TBotListResponse = {
    bot_list: TBotList;
    echo_req: {
        bot_list: number;
        req_id: number;
    };
    msg_type: 'bot_list';
    req_id: number;
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
        /* eslint-disable no-unused-vars */
        const api_status = api_base.getConnectionStatus();
        setTimeout(() => {
            // eslint-disable-next-line
            // if (api_status === 'Connected') { // need handle the first loading
            api_base?.api
                ?.send({
                    bot_list: 1,
                })
                .then((data: TBotListResponse) => {
                    this.bot_list = data.bot_list.bot_listing;
                    return data.bot_list.bot_listing;
                })
                /* eslint-disable no-console */
                .catch((e: Error) => console.error('error: ', e));
        }, 2000);
    }

    createBot() {
        api_base.api
            ?.send(initial_req_schema)
            .catch((e: Error) => {
                /* eslint-disable no-console */
                console.error('error: ', e);
            })
            .then(() => this.getBotList());

        localStorage?.setItem(
            'qs-fields',
            JSON.stringify({ ...initial_req_schema.data.parameters, ...initial_req_schema.data.contract_parameters })
        );
    }

    removeBot(bot_id: string) {
        api_base.api
            ?.send({
                bot_remove: 1,
                bot_id,
            })
            .catch((e: Error) => {
                /* eslint-disable no-console */
                console.error('error: ', e);
            })
            .then(() => this.getBotList());
    }
}
