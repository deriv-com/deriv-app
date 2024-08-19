import React from 'react';
import { Button } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { useDBotStore } from 'Stores/useDBotStore';

const RecentFooter = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { is_open_button_loading, is_open_button_disabled, loadStrategyOnBotBuilder, toggleLoadModal } = load_modal;
    const { setOpenSettings } = dashboard;

    return (
        <Button
            text={localize('Open')}
            onClick={() => {
                loadStrategyOnBotBuilder();
                toggleLoadModal();
                setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
            }}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
            disabled={is_open_button_disabled}
        />
    );
});

export default RecentFooter;
