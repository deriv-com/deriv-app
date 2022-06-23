import { getFormattedText } from '@deriv/shared';
import { info } from '../utils/broadcast';
import DBotStore from '../../../scratch/dbot-store';
import ws from '../../api/ws';

let balance_string = '';

export const observeBalance = loginid => {
    ws.onMessage().subscribe(({ data }) => {
        if (data.msg_type === 'balance') {
            const {
                balance: { balance: b, currency },
            } = data;

            balance_string = getFormattedText(b, currency);

            info({ accountID: loginid, balance: balance_string });
        }
    });
};
export const getBalance = type => {
    // [Todo] remove DBotStore dependency and use ws
    const { client } = DBotStore.instance;
    const balance = (client && client.balance) || 0;

    balance_string = getFormattedText(balance, client.currency, false);
    return type === 'STR' ? balance_string : balance;
};
