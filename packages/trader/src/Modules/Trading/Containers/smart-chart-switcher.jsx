import React from 'react';
import { SmartChartBeta } from 'Modules/SmartChartBeta';

const SmartChartSwitcher = ({ is_beta, ...props }) => {
    const Chart = SmartChartBeta;
    return <Chart data-testid='SmartChart' {...props} />;
};

export default SmartChartSwitcher;
