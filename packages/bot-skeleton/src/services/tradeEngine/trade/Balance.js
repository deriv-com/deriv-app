import { getFormattedText } from '@deriv/shared';
import { info } from '../utils/broadcast';
import DBotStore from '../../../scratch/dbot-store';

let balance_string = '';

export default Engine =>
    class Balance extends Engine {
        observeBalance() {
            this.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'balance') {
                    const {
                        balance: { balance: b, currency },
                    } = data;

                    balance_string = getFormattedText(b, currency);

                    info({ accountID: this.accountInfo.loginid, balance: balance_string });
                }
            });
        }

        // eslint-disable-next-line class-methods-use-this
        getBalance(type) {
            const { scope } = this.store.getState();
            const { client } = DBotStore.instance;
            const balance = (client && client.balance) || 0;
            let value = balance;

            if (scope === 'BEFORE_PURCHASE') {
                // Deduct trade amount in this scope for correct (🤦) value in balance-block
                value = Number(balance) - this.tradeOptions.amount;
            }

            balance_string = getFormattedText(value, client.currency, false);
            return type === 'STR' ? balance_string : balance;
        }
    };
