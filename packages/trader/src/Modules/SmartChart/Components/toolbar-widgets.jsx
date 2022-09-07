import PropTypes from 'prop-types';
import React from 'react';
import { isDesktop, isMobile } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }) => {
    const error = {
        height: 48,
        width: 48,
        position: 'fixed',
        zIndex: 1,
        top: 236,
        left: 28,
    }

    return (
        <ToolbarWidget position={position || isMobile() ? 'bottom' : null}>
            <span style={error} />
            <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
            {isDesktop() && <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
            {isDesktop() && <DrawTools portalNodeId='modal_root' />}
            {isDesktop() && <Share portalNodeId='modal_root' />}
        </ToolbarWidget>
    )
};

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default React.memo(ToolbarWidgets);
