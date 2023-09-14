import { purchaseSuccessful } from './state/actions';
import { BEFORE_PURCHASE } from './state/constants';
import { contractStatus, info, log } from '../utils/broadcast';
import { getUUID, recoverFromError, doUntilDone, tradeOptionToBuy } from '../utils/helpers';
import { log_types } from '../../../constants/messages';
import { api_base } from '../../api/api-base';

let delayIndex = 0;
let purchase_reference;

export default Engine =>
    class Purchase extends Engine {
        purchase(contract_type) {
            // Prevent calling purchase twice
            if (this.store.getState().scope !== BEFORE_PURCHASE) {
                return Promise.resolve();
            }

            const onSuccess = response => {
                // Don't unnecessarily send a forget request for a purchased contract.
                const { buy } = response;

                contractStatus({
                    id: 'contract.purchase_received',
                    data: buy.transaction_id,
                    buy,
                });

                this.contractId = buy.contract_id;
                this.store.dispatch(purchaseSuccessful());
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

            function hasBlockOfType(targetType, workspace) {
                const allBlocks = workspace.getAllBlocks();
                return allBlocks.some(block => block.type === targetType);
            }

            const workspace = Blockly.derivWorkspace();
            const hasPayoutBlock = hasBlockOfType('payout', workspace);
            // Since basis : '${block.type === 'trade_definition_tradeoptions' ? 'stake' : 'payout'}'
            const isBasisPayout = !hasBlockOfType('trade_definition_tradeoptions', workspace);

            function handlePurchase(action) {
                this.isSold = false;
                contractStatus({
                    id: 'contract.purchase_sent',
                    data: this.data_trade_options.amount,
                });

                if (!this.options.timeMachineEnabled) {
                    return doUntilDone(action).then(onSuccess);
                }
                return recoverFromError(
                    action,
                    (errorCode, makeDelay) => {
                        const unsubscribe = this.store.subscribe(() => {
                            const { scope } = this.store.getState();
                            if (scope === BEFORE_PURCHASE) {
                                makeDelay().then(() => this.observer.emit('REVERT', 'before'));
                                unsubscribe();
                            }
                        });
                    },
                    ['PriceMoved', 'InvalidContractProposal'],
                    delayIndex++
                ).then(onSuccess);
            }

            if (hasPayoutBlock || isBasisPayout) {
                // here proposal call
                // const trade_option = tradeOptionToBuy(contract_type, this.data_trade_options);
                // const action = () => api_base.api.send(trade_option);
                // handlePurchase(action);
            } else {
                const trade_option = tradeOptionToBuy(contract_type, this.data_trade_options);
                const action = () => api_base.api.send(trade_option);
                handlePurchase(action);
            }
        }
        getPurchaseReference = () => purchase_reference;
        regeneratePurchaseReference = () => {
            purchase_reference = getUUID();
        };
    };
