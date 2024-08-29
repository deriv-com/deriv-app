import React from 'react';
import { Button } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { useDBotStore } from 'Stores/useDBotStore';

const LocalFooter = observer(() => {
    const { ui } = useStore();
    const { load_modal, dashboard } = useDBotStore();
    const {
        is_open_button_loading,
        is_open_button_disabled,
        loadStrategyOnBotBuilder,
        setLoadedLocalFile,
        saveStrategyToLocalStorage,
        toggleLoadModal,
    } = load_modal;
    const { setOpenSettings, setPreviewOnPopup } = dashboard;

    const { is_desktop } = ui;
    const Wrapper = is_desktop ? React.Fragment : Button.Group;

    return (
        <Wrapper>
            {!is_desktop && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadStrategyOnBotBuilder();
                    saveStrategyToLocalStorage();
                    setLoadedLocalFile(null);
                    toggleLoadModal();
                    setPreviewOnPopup(false);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                }}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
                disabled={is_open_button_disabled}
            />
        </Wrapper>
    );
});

export default LocalFooter;
