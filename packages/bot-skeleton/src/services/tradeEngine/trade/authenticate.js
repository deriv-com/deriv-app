import { observeBalance } from './balance';
import { doUntilDone } from '../utils/helpers';
import { observer as globalObserver } from '../../../utils/observer';
import api from '../../api/ws';
import { $scope } from './state';

export const loginAndGetBalance = token => {
    if ($scope.token === token) {
        return Promise.resolve();
    }

    doUntilDone(() => api.authorize(token)).catch(e => {
        globalObserver.emit('Error', e);
    });
    return new Promise(resolve => {
        // Try to recover from a situation where API doesn't give us a correct response on
        // "proposal_open_contract" which would make the bot run forever. When there's a "sell"
        // event, wait a couple seconds for the API to give us the correct "proposal_open_contract"
        // response, if there's none after x seconds. Send an explicit request, which _should_
        // solve the issue. This is a backup!
        api.onMessage().subscribe(({ data }) => {
            if (data.msg_type === 'transaction' && data.transaction.action === 'sell') {
                $scope.transaction_recovery_timeout = setTimeout(() => {
                    const { contract } = $scope.data;
                    const is_same_contract = contract.contract_id === data.transaction.contract_id;
                    const is_open_contract = contract.status === 'open';
                    if (is_same_contract && is_open_contract) {
                        doUntilDone(() => {
                            api.send({ proposal_open_contract: 1, contract_id: contract.contract_id });
                        }, ['PriceMoved']);
                    }
                }, 1500);
            }
            if (data.msg_type === 'authorize') {
                $scope.account_info = data.authorize;
                $scope.token = token;
                if (data?.authorize?.loginid) {
                    observeBalance(data.loginid);
                }
                // Only subscribe to balance in browser, not for tests.
                if (document) {
                    doUntilDone(() => api.send({ balance: 1, subscribe: 1 })).then(r => {
                        $scope.balance = Number(r.balance.balance);
                        resolve();
                    });
                } else {
                    resolve();
                }
                doUntilDone(() => api.send({ transaction: 1, subscribe: 1 }));
            }
        });
    });
};
