import React                from 'react';
import { localize }         from 'App/i18n';
import Label                from 'App/Components/Elements/Label';
import Money                from 'App/Components/Elements/money.jsx';
import ProgressSliderStream from 'App/Containers/ProgressSliderStream';
import IndicativeCell       from 'Modules/Portfolio/Components/indicative-cell.jsx';
import { getProfitOrLoss }  from 'Modules/Reports/Helpers/profit-loss';
import MarketSymbolIconRow  from '../Components/market-symbol-icon-row.jsx';
import ProfitLossCell       from '../Components/profit_loss_cell.jsx';

const getModeFromValue = (key) => {
    const map = {
        deposit   : 'warn',
        withdrawal: 'info',
        sell      : 'danger',
        buy       : 'success',
        default   : 'default',
    };

    if (Object.keys(map).find(x => x === key)) {
        return map[key];
    }

    return map.default;
};
/* eslint-disable react/display-name, react/prop-types */
export const getStatementTableColumnsTemplate = (currency) => [
    {
        key              : 'icon',
        title            : '',
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj }) => (
            <MarketSymbolIconRow
                action={cell_value}
                key={row_obj.transaction_id}
                payload={row_obj}
            />
        ),
    }, {
        title    : localize('Ref. ID'),
        col_index: 'refid',
    }, {
        title    : localize('Transaction time'),
        col_index: 'date',
    }, {
        key              : 'mode',
        title            : localize('Transaction'),
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj }) => (
            <Label mode={getModeFromValue(cell_value)}>{row_obj.action}</Label>
        ),
    }, {
        title            : localize('Credit/Debit'),
        col_index        : 'amount',
        renderCellContent: ({ cell_value }) => <div className={`amount--${getProfitOrLoss(cell_value)}`} ><Money has_sign amount={cell_value.replace(/[,]+/g, '')} currency={currency} /></div>,
    }, {
        title            : localize('Balance'),
        col_index        : 'balance',
        renderCellContent: ({ cell_value }) => <Money amount={cell_value.replace(/[,]+/g, '')} currency={currency} />,
    },
];
export const getProfitTableColumnsTemplate = (currency) => [
    {
        key              : 'icon',
        title            : '',
        col_index        : 'action_type',
        renderCellContent: ({ cell_value, row_obj, is_footer }) => {
            if (is_footer) return localize('Total profit/loss');

            return (
                <MarketSymbolIconRow
                    action={cell_value}
                    key={row_obj.transaction_id}
                    payload={row_obj}
                />
            );
        },
    }, {
        title    : localize('Ref. ID'),
        col_index: 'transaction_id',
    }, {
        title    : localize('Buy time'),
        col_index: 'purchase_time',
    }, {
        title            : localize('Buy price'),
        col_index        : 'buy_price',
        renderCellContent: ({ cell_value, is_footer }) => {
            if (is_footer) return '';

            return <Money amount={cell_value} currency={currency} />;
        },
    }, {
        title    : localize('Sell time'),
        col_index: 'sell_time',
    }, {
        title            : localize('Sell price'),
        col_index        : 'sell_price',
        renderCellContent: ({ cell_value, is_footer }) => {
            if (is_footer) return '';

            return <Money amount={cell_value} currency={currency} />;
        },
    }, {
        title            : localize('Profit/Loss'),
        col_index        : 'profit_loss',
        renderCellContent: ({ cell_value }) => (
            <ProfitLossCell value={cell_value}>
                <Money has_sign amount={cell_value.replace(/[,]+/g, '')} currency={currency} />
            </ProfitLossCell>
        ),
    },
];
export const getOpenPositionsColumnsTemplate = (currency) => [
    {
        title            : '',
        col_index        : 'type',
        renderCellContent: ({ cell_value, row_obj, is_footer }) => {
            if (is_footer) return localize('Total');

            return (
                <MarketSymbolIconRow
                    action={cell_value}
                    key={row_obj.id}
                    payload={row_obj.contract_info}
                />
            );
        },
    }, {
        title    : localize('Ref. ID'),
        col_index: 'reference',
    }, {
        title            : localize('Buy price'),
        col_index        : 'purchase',
        renderCellContent: ({ cell_value }) => (
            <Money amount={cell_value} currency={currency} />
        ),
    }, {
        title            : localize('Potential payout'),
        col_index        : 'payout',
        renderCellContent: ({ cell_value }) => (
            cell_value ? <Money amount={cell_value} currency={currency} />
                : <span>-</span>
        ),
    }, {
        title            : localize('Indicative price'),
        col_index        : 'indicative',
        renderCellContent: ({ cell_value, row_obj }) => (
            <IndicativeCell amount={+cell_value} currency={currency} status={row_obj.status} />
        ),
    }, {
        title            : localize('Remaining time'),
        col_index        : 'id',
        renderCellContent: ({ cell_value }) => (
            <ProgressSliderStream id={cell_value} />
        ),
    },
];
/* eslint-enable react/display-name, react/prop-types */
