import React from 'react';
import { Icon } from '@deriv/components';
import { connect } from 'Stores/connect';

type WorkspaceControlProps = {
    onZoomInOutClick: () => void;
};

const WorkspaceControl = ({ onZoomInOutClick }: WorkspaceControlProps) => (
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

export default connect(({ load_modal }) => ({
    onZoomInOutClick: load_modal.onZoomInOutClick,
}))(WorkspaceControl);
