import React from 'react';
import { Icon } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TWorkspaceControl = {
    onZoomInOutClick: (param: boolean) => void;
};

const WorkspaceControl = ({ onZoomInOutClick }: TWorkspaceControl) => (
    <div className='load-strategy__preview-workspace-controls'>
        <Icon
            icon={'IcAddRounded'}
            className='load-strategy__preview-workspace-icon'
            custom_color='$color-black-1'
            onClick={() => onZoomInOutClick(true)}
        />
        <Icon
            icon={'IcMinusRounded'}
            className='load-strategy__preview-workspace-icon'
            custom_color='$color-black-1'
            onClick={() => onZoomInOutClick(false)}
        />
    </div>
);

export default connect(({ dashboard }: RootStore) => ({
    onZoomInOutClick: dashboard.onZoomInOutClick,
}))(WorkspaceControl);
