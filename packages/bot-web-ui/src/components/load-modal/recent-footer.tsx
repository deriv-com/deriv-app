import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

const RecentFooter = observer(() => {
    const { load_modal, dashboard } = useDBotStore();
    const { is_open_button_loading, loadFileFromRecent, toggleLoadModal } = load_modal;
    const { setOpenSettings } = dashboard;

    return (
        <Button
            text={localize('Open')}
            onClick={() => {
                loadFileFromRecent();
                toggleLoadModal();
                setOpenSettings('import');
            }}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
        />
    );
});

export default RecentFooter;
