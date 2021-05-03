import { Map, List } from 'immutable';
/**
Below are the list of events we can register to listen to :
 
-bot.running : Emitted in trade/index.js, in old Binary Bot this is only used
to set the label to is running.

-bot.stop: Bot was stopped by the user

-bot.contract: Called in OpenContract.js, object consisting of
accountID and a proposal_open_contract response, this will
be emitted on each POC message from the server.

-bot.info: Emitted in trade/Balance.js, it announces account ID and balance,
we don't need this in DerivBot. Can also be emitted during running
contract, it then announces an object consisting of accountID,
total_runs, transaction_ids, contract_type, and buy_price.

-contract.status:  First emitted in trade/Purchase.js with an idea that's more
of a flag e.g. contract_purchase_sent (when buy was sent to
API, or contract_purchase_recieved (when buy was acknowledged
by API), or contract.sold (when a contract was sold/expired).

-contract.settled: this event was emitted to initiate a
settlement of a contract, i.e. it would call proposal_open_contract to retrieve
latest values for contract, not required atm by DerivBot

-googledrive.authorise : event to start auturize google flow

-ui.log.success: UI Notifications

-ui.log.error: UI errors

-ui.log.warn: UI warning

-Notify: Server Notifications

-Error : Server errors

 */

export default class Observer {
    constructor() {
        this.eam = new Map(); // event action map
    }

    register(event, _action, once, unregisterIfError, unregisterAllBefore) {
        if (unregisterAllBefore) {
            this.unregisterAll(event);
        }
        const apiError = error => {
            if (error.type === unregisterIfError.type) {
                this.unregister('api.error', apiError);
                unregisterIfError.unregister.forEach(unreg => {
                    if (unreg instanceof Array) {
                        this.unregister(...unreg);
                    } else {
                        this.unregisterAll(unreg);
                    }
                });
            }
        };
        if (unregisterIfError) {
            this.register('api.error', apiError);
        }
        const action = (...args) => {
            if (once) {
                this.unregister(event, _action);
            }
            if (unregisterIfError) {
                this.unregister('api.error', apiError);
            }
            _action(...args);
        };

        const actionList = this.eam.get(event);

        this.eam = actionList
            ? this.eam.set(event, actionList.push({ action, searchBy: _action }))
            : this.eam.set(event, new List().push({ action, searchBy: _action }));
    }

    unregister(event, f) {
        this.eam = this.eam.set(
            event,
            this.eam.get(event).filter(r => r.searchBy !== f)
        );
    }

    isRegistered(event) {
        return this.eam.has(event);
    }

    unregisterAll(event) {
        this.eam = this.eam.delete(event);
    }

    emit(event, data) {
        if (this.eam.has(event)) {
            this.eam.get(event).forEach(action => action.action(data));
        }
    }
    setState(state = {}) {
        this.state = { ...this.state, ...state };
    }
    getState(key) {
        return this.state?.[key];
    }
}

export const observer = new Observer();
