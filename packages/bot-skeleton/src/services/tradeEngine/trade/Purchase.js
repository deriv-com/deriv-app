import { purchaseSuccessful } from './state/actions';
import { BEFORE_PURCHASE } from './state/constants';
import { contractStatus, info, log } from '../utils/broadcast';
import { getUUID, recoverFromError, doUntilDone } from '../utils/helpers';
import { log_types } from '../../../constants/messages';

let delayIndex = 0;
let purchase_reference;

export default Engine =>
    class Purchase extends Engine {
        purchase(contract_type) {
            // Prevent calling purchase twice
            if (this.store.getState().scope !== BEFORE_PURCHASE) {
                return Promise.resolve();
            }

            const { id, askPrice } = this.selectProposal(contract_type);

            const onSuccess = response => {
                // Don't unnecessarily send a forget request for a purchased contract.
                this.data.proposals = this.data.proposals.filter(p => p.id !== response.echo_req.buy);
                const { buy } = response;

                contractStatus({
                    id: 'contract.purchase_received',
                    data: buy.transaction_id,
                    buy,
                });

                this.subscribeToOpenContract(buy.contract_id);
                this.store.dispatch(purchaseSuccessful());
                this.renewProposalsOnPurchase();
                delayIndex = 0;
                log(log_types.PURCHASE, { longcode: buy.longcode, transaction_id: buy.transaction_id });
                info({
                    accountID: this.accountInfo.loginid,
                    totalRuns: this.updateAndReturnTotalRuns(),
                    transaction_ids: { buy: buy.transaction_id },
                    contract_type,
                    buy_price: buy.buy_price,
                });
            };
            const action = () => this.api.send({ buy: id, price: askPrice });
            this.isSold = false;
            contractStatus({
                id: 'contract.purchase_sent',
                data: askPrice,
            });

            if (!this.options.timeMachineEnabled) {
                return doUntilDone(action).then(onSuccess);
            }
            return recoverFromError(
                action,
                (errorCode, makeDelay) => {
                    // if disconnected no need to resubscription (handled by live-api)
                    if (errorCode !== 'DisconnectError') {
                        this.renewProposalsOnPurchase();
                    } else {
                        this.clearProposals();
                    }

                    const unsubscribe = this.store.subscribe(() => {
                        const { scope, proposalsReady } = this.store.getState();
                        if (scope === BEFORE_PURCHASE && proposalsReady) {
                            makeDelay().then(() => this.observer.emit('REVERT', 'before'));
                            unsubscribe();
                        }
                    });
                },
                ['PriceMoved', 'InvalidContractProposal'],
                delayIndex++
            ).then(onSuccess);
        }
        getPurchaseReference = () => purchase_reference;
        regeneratePurchaseReference = () => {
            purchase_reference = getUUID();
        };
    };
