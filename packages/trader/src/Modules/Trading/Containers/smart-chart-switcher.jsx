import React from 'react';
import { SmartChart } from 'Modules/SmartChart';

const SmartChartSwitcher = ({ is_alpha, ...props }) => {
    const Chart = is_alpha ? SmartChartAlpha : SmartChart;
    return <Chart data-testid='SmartChart' {...props} />;
};

export default SmartChartSwitcher;
