import React from 'react';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from './v1';

type TToolbarWidgetsProps = {
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
    is_mobile: boolean;
};

const ToolbarWidgets = ({ updateChartType, updateGranularity, is_mobile }: TToolbarWidgetsProps) => {
    return (
        <ToolbarWidget position={is_mobile ? 'bottom' : null}>
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {!is_mobile && (
                <>
                    <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                    <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                    <DrawTools portalNodeId='modal_root' />
                    <Share portalNodeId='modal_root' />
                </>
            )}
        </ToolbarWidget>
    );
};

export default ToolbarWidgets;
