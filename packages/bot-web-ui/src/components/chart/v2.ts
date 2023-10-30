import React from 'react';
import { getUrlBase, moduleLoader } from '@deriv/shared';

let module: Promise<any> | undefined;

const init = () => {
    module = moduleLoader(() => {
        // TODO: Proper fix for types in smartcharts
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return import(/* webpackChunkName: "smart_chart_beta" */ '@deriv/deriv-charts-beta');
    });

    module.then(({ setSmartChartsPublicPath }: { setSmartChartsPublicPath: (path: string) => void }) => {
        setSmartChartsPublicPath(getUrlBase('/js/smartchartsbeta/'));
    });
};

// React.Lazy expects a default export for the component
// SmartChart library exports many components
const load = (component_name: string) => () => {
    if (!module) {
        init();
    }
    return module!.then(module => {
        return { default: module[component_name] };
    });
};

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
