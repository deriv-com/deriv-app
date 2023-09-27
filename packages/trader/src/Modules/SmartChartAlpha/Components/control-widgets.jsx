import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper } from '@deriv/components';
import { ChartModeAlpha, DrawToolsAlpha, ShareAlpha, StudyLegendAlpha, ViewsAlpha } from 'Modules/SmartChartAlpha';

const ControlWidgets = observer(() => {
    const {
        contract_trade: { updateChartType, updateGranularity },
    } = useStore();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <ChartModeAlpha
                    portalNodeId='modal_root'
                    onChartType={type => updateChartType(type)}
                    onGranularity={granularity => updateGranularity(granularity)}
                />
                <StudyLegendAlpha portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                <DrawToolsAlpha portalNodeId='modal_root' />
                <ViewsAlpha portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                <ShareAlpha portalNodeId='modal_root' />
            </DesktopWrapper>
        </React.Fragment>
    );
});

export default ControlWidgets;
