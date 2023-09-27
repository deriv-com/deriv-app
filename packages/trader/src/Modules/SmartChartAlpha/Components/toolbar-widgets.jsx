import PropTypes from 'prop-types';
import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import {
    ChartModeAlpha,
    DrawToolsAlpha,
    ShareAlpha,
    StudyLegendAlpha,
    ViewsAlpha,
    ToolbarWidgetAlpha,
} from 'Modules/SmartChartAlpha';

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }) => {
    return (
        <ToolbarWidgetAlpha position={position || isMobile() ? 'bottom' : null}>
            <ChartModeAlpha portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {isDesktop() && <StudyLegendAlpha portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <ViewsAlpha portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <DrawToolsAlpha portalNodeId='modal_root' />}
            {isDesktop() && <ShareAlpha portalNodeId='modal_root' />}
        </ToolbarWidgetAlpha>
    );
};

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default React.memo(ToolbarWidgets);
