import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import './index.scss';

type TRecentFooter = {
    is_open_button_loading: boolean;
    loadFileFromRecent: () => void;
};

const RecentFooter = ({ is_open_button_loading, loadFileFromRecent }: TRecentFooter) => {
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
};

export default connect(({ load_modal }: RootStore) => ({
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromRecent: load_modal.loadFileFromRecent,
}))(RecentFooter);
