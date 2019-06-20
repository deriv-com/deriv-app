import React        from 'react';
import { localize } from 'App/i18n';
import AmountCell   from '../Components/amount-cell.jsx';

/* eslint-disable react/display-name, react/prop-types */
export const getTableColumnsTemplate = () =>
    [
        { title: localize('Date'),             col_index: 'date'    },
        { title: localize('Ref.'),             col_index: 'refid'   },
        { title: localize('Description'),      col_index: 'desc'    },
        { title: localize('Action'),           col_index: 'action'  },
        { title: localize('Potential Payout'), col_index: 'payout'  },
        { title: localize('Credit/Debit'),     col_index: 'amount', renderCellContent: ({ cell_value }) => <AmountCell value={cell_value} /> },
        { title: localize('Balance'),          col_index: 'balance' },
    ];
/* eslint-enable react/display-name, react/prop-types */
