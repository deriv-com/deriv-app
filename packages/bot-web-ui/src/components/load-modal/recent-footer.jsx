import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PropTypes } from 'mobx-react';
import { connect } from 'Stores/connect';

const RecentFooter = ({ is_open_button_loading, loadFileFromRecent }) => {
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

RecentFooter.propTypes = {
    is_open_button_loading: PropTypes.bool,
    loadFileFromRecent: PropTypes.func,
};

export default connect(({ load_modal }) => ({
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromRecent: load_modal.loadFileFromRecent,
}))(RecentFooter);
