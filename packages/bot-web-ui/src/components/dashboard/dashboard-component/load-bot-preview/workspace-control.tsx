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
            onClick={() => onZoomInOutClick(true)}
        />
        <Icon
            icon={'IcMinusRounded'}
            className='load-strategy__preview-workspace-icon'
            onClick={() => onZoomInOutClick(false)}
        />
    </div>
);

export default connect(({ load_modal }: RootStore) => ({
    onZoomInOutClick: load_modal.onZoomInOutClick,
}))(WorkspaceControl);
