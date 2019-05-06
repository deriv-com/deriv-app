const ChartSettings = require('../../../common/chart_settings');
const localize      = require('../../../../_common/localize').localize;

const HighchartUI = (() => {
    let chart_options;

    const updateLabels = (chart, params) => {
        ChartSettings.setLabels(params);
        if (chart) {
            chart.setTitle(null, { text: ChartSettings.getSubtitle() });
        }
    };

    const setChartOptions = (params) => {
        ChartSettings.setChartOptions(params);
        chart_options = ChartSettings.getChartOptions();
    };

    const getHighchartOptions = () => ({
        lang: { thousandsSep: ',' }, // use comma as separator instead of space
    });

    const getPlotlineOptions = (params, type) => {
        const is_plotx = type === 'x';
        const options  = {
            value    : params.value,
            id       : params.id || (is_plotx ? params.value : params.label),
            label    : { text: params.label || '' },
            color    : params.color || (is_plotx ? '#e98024' : 'green'),
            zIndex   : is_plotx ? 2 : 1,
            width    : params.width || 2,
            dashStyle: params.dashStyle || 'Solid',
        };

        if (is_plotx) {
            options.label.x = params.textLeft ? -15 : 5;
        } else {
            options.label.x = params.x || 0;
            options.label.y = params.textBottom ? 15 : -5;
            options.label.align = params.align || 'center';
        }

        return options;
    };

    const showError = (type, message) => {
        $('#analysis_live_chart').html($('<p/>', { class: 'error-msg', text: (type === 'missing' ? localize('Ticks history returned an empty array.') : message) }));
    };

    const getMarkerObject = (type) => {
        const color = type === 'entry' ? 'white' : 'orange';
        return { fillColor: color, lineColor: 'orange', lineWidth: 3, radius: 4, states: { hover: { fillColor: color, lineColor: 'orange', lineWidth: 3, radius: 4 } } };
    };

    return {
        updateLabels,
        setChartOptions,
        getHighchartOptions,
        getPlotlineOptions,
        showError,
        getMarkerObject,
        getChartOptions: () => chart_options,
    };
})();

module.exports = HighchartUI;
