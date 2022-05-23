import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';

const RoutePromptDialog = ({ continueRoute, is_confirmed, last_location, should_show, onCancel, onConfirm }) => {
    React.useEffect(continueRoute, [is_confirmed, last_location, continueRoute]);

    return (
        <Dialog
            title={localize('Leaving already?')}
            confirm_button_text={localize("Yes, I'll come back later")}
            cancel_button_text={localize("No, I'll stay")}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={should_show}
        >
            <Localize i18n_default_text='If you leave, your current contract will be completed, but your bot will stop running immediately.' />
        </Dialog>
    );
};

export default connect(({ route_prompt_dialog }) => ({
    continueRoute: route_prompt_dialog.continueRoute,
    should_show: route_prompt_dialog.should_show,
    is_confirmed: route_prompt_dialog.is_confirmed,
    last_location: route_prompt_dialog.last_location,
    onCancel: route_prompt_dialog.onCancel,
    onConfirm: route_prompt_dialog.onConfirm,
}))(RoutePromptDialog);
