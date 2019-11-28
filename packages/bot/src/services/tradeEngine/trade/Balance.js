import { getFormatedText } from 'deriv-shared/utils/currency';
import ScratchStore        from '../../../stores/scratch-store';
import { info }            from '../utils/broadcast';

let balanceStr = '';

export default Engine =>
    class Balance extends Engine {
        observeBalance() {
            this.listen('balance', r => {
                const {
                    balance: { balance: b, currency },
                } = r;

                balanceStr = getFormatedText(b, currency);

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
                balanceStr = getFormatedText(value, ScratchStore.core.client.currency, false);
            }

            return type === 'STR' ? balanceStr : Number(balance);
        }
    };
