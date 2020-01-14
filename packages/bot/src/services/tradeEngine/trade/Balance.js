import { getFormattedText } from '@deriv/shared/utils/currency';
import { info }            from '../utils/broadcast';
import ScratchStore        from '../../../stores/scratch-store';

let balance_string = '';

export default Engine =>
    class Balance extends Engine {
        observeBalance() {
            this.listen('balance', r => {
                const {
                    balance: { balance: b, currency },
                } = r;

                balance_string = getFormattedText(b, currency);

                info({ accountID: this.accountInfo.loginid, balance: balance_string });
            });
        }

        // eslint-disable-next-line class-methods-use-this
        getBalance(type) {
            const { client } = ScratchStore.instance.root_store.core;
            const { scope }  = this.store.getState();
            const balance    = client.balance || 0;
            let value        = balance;

            if (scope === 'BEFORE_PURCHASE') {
                // Deduct trade amount in this scope for correct (🤦) value in balance-block
                value = Number(balance) - this.tradeOptions.amount;
            }

            balance_string = getFormattedText(value, client.currency, false);
            return type === 'STR' ? balance_string : balance;
        }
    };
