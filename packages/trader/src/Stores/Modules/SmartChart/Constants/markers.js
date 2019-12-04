import { localize }    from 'deriv-translations';
import MarkerLine      from 'Modules/SmartChart/Components/Markers/marker-line.jsx';
import MarkerSpotLabel from 'Modules/SmartChart/Components/Markers/marker-spot-label.jsx';
import MarkerSpot      from 'Modules/SmartChart/Components/Markers/marker-spot.jsx';

export const MARKER_TYPES_CONFIG = {
    LINE_END: {
        type         : 'LINE_END',
        marker_config: {
            ContentComponent: MarkerLine,
            className       : 'chart-marker-line',
        },
        content_config: { line_style: 'dash',  label: localize('End Time') },
    },
    LINE_PURCHASE: {
        type         : 'LINE_PURCHASE',
        marker_config: {
            ContentComponent: MarkerLine,
            className       : 'chart-marker-line',
        },
        content_config: { line_style: 'solid', label: localize('Purchase Time') },
    },
    LINE_START: {
        type         : 'LINE_START',
        marker_config: {
            ContentComponent: MarkerLine,
            className       : 'chart-marker-line',
        },
        content_config: { line_style: 'solid', label: localize('Start Time') },
    },
    SPOT_ENTRY: {
        type         : 'SPOT_ENTRY',
        marker_config: {
            ContentComponent: MarkerSpot,
        },
        content_config: { className: 'chart-spot__entry' },
    },
    SPOT_SELL: {
        type         : 'SPOT_SELL',
        marker_config: {
            ContentComponent: MarkerSpot,
        },
        content_config: { className: 'chart-spot__sell' },
    },
    SPOT_EXIT: {
        type         : 'SPOT_EXIT',
        marker_config: {
            ContentComponent: MarkerSpotLabel,
        },
        content_config: { spot_className: 'chart-spot__spot' },
    },
    SPOT_MIDDLE: {
        type         : 'SPOT_MIDDLE',
        marker_config: {
            ContentComponent: MarkerSpotLabel,
        },
        content_config: { spot_className: 'chart-spot__spot' },
    },
};
