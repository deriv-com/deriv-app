import React          from 'react';
import { getUrlBase } from '_common/url';

const Module = import(/* webpackChunkName: "smart_chart", webpackPreload: true */'smartcharts-beta');

Module.then(({ setSmartChartsPublicPath }) => {
    setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));
});

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = component_name => () => Module.then(module => {
    return ({ default: module[component_name] });
});

export const SmartChart = React.lazy(load('SmartChart'));
export const AssetInformation = React.lazy(load('AssetInformation'));
export const ChartTitle = React.lazy(load('ChartTitle'));

export const ChartSize = React.lazy(load('ChartSize'));
export const ChartTypes = React.lazy(load('ChartTypes'));
export const Comparison = React.lazy(load('Comparison'));
export const CrosshairToggle = React.lazy(load('CrosshairToggle'));
export const DrawTools = React.lazy(load('DrawTools'));
export const Share = React.lazy(load('Share'));
export const StudyLegend = React.lazy(load('StudyLegend'));
export const Timeperiod = React.lazy(load('Timeperiod'));
export const Views = React.lazy(load('Views'));

export const FastMarker = React.lazy(load('FastMarker'));
export const RawMarker = React.lazy(load('RawMarker'));
