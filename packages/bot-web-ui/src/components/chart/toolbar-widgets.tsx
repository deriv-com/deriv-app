import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { ChartModeBeta, DrawToolsBeta, ShareBeta, StudyLegendBeta, ToolbarWidgetBeta, ViewsBeta } from './v2';

type TToolbarWidgetsProps = {
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
};

const ToolbarWidgets = ({ updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    return (
        <ToolbarWidgetBeta position={isMobile() ? 'bottom' : null}>
            <ChartModeBeta portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {isDesktop() && (
                <>
                    <StudyLegendBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                    <ViewsBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                    <DrawToolsBeta portalNodeId='modal_root' />
                    <ShareBeta portalNodeId='modal_root' />
                </>
            )}
        </ToolbarWidgetBeta>
    );
};

export default ToolbarWidgets;
