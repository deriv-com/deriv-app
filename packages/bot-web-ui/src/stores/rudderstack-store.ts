import { action, makeObservable, reaction, when } from 'mobx';
import { getLanguage } from '@deriv/translations';
import RudderStack from 'Utils/rudderstack';
import { TAccountType, TEvents } from 'Utils/rudderstack/rudderstack';
import { ACCOUNT_TYPES } from 'Utils/settings';

export default class RudderStackStore {
    core;
    rudder_stack_instance: RudderStack | null;
    reactionDisposer;

    constructor(core) {
        this.core = core;
        this.rudder_stack_instance = new RudderStack();
        this.reactionDisposer = this.registerReactions();

        makeObservable(this, {
            trackActionsWithUserInfo: action.bound,
            reset: action.bound,
        });

        /* when the user logs out reset the instacnce and set it to null */
        when(
            () => this.core.client.is_authorize,
            () => {
                if (!this.core.client.is_authorize) {
                    this.reset();
                    this.rudder_stack_instance = null;
                }
            }
        );
    }

    trackActionsWithUserInfo(page = 'ce_bot_dashboard_form', payload: TEvents) {
        const { ui } = this.core;
        const { is_mobile } = ui;
        const { loginid } = this.core.client;

        /* 
            These two parameters account_type and device_type are always required before we perform any 
            track actions call
        */
        const account_type = ACCOUNT_TYPES.find(account => loginid?.includes(account)) as TAccountType;
        const device_type = is_mobile ? 'mobile' : 'desktop';

        this.rudder_stack_instance?.trackActions(page, {
            account_type,
            device_type,
            ...payload,
        });
    }

    reset() {
        this.rudder_stack_instance?.reset();
    }

    /* 
        written this reaction to listen to the client loginid from core
        and initialize the rudderstack instance
    */
    registerReactions() {
        const { client } = this.core;
        const disposeRudderStackInstance = reaction(
            () => client?.loginid,
            when(
                () => client?.loginid,
                async () => {
                    this.rudder_stack_instance?.identify(this.core.client.user_id, {
                        language: getLanguage().toLowerCase(),
                    });
                }
            )
        );
        /* 
            unregister the reaction here
        */
        return () => {
            disposeRudderStackInstance();
        };
    }
}
