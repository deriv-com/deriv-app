import { getFormattedText } from 'deriv-shared/utils/currency';
import { info }             from '../utils/broadcast';
import { client }           from '../utils/client';

let balanceStr = '';

export default Engine =>
    class Balance extends Engine {
        observeBalance() {
            this.listen('balance', r => {
                const {
                    balance: { balance: b, currency },
                } = r;

                balanceStr = getFormattedText(b, currency);

                info({ accountID: this.accountInfo.loginid, balance: balanceStr });
            });
        }

        // eslint-disable-next-line class-methods-use-this
        getBalance(type) {
            const { scope } = this.store.getState();
            const { balance } = this;

            // Deduct trade `amount` in this scope for correct value in `balance`-block
            if (scope === 'BEFORE_PURCHASE') {
                const value = Number(balance) - this.tradeOptions.amount;
                balanceStr = getFormattedText(value, client.currency, false);
            }

            return type === 'STR' ? balanceStr : Number(balance);
        }
    };
