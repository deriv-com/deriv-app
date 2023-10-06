import React from 'react';
import { getUrlBase, moduleLoader } from '@deriv/shared';

const Module = moduleLoader(() =>
    import(/* webpackChunkName: "smart_chart_beta", webpackPreload: true */ '@deriv/deriv-charts-beta')
);

Module.then(({ setSmartChartsPublicPath }) => {
    setSmartChartsPublicPath(getUrlBase('/js/smartchartsbeta/'));
});

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = component_name => () =>
    Module.then(module => {
        return { default: module[component_name] };
    });

export const SmartChartBeta = React.lazy(load('SmartChart'));
export const ChartTitleBeta = React.lazy(load('ChartTitle'));

export const ChartSizeBeta = React.lazy(load('ChartSize'));
export const ChartModeBeta = React.lazy(load('ChartMode'));
export const DrawToolsBeta = React.lazy(load('DrawTools'));
export const ShareBeta = React.lazy(load('Share'));
export const StudyLegendBeta = React.lazy(load('StudyLegend'));
export const ViewsBeta = React.lazy(load('Views'));
export const ToolbarWidgetBeta = React.lazy(load('ToolbarWidget'));

export const FastMarkerBeta = React.lazy(load('FastMarker'));
export const RawMarkerBeta = React.lazy(load('RawMarker'));
