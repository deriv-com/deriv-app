import BotStore from './bot-store';
import AccountsStore from './accounts-store';

export default class RootStore {
    bot = new BotStore();
    accounts = new AccountsStore();
}
