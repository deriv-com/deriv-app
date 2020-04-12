import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared/utils/screen';
import { ToolbarWidget, ChartMode, DrawTools, Share, StudyLegend, Views } from 'Modules/SmartChart';

const ToolbarWidgets = ({ position, updateChartType, updateGranularity }) => (
    <ToolbarWidget position={position || isMobile() ? 'bottom' : null}>
        <ChartMode portalNodeId='modal_root' onChartType={updateChartType} onGranularity={updateGranularity} />
        {isMobile() ? null : <StudyLegend portalNodeId='modal_root' />}
        {isMobile() ? null : <Views portalNodeId='modal_root' />}
        {isMobile() ? null : <DrawTools portalNodeId='modal_root' />}
        {isMobile() ? null : <Share portalNodeId='modal_root' />}
    </ToolbarWidget>
);

ToolbarWidgets.propTypes = {
    position: PropTypes.string,
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ToolbarWidgets;
