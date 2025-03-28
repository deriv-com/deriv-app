import React from 'react';
import { getUrlBase, moduleLoader } from '@deriv/shared';

let module;

const init = () => {
    module = moduleLoader(() => {
        return import(/* webpackChunkName: "smart_chart" */ '@jimdanielswasswa/test-chart');
    });

    module.then(({ setSmartChartsPublicPath }) => {
        setSmartChartsPublicPath(getUrlBase('/js/smartcharts/'));
    });
};

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = component_name => () => {
    if (!module) {
        init();
    }
    return module.then(module => {
        return { default: module[component_name] };
    });
};

export const SmartChart = React.lazy(load('SmartChart'));
export const ChartTitle = React.lazy(load('ChartTitle'));

export const ChartSize = React.lazy(load('ChartSize'));
export const ChartMode = React.lazy(load('ChartMode'));
export const DrawTools = React.lazy(load('DrawTools'));
export const Share = React.lazy(load('Share'));
export const StudyLegend = React.lazy(load('StudyLegend'));
export const Views = React.lazy(load('Views'));
export const ToolbarWidget = React.lazy(load('ToolbarWidget'));

export const FastMarker = React.lazy(load('FastMarker'));
export const RawMarker = React.lazy(load('RawMarker'));
