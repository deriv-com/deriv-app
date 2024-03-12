import React from 'react';
import { isDesktop } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';

type TToolbarWidgetsProps = {
    is_mobile?: boolean;
    position?: string;
    updateChartType: (type: string) => void;
    updateGranularity: (granularity: number) => void;
};

const ToolbarWidgets = ({ is_mobile, position, updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    return (
        <ToolbarWidget position={position || (is_mobile ? 'bottom' : null)}>
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {!is_mobile && <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {!is_mobile && (
                <Views
                    portalNodeId='modal_root'
                    searchInputClassName='data-hj-whitelist'
                    onChartType={updateChartType}
                    onGranularity={updateGranularity}
                />
            )}
            {!is_mobile && <DrawTools portalNodeId='modal_root' />}
            {!is_mobile && <Share portalNodeId='modal_root' />}
        </ToolbarWidget>
    );
};

export default React.memo(ToolbarWidgets);
