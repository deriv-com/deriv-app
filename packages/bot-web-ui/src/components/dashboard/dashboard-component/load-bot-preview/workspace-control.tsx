import React from 'react';
import { Icon } from '@deriv/components';
import { observer } from 'mobx-react';
import { useDBotStore } from 'Stores/useDBotStore';

const WorkspaceControl = observer(() => {
    const { dashboard } = useDBotStore();
    const { onZoomInOutClick } = dashboard;
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
    </div>;
});

export default WorkspaceControl;
