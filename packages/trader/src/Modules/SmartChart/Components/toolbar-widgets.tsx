import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';

type ToolbarWidgetsProps = {
    position: string;
    updateChartType: () => void;
    updateGranularity: () => void;
};

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }: ToolbarWidgetsProps) => (
    <ToolbarWidget position={position || isMobile() ? 'bottom' : null}>
        <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
        {isDesktop() && <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
        {isDesktop() && <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
        {isDesktop() && <DrawTools portalNodeId='modal_root' />}
        {isDesktop() && <Share portalNodeId='modal_root' />}
    </ToolbarWidget>
);

export default ToolbarWidgets;
