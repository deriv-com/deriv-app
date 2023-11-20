import React from 'react';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TWorkspaceControlProps = {
    mockZoomInOut?: (is_zoom_in: boolean) => void;
};

const WorkspaceControl = observer(({ mockZoomInOut }: TWorkspaceControlProps) => {
    const { dashboard } = useDBotStore();
    const { onZoomInOutClick } = dashboard;

    return (
        <div className='load-strategy__preview-workspace-controls'>
            <Icon
                icon={'IcAddRounded'}
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(true) : onZoomInOutClick(true);
                }}
                data_testid='zoom-in'
            />
            <Icon
                icon={'IcMinusRounded'}
                className='load-strategy__preview-workspace-icon'
                onClick={() => {
                    mockZoomInOut ? mockZoomInOut(false) : onZoomInOutClick(false);
                }}
                data_testid='zoom-out'
            />
        </div>
    );
});

export default WorkspaceControl;
