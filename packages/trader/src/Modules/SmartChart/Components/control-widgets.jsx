import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { ChartMode, DrawTools, Share, StudyLegend, Views } from 'Modules/SmartChart';

const ControlWidgets = ({ updateChartType, updateGranularity }) => (
    <React.Fragment>
        <DesktopWrapper>
            <ChartMode
                portalNodeId='modal_root'
                onChartType={type => updateChartType(type)}
                onGranularity={granularity => updateGranularity(granularity)}
            />
            <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
            <DrawTools portalNodeId='modal_root' />
            <Views portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
            <Share portalNodeId='modal_root' />
        </DesktopWrapper>
    </React.Fragment>
);

ControlWidgets.propTypes = {
    updateChartType: PropTypes.func,
    updateGranularity: PropTypes.func,
};

export default ControlWidgets;
