import { toJS } from 'mobx';
import React from 'react';
import { FastMarker } from 'Modules/SmartChart';

type TChartMarker = {
    is_bottom_widget_visible?: boolean;
    marker_config: {
        ContentComponent: 'div';
        x: string | number;
        y: string | number;
    };
    marker_content_props: { className: string };
    decrease_zIndex?: boolean;
};
type TRef = {
    setPosition: (position: { epoch: number | null; price: number | null }) => void;
    div: HTMLDivElement;
};

const ChartMarker = ({
    marker_config,
    marker_content_props,
    is_bottom_widget_visible,
    decrease_zIndex = false,
}: TChartMarker) => {
    const { ContentComponent, ...marker_props } = marker_config;

    // TODO:
    //  - rename x to epoch
    //  - rename y to price
    const onRef = (ref?: TRef) => {
        if (ref) {
            // NOTE: null price means vertical line.
            if (!marker_props.y) {
                const margin = (is_bottom_widget_visible ? 115 : 0) + 24; // digit contracts have a widget at the bottom // height of line marker icon

                ref.div.style.height = `calc(100% - ${margin}px)`;
                ref.div.style.zIndex = '-1';
            }
            if (decrease_zIndex) ref.div.style.zIndex = '-1';
            ref.setPosition({
                epoch: +marker_props.x,
                price: +marker_props.y,
            });
        }
    };

    // memoizing the marker components data:
    const getMemoizedComponent = React.useCallback(() => {
        return <ContentComponent {...toJS(marker_content_props)} />;
    }, [marker_content_props]);

    return <FastMarker markerRef={onRef}>{getMemoizedComponent()}</FastMarker>;
};

export default ChartMarker;
