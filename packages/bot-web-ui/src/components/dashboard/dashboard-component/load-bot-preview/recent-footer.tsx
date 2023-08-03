import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import './index.scss';
import { observer } from 'mobx-react';
import { useDBotStore } from 'Stores/useDBotStore';

const RecentFooter = observer(() => {
    const { load_modal } = useDBotStore();
    const { is_open_button_loading, loadFileFromRecent } = load_modal;
    return (
        <Button
            text={localize('Open')}
            onClick={loadFileFromRecent}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
        />
    );
});

export default RecentFooter;
