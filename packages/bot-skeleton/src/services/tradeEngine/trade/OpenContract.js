import { getRoundedNumber } from '@deriv/shared';
import { sell, openContractReceived } from './state/actions';
import { contractStatus, contract as broadcastContract } from '../utils/broadcast';
import { doUntilDone } from '../utils/helpers';

export default Engine =>
    class OpenContract extends Engine {
        observeOpenContract() {
            this.listen('proposal_open_contract', r => {
                const contract = r.proposal_open_contract;

                if (!this.expectedContractId(contract.contract_id)) {
                    return;
                }

                this.setContractFlags(contract);

                this.data.contract = contract;

                broadcastContract({ accountID: this.accountInfo.loginid, ...contract });

                if (this.isSold) {
                    this.contractId = '';

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
            });
        }

        waitForAfter() {
            return new Promise(resolve => {
                this.afterPromise = resolve;
            });
        }

        subscribeToOpenContract(contractId = this.contractId) {
            this.contractId = contractId;

            this.api
                .subscribeToOpenContract(contractId)
                .then(response => {
                    this.openContractId = response.proposal_open_contract.id;
                })
                .catch(error => {
                    if (error.name !== 'AlreadySubscribed') {
                        doUntilDone(() =>
                            this.api.subscribeToOpenContract(contractId).then(response => {
                                this.openContractId = response.proposal_open_contract.id;
                            })
                        );
                    }
                });
        }

        setContractFlags(contract) {
            const { is_expired, is_valid_to_sell, is_sold, entry_tick } = contract;

            this.isSold = Boolean(is_sold);
            this.isSellAvailable = !this.isSold && Boolean(is_valid_to_sell);
            this.isExpired = Boolean(is_expired);
            this.hasEntryTick = Boolean(entry_tick);
        }

        expectedContractId(contractId) {
            return this.contractId && contractId === this.contractId;
        }

        getSellPrice() {
            const { bid_price: bidPrice, buy_price: buyPrice, currency } = this.data.contract;
            return getRoundedNumber(Number(bidPrice) - Number(buyPrice), currency);
        }
    };
