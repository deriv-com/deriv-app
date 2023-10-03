import React from 'react';
import { getUrlBase, moduleLoader } from '@deriv/shared';

const Module = moduleLoader(() =>
    import(/* webpackChunkName: "smart_chart_alpha", webpackPreload: true */ '@deriv/deriv-charts-alpha')
);

Module.then(({ setSmartChartsPublicPath }) => {
    setSmartChartsPublicPath(getUrlBase('/js/smartchartsalpha/'));
});

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = component_name => () =>
    Module.then(module => {
        return { default: module[component_name] };
    });

export const SmartChartAlpha = React.lazy(load('SmartChart'));
export const ChartTitleAlpha = React.lazy(load('ChartTitle'));

export const ChartSizeAlpha = React.lazy(load('ChartSize'));
export const ChartModeAlpha = React.lazy(load('ChartMode'));
export const DrawToolsAlpha = React.lazy(load('DrawTools'));
export const ShareAlpha = React.lazy(load('Share'));
export const StudyLegendAlpha = React.lazy(load('StudyLegend'));
export const ViewsAlpha = React.lazy(load('Views'));
export const ToolbarWidgetAlpha = React.lazy(load('ToolbarWidget'));

export const FastMarkerAlpha = React.lazy(load('FastMarker'));
export const RawMarkerAlpha = React.lazy(load('RawMarker'));
