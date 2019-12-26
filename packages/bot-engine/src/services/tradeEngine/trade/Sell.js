import { localize }                      from 'deriv-translations';
import { DURING_PURCHASE }               from './state/constants';
import { contractStatus, notify }        from '../utils/broadcast';
import { recoverFromError, doUntilDone } from '../utils/helpers';

let delayIndex = 0;

export default Engine =>
    class Sell extends Engine {
        isSellAtMarketAvailable() {
            return this.contractId && !this.isSold && this.isSellAvailable && !this.isExpired;
        }

        sellAtMarket() {
            // Prevent calling sell twice
            if (this.store.getState().scope !== DURING_PURCHASE) {
                return Promise.resolve();
            }

            if (!this.isSellAtMarketAvailable()) {
                if (this.hasEntryTick) {
                    const error = new Error(localize('Resale of this contract is not offered.'));
                    error.name = 'SellNotAvailable';
                    throw error;
                } else {
                    return Promise.resolve();
                }
            }

            const onSuccess = ({ sell: { sold_for: soldFor } }) => {
                delayIndex = 0;
                contractStatus('purchase.sold');
                notify('info', `${localize('Sold for')}: ${soldFor}`);
                return this.waitForAfter();
            };

            const action = () => this.api.sellContract(this.contractId, 0);

            if (!this.options.timeMachineEnabled) {
                return doUntilDone(action).then(onSuccess);
            }

            return recoverFromError(
                action,
                (errorCode, makeDelay) => makeDelay().then(() => this.observer.emit('REVERT', 'during')),
                ['NoOpenPosition', 'InvalidSellContractProposal', 'UnrecognisedRequest'],
                delayIndex++
            ).then(onSuccess);
        }
    };
