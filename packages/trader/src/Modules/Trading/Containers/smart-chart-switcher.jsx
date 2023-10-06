import React from 'react';
import { SmartChart } from 'Modules/SmartChart';
import { SmartChartBeta } from 'Modules/SmartChartBeta';

const SmartChartSwitcher = ({ is_beta, ...props }) => {
    const Chart = is_beta ? SmartChartBeta : SmartChart;
    return <Chart data-testid='SmartChart' {...props} />;
};

export default SmartChartSwitcher;
