const Table = (() => {
    /**
     *
     * @param {Array[]} body ordered data to pump into table body
     * @param {Object} metadata object containing metadata of table
     * @param {String[]} metadata.cols cols of table
     * @param {String} metadata.id table id
     * @param {String[]} [metadata.tableClass] class used in html
     * @param {String[]} [header] string to be used as Header in table, if not stated then table will not have Header
     * @param {String[]} [footer] string to be used as footer, to have empty footer, use an empty element in array
     * eg. ["", "halo", ""] will have 3 elements in footer, 2 of them being empty
     */
    const createFlexTable = (body, metadata, header, footer) => {
        const $table_container = $('<div></div>', { class: 'table-container' });
        const $table           = $('<table></table>', { class: metadata.tableClass || '', id: metadata.id });
        const $body            = createFlexTableTopGroup(body, metadata.cols, 'body');

        if (header) {
            const $header = createFlexTableTopGroup([header], metadata.cols, 'header');
            $header.appendTo($table);
        }

        $body.appendTo($table);

        if (footer) {
            const $footer = createFlexTableTopGroup([footer], metadata.cols, 'footer');
            $footer.appendTo($table);
        }

        $table.appendTo($table_container);

        return $table_container;
    };

    /**
     *
     * @param {object[][]} data header strings
     * @param {String[]} metadata cols name
     * @param {'header'|'footer'|'body'} opt optional arg, specifies type of element to create. default to header
     */
    const createFlexTableTopGroup = (data, metadata, opt) => {
        const $outer = (() => {
            switch (opt) {
                case 'body':
                    return $('<tbody></tbody>');
                case 'footer':
                    return $('<tfoot></tfoot>');
                default :
                    return $('<thead></thead>');
            }
        })();

        for (let i = 0; i < data.length; i++) {
            const inner_type = (opt === 'body') ? 'data' : 'header';
            const $tr        = createFlexTableRow(data[i], metadata, inner_type);
            $tr.appendTo($outer);
        }

        return $outer;
    };

    /**
     *
     * @param {object[]} data
     * @param {String[]} metadata cols name
     * @param {'header'|'data'} opt optional, default to "header"
     */
    const createFlexTableRow = (data, metadata, opt) => {
        if (data.length !== metadata.length) {
            throw new Error('metadata and data does not match');
        }

        const is_data = (opt === 'data');

        const $tr = $('<tr></tr>');
        for (let i = 0; i < data.length; i++) {
            const class_name  = metadata[i].toLowerCase().replace(/\s/g, '-');
            const row_element = (is_data) ?
                $('<td></td>', { class: class_name, html: data[i] }) :
                $('<th></th>', { class: class_name, html: data[i] });
            row_element.appendTo($tr);
        }

        return $tr;
    };

    const clearTableBody = (id) => {
        const tbody = document.querySelector(`#${id} > tbody`);
        while (tbody && tbody.firstElementChild) {
            tbody.removeChild(tbody.firstElementChild);
        }
    };

    /**
     *
     * @param {String} id table id
     * @param {Object[]} data array of data to be transform to row
     * @param {Function} rowGenerator takes in one arg, and convert it into row to be append to table body
     */
    const appendTableBody = (id, data, rowGenerator) => {
        const tbody = document.querySelector(`#${id} > tbody`);
        if (!tbody) return;
        const doc_frag = document.createDocumentFragment();
        data.map((ele) => {
            const row = rowGenerator(ele);
            doc_frag.appendChild(row);
        });

        tbody.appendChild(doc_frag);
    };

    return {
        createFlexTable,
        createFlexTableRow,
        clearTableBody,
        appendTableBody,
    };
})();

module.exports = Table;
