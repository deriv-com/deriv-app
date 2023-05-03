import React from 'react';
import { Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';

type TWorkspaceControlProps = {
    onZoomInOutClick: (zoom_in: boolean) => void;
};

const WorkspaceControl = ({ onZoomInOutClick }: TWorkspaceControlProps) => (
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

export default connect(({ dashboard }: RootStore) => ({
    onZoomInOutClick: dashboard.onZoomInOutClick,
}))(WorkspaceControl);
