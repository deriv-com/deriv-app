import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { ChartMode, DrawTools, Share, StudyLegend, Views } from 'Modules/SmartChart';

const ControlWidgets = () => (
    <React.Fragment>
        <DesktopWrapper>
            <ChartMode portalNodeId='modal_root' />
            <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
            <DrawTools portalNodeId='modal_root' />
            <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
            <Share portalNodeId='modal_root' />
        </DesktopWrapper>
    </React.Fragment>
);

export default ControlWidgets;
