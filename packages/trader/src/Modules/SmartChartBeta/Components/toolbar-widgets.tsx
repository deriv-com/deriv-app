import React from 'react';
import { isDesktop } from '@deriv/shared';
import {
    ChartModeBeta,
    DrawToolsBeta,
    ShareBeta,
    StudyLegendBeta,
    ViewsBeta,
    ToolbarWidgetBeta,
} from 'Modules/SmartChartBeta';

type TToolbarWidgetsBetaProps = {
    is_mobile?: boolean;
    position?: string;
    updateChartType: (type: string) => void;
    updateGranularity: (granularity: number) => void;
};

const ToolbarWidgetsBeta = ({ is_mobile, position, updateChartType, updateGranularity }: TToolbarWidgetsBetaProps) => {
    return (
        <ToolbarWidgetBeta position={position || is_mobile ? 'bottom' : null}>
            <ChartModeBeta portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {isDesktop() && <StudyLegendBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <ViewsBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <DrawToolsBeta portalNodeId='modal_root' />}
            {isDesktop() && <ShareBeta portalNodeId='modal_root' />}
        </ToolbarWidgetBeta>
    );
};

export default React.memo(ToolbarWidgetsBeta);
