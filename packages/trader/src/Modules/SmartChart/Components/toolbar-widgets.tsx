import React from 'react';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';
import { useDevice } from '@deriv-com/ui';
import { isTabletOs } from '@deriv/shared';

type TToolbarWidgetsProps = {
    position?: string;
    updateChartType: (type: string) => void;
    updateGranularity: (granularity: number) => void;
};

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    const { isDesktop, isMobile } = useDevice();

    return (
        <ToolbarWidget position={position || (isMobile ? 'bottom' : null)}>
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {isDesktop && !isTabletOs && (
                <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
            )}
            {!isMobile && (
                <Views
                    portalNodeId='modal_root'
                    searchInputClassName='data-hj-whitelist'
                    onChartType={updateChartType}
                    onGranularity={updateGranularity}
                />
            )}
            {isDesktop && !isTabletOs && <DrawTools portalNodeId='modal_root' />}
            {!isMobile && <Share portalNodeId='modal_root' />}
        </ToolbarWidget>
    );
};

export default React.memo(ToolbarWidgets);
