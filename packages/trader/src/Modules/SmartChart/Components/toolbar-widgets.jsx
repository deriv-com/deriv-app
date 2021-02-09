import PropTypes from 'prop-types';
import React from 'react';
import { isDesktop } from '@deriv/shared';
import { ChartMode, DrawTools, Share, StudyLegend, Views, ToolbarWidget } from 'Modules/SmartChart';

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }) => (
    <ToolbarWidget position={position || null}>
        <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
        <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
        {isDesktop() && <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />}
        {isDesktop() && <DrawTools portalNodeId='modal_root' />}
        {isDesktop() && <Share portalNodeId='modal_root' />}
    </ToolbarWidget>
);

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ToolbarWidgets;
