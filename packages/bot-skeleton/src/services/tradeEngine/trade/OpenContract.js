import { getRoundedNumber } from '@deriv/shared';
import { sell, openContractReceived } from './state/actions';
import { contractStatus, contract as broadcastContract } from '../utils/broadcast';
import { doUntilDone } from '../utils/helpers';
import DBotStore from '../../../scratch/dbot-store';
import { api_base } from '../../api/api-base';

export default Engine =>
    class OpenContract extends Engine {
        observeOpenContract() {
            const subscription = api_base.api.onMessage().subscribe(({ data }) => {
                if (data.msg_type === 'proposal_open_contract') {
                    const contract = data.proposal_open_contract;

                    if (!contract || !this.expectedContractId(contract?.contract_id)) {
                        return;
                    }

                    this.setContractFlags(contract);

                    this.data.contract = contract;

                    broadcastContract({ accountID: api_base.account_info.loginid, ...contract });

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
                }
            });
            api_base.pushSubscription(subscription);
        }

        waitForAfter() {
            return new Promise(resolve => {
                this.afterPromise = resolve;
            });
        }

        subscribeToOpenContract(contract_id = this.contractId) {
            this.contractId = contract_id;
            const request_object = {
                proposal_open_contract: 1,
                contract_id,
                subscribe: 1,
            };

            doUntilDone(() => api_base.api.send(request_object))
                .then(data => {
                    const { populateConfig } = DBotStore.instance;
                    populateConfig(data.proposal_open_contract);
                    this.openContractId = data.proposal_open_contract.id;
                })
                .catch(error => {
                    if (error.error.code !== 'AlreadySubscribed') {
                        doUntilDone(() => api_base.api.send(request_object)).then(
                            response => (this.openContractId = response.proposal_open_contract.id)
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
