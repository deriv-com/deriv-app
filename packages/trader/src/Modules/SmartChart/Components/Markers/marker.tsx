import { toJS } from 'mobx';
import React from 'react';
import { FastMarker } from 'Modules/SmartChart';

type TContentConfig = {
    className?: string;
    label?: string;
    line_style?: string;
    spot_className?: string;
};

export type TMarkerContentConfig = TContentConfig & {
    align_label?: string;
    is_value_hidden?: boolean;
    marker_config?: {
        [key: string]: {
            type: string;
            marker_config: {
                ContentComponent: React.ComponentType<TMarkerContentConfig> | string;
                className?: string;
            };
            content_config: TContentConfig;
        };
    };
    spot_epoch?: string;
    spot_count?: number;
    spot_profit?: string;
    spot_value?: string;
    status?: string;
};

type TChartMarker = {
    is_bottom_widget_visible?: boolean;
    marker_config: {
        ContentComponent: React.ComponentType<TMarkerContentConfig> | string;
        className?: string;
        x: string | number;
        y: string | number | null;
    };
    marker_content_props: TMarkerContentConfig;
};
type TRef = {
    setPosition: (position: { epoch: number | null; price: number | null }) => void;
    div: HTMLDivElement;
};

const ChartMarker = ({ marker_config, marker_content_props, is_bottom_widget_visible }: TChartMarker) => {
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
            ref.setPosition({
                epoch: +marker_props.x,
                price: Number(marker_props.y),
            });
        }
    };

    // memoizing the marker components data:
    const getMemoizedComponent = React.useCallback(() => {
        return <ContentComponent {...toJS(marker_content_props)} />;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marker_content_props]);

    return <FastMarker markerRef={onRef}>{getMemoizedComponent()}</FastMarker>;
};

export default ChartMarker;
