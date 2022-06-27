import { getRoundedNumber } from '@deriv/shared';
import { sell, openContractReceived } from './state/actions';
import { contractStatus, contract as broadcastContract } from '../utils/broadcast';
import { doUntilDone } from '../utils/helpers';
import DBotStore from '../../../scratch/dbot-store';
import ws from '../../api/ws';
import $scope from '../utils/cliTools';

const setContractFlags = contract => {
    const { is_expired, is_valid_to_sell, is_sold } = contract;
    $scope.contract_flags.is_sold = Boolean(is_sold);
    $scope.contract_flags.is_sell_available = !$scope.contract_flags.is_sold && Boolean(is_valid_to_sell);
    $scope.contract_flags.is_expired = Boolean(is_expired);
};

const expectedContractId = contractId => {
    return $scope.contract_id && contractId === $scope.contract_id;
};

export default Engine =>
    class OpenContract extends Engine {
        observeOpenContract() {
            ws.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'proposal_open_contract') {
                    const contract = data.proposal_open_contract;

                    if (!contract && !expectedContractId(contract?.contract_id)) {
                        return;
                    }

                    setContractFlags(contract);

                    this.data.contract = contract;

                    broadcastContract({ accountID: $scope.account_info.loginid, ...contract });

                    if ($scope.contract_flags.is_sold) {
                        $scope.contract_id = '';
                        clearTimeout(this.transaction_recovery_timeout);
                        this.updateTotals(contract);
                        contractStatus({
                            id: 'contract.sold',
                            data: contract.transaction_ids.sell,
                            contract,
                        });

                        if (this.afterPromise) {
                            this.afterPromise();
                        }

                        this.store.dispatch(sell());
                    } else {
                        this.store.dispatch(openContractReceived());
                    }
                }
            });
        }

        waitForAfter() {
            return new Promise(resolve => {
                this.afterPromise = resolve;
            });
        }

        subscribeToOpenContract(contract_id = $scope.contract_id) {
            $scope.contract_id = contract_id;
            doUntilDone(() => ws.send({ proposal_open_contract: 1, contract_id, subscribe: 1 }))
                .then(data => {
                    const { populateConfig } = DBotStore.instance;
                    populateConfig(data.proposal_open_contract);
                    this.openContractId = data.proposal_open_contract.id;
                })
                .catch(error => {
                    if (error.error.code !== 'AlreadySubscribed') {
                        doUntilDone(() => ws.send({ proposal_open_contract: 1, contract_id, subscribe: 1 })).then(
                            response => (this.openContractId = response.proposal_open_contract.id)
                        );
                    }
                });
        }

        getSellPrice() {
            const { bid_price: bidPrice, buy_price: buyPrice, currency } = this.data.contract;
            return getRoundedNumber(Number(bidPrice) - Number(buyPrice), currency);
        }
    };
