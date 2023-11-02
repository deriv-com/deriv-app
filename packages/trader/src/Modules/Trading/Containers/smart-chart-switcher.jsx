import React from 'react';
import { SmartChart } from 'Modules/SmartChart';
import { SmartChartBeta } from 'Modules/SmartChartBeta';
import LaunchModal from 'Modules/SmartChartBeta/Components/LaunchModal/launch-modal';

const SmartChartSwitcher = ({ is_beta, ...props }) => {
    const Chart = is_beta ? SmartChartBeta : SmartChart;
    return (
        <>
            <LaunchModal />
            <Chart data-testid='SmartChart' {...props} />{' '}
        </>
    );
};

export default SmartChartSwitcher;
