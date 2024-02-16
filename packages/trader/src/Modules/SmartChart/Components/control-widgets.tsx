import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper } from '@deriv/components';
import { ChartMode, DrawTools, Share, StudyLegend, Views } from 'Modules/SmartChart';

const ControlWidgets = observer(() => {
    const {
        contract_trade: { updateChartType, updateGranularity },
    } = useStore();

    return (
        <DesktopWrapper>
            <ChartMode
                portalNodeId='modal_root'
                onChartType={(type: string) => updateChartType(type)}
                onGranularity={(granularity: number) => updateGranularity(granularity)}
            />
            <StudyLegend portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
            <DrawTools portalNodeId='modal_root' />
            <Views
                portalNodeId='modal_root'
                searchInputClassName='data-hj-whitelist'
                onChartType={(type: string) => updateChartType(type)}
                onGranularity={(granularity: number) => updateGranularity(granularity)}
            />
            <Share portalNodeId='modal_root' />
        </DesktopWrapper>
    );
});

export default ControlWidgets;
