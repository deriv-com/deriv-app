import React from 'react';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from '@deriv/deriv-charts';
import {
    ChartMode as ChartModeAlpha,
    DrawTools as DrawToolsAlpha,
    Share as ShareAlpha,
    StudyLegend as StudyLegendAlpha,
    ToolbarWidget as ToolbarWidgetAlpha,
    Views as ViewsAlpha,
} from '@deriv/deriv-charts-alpha';
import { isDesktop, isMobile } from '@deriv/shared';

type TToolbarWidgetsProps = {
    is_alpha_chart: boolean;
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
};

const ToolbarWidgets = ({ is_alpha_chart, updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    return (
        <>
            {is_alpha_chart && (
                <ToolbarWidgetAlpha position={isMobile() ? 'bottom' : null}>
                    <ChartModeAlpha
                        portalNodeId='modal_root'
                        onChartType={updateChartType}
                        onGranularity={updateGranularity}
                    />
                    {isDesktop() && (
                        <>
                            <StudyLegendAlpha portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                            <ViewsAlpha portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                            <DrawToolsAlpha portalNodeId='modal_root' />
                            <ShareAlpha portalNodeId='modal_root' />
                        </>
                    )}
                </ToolbarWidgetAlpha>
            )}
            {!is_alpha_chart && (
                <ToolbarWidget position={isMobile() ? 'bottom' : null}>
                    <ChartMode
                        portalNodeId='modal_root'
                        onChartType={updateChartType}
                        onGranularity={updateGranularity}
                    />
                    {isDesktop() && (
                        <>
                            <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                            <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                            <DrawTools portalNodeId='modal_root' />
                            <Share portalNodeId='modal_root' />
                        </>
                    )}
                </ToolbarWidget>
            )}
        </>
    );
};

export default ToolbarWidgets;
