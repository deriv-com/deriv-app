import React from 'react';
import { SmartChart } from 'Modules/SmartChart';
import { SmartChartAlpha } from 'Modules/SmartChartAlpha';

const SmartChartSwitcher = ({ is_alpha, ...props }) => {
    const Chart = is_alpha ? SmartChartAlpha : SmartChart;
    return <Chart data-testid='SmartChart' {...props} />;
};

export default SmartChartSwitcher;
