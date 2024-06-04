import { localize } from '@deriv/translations';
import MarkerLine from '../../Components/markers/marker-line.jsx';
import MarkerSpotLabel from '../../Components/markers/marker-spot-label.jsx';
import MarkerSpot from '../../Components/markers/marker-spot.jsx';

const default_marker_config = {
    ContentComponent: MarkerLine,
    className: 'chart-marker-line',
};

export const MARKER_TYPES_CONFIG = {
    LINE_END: {
        type: 'LINE_END',
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: 'dash', label: localize('End Time') },
    },
    LINE_PURCHASE: {
        type: 'LINE_PURCHASE',
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: 'solid', label: localize('Purchase Time') },
    },
    LINE_START: {
        type: 'LINE_START',
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: 'solid', label: localize('Start Time') },
    },
    LINE_RESET: {
        type: 'LINE_RESET',
        marker_config: {
            ...default_marker_config,
        },
        content_config: { line_style: 'dash', label: localize('Reset Time') },
    },
    SPOT_ENTRY: {
        type: 'SPOT_ENTRY',
        marker_config: {
            ContentComponent: MarkerSpot,
        },
        content_config: { className: 'chart-spot__entry' },
    },
    SPOT_SELL: {
        type: 'SPOT_SELL',
        marker_config: {
            ContentComponent: MarkerSpot,
        },
        content_config: { className: 'chart-spot__sell' },
    },
    SPOT_EXIT: {
        type: 'SPOT_EXIT',
        marker_config: {
            ContentComponent: MarkerSpotLabel,
        },
        content_config: { spot_className: 'chart-spot__spot' },
    },
    SPOT_EXIT_2: {
        type: 'SPOT_EXIT_2',
        marker_config: {
            ContentComponent: MarkerSpot,
        },
        content_config: { className: 'chart-spot__spot' },
    },
    SPOT_MIDDLE: {
        type: 'SPOT_MIDDLE',
        marker_config: {
            ContentComponent: MarkerSpotLabel,
        },
        content_config: { spot_className: 'chart-spot__spot' },
    },
};
