import React from 'react';
import { Dialog } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

const RoutePromptDialog = observer(() => {
    const { route_prompt_dialog } = useDBotStore();
    const { continueRoute, should_show, is_confirmed, last_location, onCancel, onConfirm } = route_prompt_dialog;

    React.useEffect(continueRoute, [is_confirmed, last_location, continueRoute]);

    return (
        <Dialog
            title={localize('Leaving already?')}
            confirm_button_text={localize("Yes, I'll come back later")}
            cancel_button_text={localize("No, I'll stay")}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={should_show}
            has_close_icon={false}
        >
            <Localize i18n_default_text='If you leave, your current contract will be completed, but your bot will stop running immediately.' />
        </Dialog>
    );
});

export default RoutePromptDialog;
