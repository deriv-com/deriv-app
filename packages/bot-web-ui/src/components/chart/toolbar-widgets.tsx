import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, ToolbarWidget, Views } from './v1';
import { ChartModeBeta, DrawToolsBeta, ShareBeta, StudyLegendBeta, ToolbarWidgetBeta, ViewsBeta } from './v2';

type TToolbarWidgetsProps = {
    is_beta_chart?: boolean;
    updateChartType: (chart_type: string) => void;
    updateGranularity: (updateGranularity: number) => void;
};

const ToolbarWidgets = ({ is_beta_chart, updateChartType, updateGranularity }: TToolbarWidgetsProps) => {
    return (
        <>
            {is_beta_chart && (
                <ToolbarWidgetBeta position={isMobile() ? 'bottom' : null}>
                    <ChartModeBeta
                        portalNodeId='modal_root'
                        onChartType={updateChartType}
                        onGranularity={updateGranularity}
                    />
                    {isDesktop() && (
                        <>
                            <StudyLegendBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                            <ViewsBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                            <DrawToolsBeta portalNodeId='modal_root' />
                            <ShareBeta portalNodeId='modal_root' />
                        </>
                    )}
                </ToolbarWidgetBeta>
            )}
            {!is_beta_chart && (
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
