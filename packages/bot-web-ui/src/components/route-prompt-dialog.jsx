import React, { useEffect } from 'react';
import { localize, Localize } from '@deriv/translations';
import { Dialog } from '@deriv/components';
import { connect } from '../stores/connect';

const RoutePromptDialog = ({ continueRoute, is_confirmed, last_location, should_show, onCancel, onConfirm }) => {
    useEffect(continueRoute, [is_confirmed, last_location]);

    return (
        <Dialog
            title={localize('Are you sure?')}
            confirm_button_text={localize('Yes')}
            cancel_button_text={localize('No')}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={should_show}
        >
            {/* TODO: update text once available from copywriters */}
            <Localize i18n_default_text='Navigating to other platform will still complete current bought contract but will stop purchasing a new contract.' />
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
