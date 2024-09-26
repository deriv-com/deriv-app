import React from 'react';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';
import { useDevice } from '@deriv-com/ui';
import { isDesktopOs, isTabletOs } from '@deriv/shared';

type TToolbarWidgetsProps = {
    position?: string;
    updateChartType: (type: string) => void;
    updateGranularity: (granularity: number) => void;
};

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    const { isMobile } = useDevice();
    const is_real_desktop_device = isDesktopOs() && !isTabletOs; // in a tablet simulator on desktop, isDesktopOs returns true

    return (
        <ToolbarWidget position={position || (isMobile ? 'bottom' : null)}>
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {is_real_desktop_device && !isMobile && (
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
            {is_real_desktop_device && !isMobile && <DrawTools portalNodeId='modal_root' />}
            {is_real_desktop_device && !isMobile && <Share portalNodeId='modal_root' />}
        </ToolbarWidget>
    );
};

export default React.memo(ToolbarWidgets);
