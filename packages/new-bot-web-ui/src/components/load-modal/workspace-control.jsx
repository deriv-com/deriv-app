import React from 'react';
import { PropTypes } from 'prop-types';
import { Icon } from '@deriv/components';
import { connect } from 'Stores/connect';

const WorkspaceControl = ({ onZoomInOutClick }) => (
    <div className='load-strategy__preview-workspace-controls'>
        <Icon
            icon={'IcAddRounded'}
            className='load-strategy__preview-workspace-icon'
            onClick={() => onZoomInOutClick(true)}
        />
        <Icon
            icon={'IcMinusRounded'}
            className='load-strategy__preview-workspace-icon'
            onClick={() => onZoomInOutClick(false)}
        />
    </div>
);

WorkspaceControl.propTypes = {
    onZoomInOutClick: PropTypes.func,
};

export default connect(({ load_modal }) => ({
    onZoomInOutClick: load_modal.onZoomInOutClick,
}))(WorkspaceControl);
