import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper } from '@deriv/components';
import { ChartModeBeta, DrawToolsBeta, ShareBeta, StudyLegendBeta, ViewsBeta } from 'Modules/SmartChartBeta';

const ControlWidgets = observer(() => {
    const {
        contract_trade: { updateChartType, updateGranularity },
    } = useStore();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <ChartModeBeta
                    portalNodeId='modal_root'
                    onChartType={type => updateChartType(type)}
                    onGranularity={granularity => updateGranularity(granularity)}
                />
                <StudyLegendBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                <DrawToolsBeta portalNodeId='modal_root' />
                <ViewsBeta portalNodeId='modal_root' searchInputClassName='data-hj-whitelist' />
                <ShareBeta portalNodeId='modal_root' />
            </DesktopWrapper>
        </React.Fragment>
    );
});

export default ControlWidgets;
