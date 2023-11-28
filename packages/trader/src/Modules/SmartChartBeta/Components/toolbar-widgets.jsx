import PropTypes from 'prop-types';
import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import {
    ChartModeBeta,
    DrawToolsBeta,
    ShareBeta,
    StudyLegendBeta,
    ViewsBeta,
    ToolbarWidgetBeta,
} from 'Modules/SmartChartBeta';

const ToolbarWidgetsBeta = ({ position, updateChartType, updateGranularity }) => {
    return (
        <ToolbarWidgetBeta position={position || isMobile() ? 'bottom' : null}>
            <ChartModeBeta portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {isDesktop() && <StudyLegendBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <ViewsBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <DrawToolsBeta portalNodeId='modal_root' />}
            {isDesktop() && <ShareBeta portalNodeId='modal_root' />}
        </ToolbarWidgetBeta>
    );
};

ToolbarWidgetsBeta.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default React.memo(ToolbarWidgetsBeta);
