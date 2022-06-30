import { getRoundedNumber } from '@deriv/shared';
import { sell, openContractReceived } from './state/actions';
import { contractStatus, contract as broadcastContract } from '../utils/broadcast';
import { doUntilDone, createDetails } from '../utils/helpers';
import DBotStore from '../../../scratch/dbot-store';
import ws from '../../api/ws';
import $scope from '../utils/cliTools';
import Store from './state';
import { updateTotals } from './Total';

let afterPromise;

const setContractFlags = contract => {
    const { is_expired, is_valid_to_sell, is_sold } = contract;
    $scope.contract_flags.is_sold = Boolean(is_sold);
    $scope.contract_flags.is_sell_available = !$scope.contract_flags.is_sold && Boolean(is_valid_to_sell);
    $scope.contract_flags.is_expired = Boolean(is_expired);
};

const expectedContractId = contractId => {
    return $scope.contract_id && contractId === $scope.contract_id;
};

export const getDetail = i => createDetails($scope.data.contract)[i];

export const getSellPrice = () => {
    const { bid_price: bidPrice, buy_price: buyPrice, currency } = $scope.data.contract;
    return getRoundedNumber(Number(bidPrice) - Number(buyPrice), currency);
};

export const isResult = result => getDetail(10) === result;

export const observeOpenContract = () => {
    ws.onMessage().subscribe(({ data }) => {
        if (data.msg_type === 'proposal_open_contract') {
            const contract = data.proposal_open_contract;

            if (!contract && !expectedContractId(contract?.contract_id)) {
                return;
            }

            setContractFlags(contract);

            $scope.data.contract = contract;

            broadcastContract({ accountID: $scope.account_info.loginid, ...contract });

            if ($scope.contract_flags.is_sold) {
                $scope.contract_id = '';
                clearTimeout($scope.transaction_recovery_timeout);
                updateTotals(contract);
                contractStatus({
                    id: 'contract.sold',
                    data: contract.transaction_ids.sell,
                    contract,
                });

                if (afterPromise) {
                    afterPromise();
                }

                Store.dispatch(sell());
            } else {
                Store.dispatch(openContractReceived());
            }
        }
    });
};

export const readDetails = i => getDetail(i - 1);

export const subscribeToOpenContract = (contract_id = $scope.contract_id) => {
    $scope.contract_id = contract_id;
    doUntilDone(() => ws.send({ proposal_open_contract: 1, contract_id, subscribe: 1 }))
        .then(data => {
            const { populateConfig } = DBotStore.instance;
            populateConfig(data.proposal_open_contract);
            $scope.open_contract_id = data.proposal_open_contract.id;
        })
        .catch(error => {
            if (error.error.code !== 'AlreadySubscribed') {
                doUntilDone(() => ws.send({ proposal_open_contract: 1, contract_id, subscribe: 1 })).then(
                    response => ($scope.open_contract_id = response.proposal_open_contract.id)
                );
            }
        });
};

export const waitForAfter = () => {
    return new Promise(resolve => {
        afterPromise = resolve;
    });
};
