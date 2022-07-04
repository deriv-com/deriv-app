import { getRoundedNumber, formatTime } from '@deriv/shared';
import { updateTotals } from './total';
import Store, { sell, openContractReceived, $scope, Services } from './state';
import { doUntilDone, contractStatus, contract as broadcastContract } from './utils';

let afterPromise;

const createDetails = contract => {
    const { sell_price: sellPrice, buy_price: buyPrice, currency } = contract;
    const profit = getRoundedNumber(sellPrice - buyPrice, currency);
    const result = profit < 0 ? 'loss' : 'win';

    return [
        contract.transaction_ids.buy,
        +contract.buy_price,
        +contract.sell_price,
        profit,
        contract.contract_type,
        formatTime(parseInt(`${contract.entry_tick_time}000`), 'HH:mm:ss'),
        +contract.entry_tick,
        formatTime(parseInt(`${contract.exit_tick_time}000`), 'HH:mm:ss'),
        +contract.exit_tick,
        +(contract.barrier ? contract.barrier : 0),
        result,
    ];
};

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
    Services.api.onMessage().subscribe(({ data }) => {
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
    doUntilDone(() => Services.api.send({ proposal_open_contract: 1, contract_id, subscribe: 1 }))
        .then(data => {
            Services.populateConfig(data.proposal_open_contract);
            $scope.open_contract_id = data.proposal_open_contract.id;
        })
        .catch(error => {
            if (error.error.code !== 'AlreadySubscribed') {
                doUntilDone(() => Services.api.send({ proposal_open_contract: 1, contract_id, subscribe: 1 })).then(
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
