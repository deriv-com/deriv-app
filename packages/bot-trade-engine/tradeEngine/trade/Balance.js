import { getFormattedText } from '@deriv/shared';
import { info } from '../utils/broadcast';
// import DBotStore from '../../../scratch/dbot-store';
import { api_base } from '../../api/api-base';

let balance_string = '';

export default Engine =>
    class Balance extends Engine {
        observeBalance() {
            if (!api_base.api) return;
            const subscription = api_base.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'balance') {
                    const {
                        balance: { balance: b, currency },
                    } = data;

                    balance_string = getFormattedText(b, currency);

                    api_base.account_balance = data.balance.accounts;

                    if (this.accountInfo) info({ accountID: this.accountInfo.loginid, balance: balance_string });
                }
            });
            api_base.pushSubscription(subscription);
        }

        // eslint-disable-next-line class-methods-use-this
        getBalance(type) {
            const balance = api_base?.account_balance[`${api_base.account_id}`].balance || 0;

            balance_string = getFormattedText(
                balance,
                api_base?.account_balance[`${api_base.account_id}`].currency || 'USD',
                false
            );
            return type === 'STR' ? balance_string : balance;
        }
    };
