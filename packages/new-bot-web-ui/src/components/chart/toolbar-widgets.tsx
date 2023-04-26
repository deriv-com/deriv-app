import React from 'react';
import { ToolbarWidget, ChartMode, DrawTools, Share, StudyLegend, Views } from '@deriv/deriv-charts';

type TToolbarWidgetsProps = {
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
};

const ToolbarWidgets = ({ updateChartType, updateGranularity }: TToolbarWidgetsProps) => (
    <ToolbarWidget>
        <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
        <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
        <DrawTools portalNodeId='modal_root' />
        <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
        <Share portalNodeId='modal_root' />
    </ToolbarWidget>
);

export default ToolbarWidgets;
