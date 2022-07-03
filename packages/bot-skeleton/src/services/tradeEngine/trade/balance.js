import { getFormattedText } from '@deriv/shared';
import { info } from '../utils';
import ws from '../../api/ws';
import Store, { updateBalanceAction, $scope } from './state';

let balance_string = '';

export const getBalance = type => {
    const { balance, currency } = Store.getState().client;

    balance_string = getFormattedText(balance, currency, false);
    return type === 'STR' ? balance_string : balance;
};

export const observeBalance = loginid => {
    ws.onMessage().subscribe(({ data }) => {
        if (data.msg_type === 'balance') {
            const {
                balance: { balance: b, currency },
            } = data;
            $scope.balance = Number(b, currency);
            Store.dispatch(updateBalanceAction({ balance: b, currency }));
            balance_string = getFormattedText(b, currency);

            info({ accountID: loginid, balance: balance_string });
        }
    });
};
