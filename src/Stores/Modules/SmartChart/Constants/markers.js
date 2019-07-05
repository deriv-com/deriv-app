import { localize }    from 'App/i18n';
import MarkerLine      from 'Modules/SmartChart/Components/Markers/marker-line.jsx';
import MarkerSpotLabel from 'Modules/SmartChart/Components/Markers/marker-spot-label.jsx';
import MarkerSpot      from 'Modules/SmartChart/Components/Markers/marker-spot.jsx';

const MARKER_X_POSITIONER = {
    EPOCH: 'epoch',
    NONE : 'none',
};

const MARKER_Y_POSITIONER = {
    VALUE: 'value',
    NONE : 'none',
};

const MARKER_CONTENT_TYPES = {
    LINE: {
        ContentComponent: MarkerLine,
        xPositioner     : MARKER_X_POSITIONER.EPOCH,
        yPositioner     : MARKER_Y_POSITIONER.NONE,
        className       : 'chart-marker-line',
    },
    SPOT: {
        ContentComponent: MarkerSpotLabel,
        xPositioner     : MARKER_X_POSITIONER.EPOCH,
        yPositioner     : MARKER_Y_POSITIONER.VALUE,
    },
    SPOT_ENTRY: {
        ContentComponent: MarkerSpot,
        xPositioner     : MARKER_X_POSITIONER.EPOCH,
        yPositioner     : MARKER_Y_POSITIONER.VALUE,
    },
    SPOT_SELL: {
        ContentComponent: MarkerSpot,
        xPositioner     : MARKER_X_POSITIONER.EPOCH,
        yPositioner     : MARKER_Y_POSITIONER.VALUE,
    },
};

export const MARKER_TYPES_CONFIG = {
    LINE_END: {
        type          : 'LINE_END',
        marker_config : MARKER_CONTENT_TYPES.LINE,
        content_config: { line_style: 'dash',  label: localize('End Time') },
    },
    LINE_PURCHASE: {
        type          : 'LINE_PURCHASE',
        marker_config : MARKER_CONTENT_TYPES.LINE,
        content_config: { line_style: 'solid', label: localize('Purchase Time') },
    },
    LINE_START: {
        type          : 'LINE_START',
        marker_config : MARKER_CONTENT_TYPES.LINE,
        content_config: { line_style: 'solid', label: localize('Start Time') },
    },
    SPOT_ENTRY: {
        type          : 'SPOT_ENTRY',
        marker_config : MARKER_CONTENT_TYPES.SPOT_ENTRY,
        content_config: { className: 'chart-spot__entry' },
    },
    SPOT_SELL: {
        type          : 'SPOT_SELL',
        marker_config : MARKER_CONTENT_TYPES.SPOT_SELL,
        content_config: { className: 'chart-spot__sell' },
    },
    SPOT_EXIT: {
        type          : 'SPOT_EXIT',
        marker_config : MARKER_CONTENT_TYPES.SPOT,
        content_config: { spot_className: 'chart-spot__spot' },
    },
    SPOT_MIDDLE: {
        type          : 'SPOT_MIDDLE',
        marker_config : MARKER_CONTENT_TYPES.SPOT,
        content_config: { spot_className: 'chart-spot__spot' },
    },
};
