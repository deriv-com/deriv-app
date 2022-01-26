import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { ChartMode, DrawTools, Share, StudyLegend, Views } from 'Modules/SmartChart';

type ControlWidgetsProps = {
    updateChartType: () => void;
    updateGranularity: () => void;
};

const ControlWidgets = ({ updateChartType, updateGranularity }: ControlWidgetsProps) => (
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

export default ControlWidgets;
