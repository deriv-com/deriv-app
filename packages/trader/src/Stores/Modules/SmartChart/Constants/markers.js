import { localize }    from '@deriv/translations';
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
        content_config: { line_style: 'solid',  label: localize('Sell time') },
    },
    LINE_PURCHASE: {
        type         : 'LINE_PURCHASE',
        marker_config: {
            ContentComponent: MarkerLine,
            className       : 'chart-marker-line',
        },
        content_config: { line_style: 'solid', label: localize('Purchase Time') },
    },
    LINE_RESET: {
        type         : 'LINE_RESET',
        marker_config: {
            ContentComponent: MarkerLine,
            className       : 'char-marker-line',
        },
        content_config: { line_style: 'dash', label: localize('Reset time') },
    },
    LINE_START: {
        type         : 'LINE_START',
        marker_config: {
            ContentComponent: MarkerLine,
            className       : 'chart-marker-line',
        },
        content_config: { line_style: 'dash', label: localize('Buy time') },
    },
    SPOT_ENTRY: {
        type         : 'SPOT_ENTRY',
        marker_config: {
            ContentComponent: MarkerSpotLabel,
        },
        content_config: { spot_className: 'chart-spot__icon', icon: 'IcContractEntrySpotCircle', has_hover_toggle: true },
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
        content_config: { spot_className: 'chart-spot__icon', icon: 'IcContractExitSpotCircle', has_hover_toggle: true },
    },
    SPOT_MIDDLE: {
        type         : 'SPOT_MIDDLE',
        marker_config: {
            ContentComponent: MarkerSpotLabel,
        },
        content_config: { spot_className: 'chart-spot__spot', has_hover_toggle: true },
    },
};
