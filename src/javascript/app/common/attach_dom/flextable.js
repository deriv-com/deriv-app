const Table = require('./table');

const FlexTableUI = (() => {
    let config;

    const init = (conf) => {
        config = conf;

        const $tableContainer = Table.createFlexTable(
            [],
            getMetadata(),
            config.header,
            config.footer);

        // Table.appendTablebody expects the table to already
        // exist in the DOM, so we need to append first
        $tableContainer.appendTo(config.container);
        extend(config.data);
    };

    const getMetadata = () => (
        {
            id        : config.id,
            tableClass: config.class,
            cols      : config.cols,
        }
    );

    const extend = (data) => {
        const cols      = config.cols;
        const formatter = config.formatter;
        const style     = config.style;
        Table.appendTableBody(config.id, data, (datum) => {
            const $row = Table.createFlexTableRow(formatter(datum), cols, 'data');
            if (style) {
                style($row, datum);
            }
            return $row[0];
        });
    };

    const displayError = (message, colspan) => {
        const $tr = $('<tr/>', { class: 'flex-tr' });
        const $td = $('<td/>', { colspan });
        const $p  = $('<p/>', { class: 'notice-msg center-text', text: message });
        return $(`#${config.id} tbody`).append($tr.append($td.append($p)));
    };

    const replace = (data) => {
        if (config) {
            Table.clearTableBody(config.id);
            extend(data);
        }
    };

    const clear = () => {
        if (config) {
            replace([]);
            $(`#${config.id} > tfoot`).hide();
        }
    };

    return {
        init,
        displayError,
        replace,
        clear,
    };
})();

module.exports = FlexTableUI;
