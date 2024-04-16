import { toJS } from 'mobx';
import React, { useMemo } from 'react';
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
    marker_config: {
        ContentComponent: React.ComponentType<TMarkerContentConfig> | string;
        className?: string;
        x: string | number;
        y: string | number | null;
    };
    marker_content_props: TMarkerContentConfig;
    is_positioned_behind?: boolean;
    is_positioned_before?: boolean;
};
type TRef = {
    setPosition: (position: { epoch: number | null; price: number | null }) => void;
    div: HTMLDivElement;
};

const ChartMarker = ({
    marker_config,
    marker_content_props,
    is_positioned_behind = false,
    is_positioned_before = false,
}: TChartMarker) => {
    const { ContentComponent, ...marker_props } = marker_config;

    // TODO:
    //  - rename x to epoch
    //  - rename y to price
    const onRef = (ref?: TRef) => {
        if (ref) {
            // NOTE: null price means vertical line.
            if (!marker_props.y) {
                const margin = 24; // height of line marker icon

                ref.div.style.height = `calc(100% - ${margin}px)`;
            } else {
                ref.div.style.zIndex = '1';
            }
            if (is_positioned_behind) ref.div.style.zIndex = '-1';
            if (is_positioned_before) ref.div.style.zIndex = '102';
            ref.setPosition({
                epoch: +marker_props.x,
                price: Number(marker_props.y),
            });
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const Component = useMemo(() => ContentComponent, []);
    return (
        <FastMarker markerRef={onRef}>
            <Component {...toJS(marker_content_props)} />
        </FastMarker>
    );
};

export default ChartMarker;
