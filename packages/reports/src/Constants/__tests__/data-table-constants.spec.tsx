import React from 'react';
import {
    getAccumulatorOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate,
    getOpenPositionsColumnsTemplate,
    getProfitTableColumnsTemplate,
    getStatementTableColumnsTemplate,
} from 'Constants/data-table-constants';
import { render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { TCellContentProps } from 'Types';
import moment from 'moment';

jest.mock('@deriv/translations', () => ({
    localize: jest.fn(text => text),
    Localize: jest.fn(text => text),
}));

jest.mock('@deriv/shared', () => ({
    isMobile: jest.fn(),
    getCurrencyDisplayCode: jest.fn(currency => currency),
    getTotalProfit: jest.fn(contract_info => {
        const { bid_price, buy_price } = contract_info;
        return Number(bid_price) - Number(buy_price);
    }),
    getGrowthRatePercentage: jest.fn(growth_rate => `${growth_rate * 100}`),
}));

jest.mock('../../Containers/progress-slider-stream', () => jest.fn(() => 'ProgressSliderStream'));

jest.mock('Components/indicative-cell', () => {
    return {
        __esModule: true,
        default: () => <div>indicativeCell</div>,
    };
});
jest.mock('Components/currency-wrapper', () => {
    return {
        __esModule: true,
        default: ({ currency }: { currency: string }) => <div>{currency}</div>,
    };
});

jest.mock('Components/market-symbol-icon-row', () => {
    return {
        __esModule: true,
        default: ({ payload }: { payload: { id: string; transaction_id?: string } }) => (
            <div>{payload.id || payload.transaction_id}</div>
        ),
    };
});

jest.mock('@deriv/components', () => ({
    __esModule: true,
    ContractCard: {
        MultiplierCloseActions: ({ contract_info }: { contract_info: { contract_id: string } }) => (
            <div>{contract_info.contract_id}</div>
        ),
    },
    ContractCardSell: ({ contract_info }: { contract_info: { contract_id: string } }) => (
        <div>{contract_info.contract_id}</div>
    ),
    Money: ({ amount }: { amount: string }) => <div>{amount}</div>,
    ArrowIndicator: jest.fn(() => 'arrowIndicator'),
}));

describe('getStatementTableColumnsTemplate', () => {
    const currency = 'USD';
    const columns = getStatementTableColumnsTemplate(currency, true);

    it('should return the correct number of columns', () => {
        expect(columns).toHaveLength(7);
    });
    it('should correctly define the "Type" column for non-mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        const typeColumn = columns[0];
        expect(typeColumn.title).toBe('Type');
    });
    it('should correctly define the "Ref. ID" column', () => {
        const refIdColumn = columns[1];
        expect(refIdColumn.title).toBe('Ref. ID');
    });
    it('should correctly define the "Currency" column', () => {
        const currencyColumn = columns[2];
        expect(currencyColumn.title).toBe('Currency');
    });
    it('should correctly define the "Transaction time" column', () => {
        const transactionTimeColumn = columns[3];
        expect(transactionTimeColumn.title).toBe('Transaction time');
    });
    it('should correctly define the "Transaction" column', () => {
        const transactionColumn = columns[4];
        expect(transactionColumn.title).toBe('Transaction');
    });
    it('should correctly define the "Credit/Debit" column', () => {
        const creditDebitColumn = columns[5];
        expect(creditDebitColumn.title).toBe('Credit/Debit');
    });
    it('should correctly define the "Balance" column', () => {
        const balanceColumn = columns[6];
        expect(balanceColumn.title).toBe('Balance');
    });
    it('should render cell content for "Currency" column', () => {
        const currencyColumn = columns[2];
        render(currencyColumn.renderCellContent({} as TCellContentProps));

        expect(screen.getByText(currency)).toBeInTheDocument();
    });
    it('should render cell content for "Transaction time" column', () => {
        const transactionTimeColumn = columns[3];
        const cell_value = '2023-01-01 12:00:00';
        render(transactionTimeColumn.renderCellContent({ cell_value } as TCellContentProps));

        expect(screen.getByText(`${cell_value} GMT`)).toBeInTheDocument();
    });
    it('should render cell content for "Credit/Debit" column', () => {
        const creditDebitColumn = columns[5];
        const cell_value = '1000';
        render(creditDebitColumn.renderCellContent({ cell_value } as TCellContentProps));
        expect(screen.getByText(cell_value.replace(/[,]+/g, ''))).toBeInTheDocument();
    });
    it('should render cell content for "Balance" column', () => {
        const balanceColumn = columns[6];
        const cell_value = '2000';
        render(balanceColumn.renderCellContent({ cell_value } as TCellContentProps));

        expect(screen.getByText(cell_value)).toBeInTheDocument();
    });
});

describe('getProfitTableColumnsTemplate', () => {
    const currency = 'USD';
    const items_count = 10;
    const columns = getProfitTableColumnsTemplate(currency, items_count);
    const props = {
        cell_value: '',
        is_footer: false,
        passthrough: {},
        row_obj: {},
        is_turbo: false,
        is_vanilla: false,
    };

    it('should render cell content for "Type" column', () => {
        const typeColumn = columns[0];
        const row_obj = { transaction_id: '123' };
        if (typeColumn.renderCellContent)
            render(typeColumn.renderCellContent({ ...props, row_obj, is_footer: false }) as JSX.Element);

        expect(screen.getByText(row_obj.transaction_id)).toBeInTheDocument();
    });
    it('should render footer content for "Type" column', () => {
        const typeColumn = columns[0];
        if (typeColumn.renderCellContent)
            render(typeColumn.renderCellContent({ ...props, is_footer: true }) as JSX.Element);

        expect(screen.getByText(/on the last/i)).toBeInTheDocument();
    });
    it('should render cell content for "Currency" column', () => {
        const currencyColumn = columns[2];
        if (currencyColumn.renderCellContent)
            render(currencyColumn.renderCellContent({ ...props, is_footer: false }) as JSX.Element);

        expect(screen.getByText(currency)).toBeInTheDocument();
    });
    it('should render cell content for "Buy time" column', () => {
        const buyTimeColumn = columns[3];
        const cell_value = '2023-05-30 12:34:56';
        if (buyTimeColumn.renderCellContent)
            render(buyTimeColumn.renderCellContent({ ...props, cell_value, is_footer: false }) as JSX.Element);

        expect(screen.getByText(`${cell_value} GMT`)).toBeInTheDocument();
    });
    it('should render cell content for "Stake" column', () => {
        const stakeColumn = columns[4];
        const cell_value = '1000';
        if (stakeColumn.renderCellContent)
            render(stakeColumn.renderCellContent({ ...props, cell_value, is_footer: false }) as JSX.Element);

        expect(screen.getByText(cell_value)).toBeInTheDocument();
    });
    it('should render cell content for "Sell time" column', () => {
        const sellTimeColumn = columns[5];
        const cell_value = '2023-05-30 13:34:56';
        if (sellTimeColumn.renderCellContent)
            render(sellTimeColumn.renderCellContent({ ...props, cell_value, is_footer: false }) as JSX.Element);

        expect(screen.getByText(`${cell_value} GMT`)).toBeInTheDocument();
    });
    it('should render cell content for "Contract value" column', () => {
        const contractValueColumn = columns[6];
        const cell_value = '2000';
        if (contractValueColumn.renderCellContent)
            render(contractValueColumn.renderCellContent({ ...props, cell_value, is_footer: false }) as JSX.Element);

        expect(screen.getByText(cell_value)).toBeInTheDocument();
    });
    it('should render cell content for "Total profit/loss" column', () => {
        const totalProfitLossColumn = columns[7];
        const cell_value = '500';
        if (totalProfitLossColumn.renderCellContent)
            render(totalProfitLossColumn.renderCellContent({ ...props, cell_value }) as JSX.Element);

        expect(screen.getByText(cell_value)).toBeInTheDocument();
    });
});

describe('getOpenPositionsColumnsTemplate', () => {
    const currency = 'USD';

    it('should render all columns correctly', () => {
        const columns = getOpenPositionsColumnsTemplate(currency);

        columns.forEach(column => {
            const { title } = column;
            if (title) {
                render(<div>{title}</div>);
                expect(screen.getByText(title)).toBeInTheDocument();
            }
        });
    });
    it('should render cell content correctly for each column', () => {
        const dummyRowObj = {
            id: 'dummy_id',
            contract_info: {
                id: 'contract_info_id',
                currency: 'USD',
                profit: 100,
            },
            barrier: 1.2345,
            is_sell_requested: false,
            profit_loss: 50,
        };

        const columns = getOpenPositionsColumnsTemplate(currency);
        columns.forEach(column => {
            const { renderCellContent: content, col_index } = column;
            if (content) {
                let cell_value = '1000';
                if (col_index === 'profit') cell_value = '50';
                if (col_index === 'type') cell_value = 'Type';

                const cellContent = content({
                    row_obj: dummyRowObj,
                    cell_value,
                    is_footer: false,
                    is_vanilla: false,
                    is_turbos: false,
                    passthrough: {},
                });

                render(<div>{cellContent}</div>);
                if (col_index === 'type') {
                    expect(screen.getByText(dummyRowObj.contract_info.id)).toBeInTheDocument();
                } else if (col_index === 'currency') {
                    expect(screen.getByText(dummyRowObj.contract_info.currency)).toBeInTheDocument();
                } else if (col_index === 'purchase' || col_index === 'profit') {
                    expect(screen.getByText(String(cell_value))).toBeInTheDocument();
                } else if (col_index === 'indicative') {
                    expect(screen.getByText('indicativeCell')).toBeInTheDocument();
                } else if (col_index === 'id') {
                    expect(screen.getByText(dummyRowObj.contract_info.id)).toBeInTheDocument();
                }
            }
        });
    });
});

describe('getMultiplierOpenPositionsColumnsTemplate', () => {
    const currency = 'USD';
    const onClickCancel = jest.fn();
    const onClickSell = jest.fn();
    const getPositionById = jest.fn();
    const server_time = moment('2024-01-01T12:00:00Z');

    const columns = getMultiplierOpenPositionsColumnsTemplate({
        currency,
        onClickCancel,
        onClickSell,
        getPositionById,
        server_time,
    });

    const typeColumn = columns[0];
    const limitOrderColumn = columns[6];
    const bidPriceColumn = columns[7];
    const profitColumn = columns[8];
    const actionColumn = columns[9];

    const dummyRowObj = {
        id: 'dummy_id',
        contract_info: {
            id: 'contract_info_id',
            currency: 'USD',
            profit: 200,
            buy_price: 1000,
            bid_price: 1200,
            multiplier: 2,
            limit_order: {
                take_profit: { order_amount: 1500 },
                stop_loss: { order_amount: 500 },
            },
            cancellation: { ask_price: 50 },
            contract_id: 'contract_123',
            underlying: '1HZ10V',
        },
        barrier: 1.2345,
        is_sell_requested: false,
        profit_loss: 50,
    };
    const cell_value = '1000';
    const input_mocked_obj = {
        row_obj: dummyRowObj,
        cell_value,
        is_footer: false,
        is_vanilla: false,
        is_turbos: false,
        passthrough: {},
    };

    it('should render all columns correctly', () => {
        columns.forEach(column => {
            const { col_index } = column;
            if (col_index) {
                render(<div>{col_index}</div>);
                expect(screen.getByText(col_index)).toBeInTheDocument();
            }
        });
    });

    it('should render cell content correctly for each column', () => {
        columns.forEach(column => {
            const { renderCellContent: content, col_index } = column;
            if (content) {
                const cellContent = content({ ...input_mocked_obj });
                render(<div>{cellContent}</div>);

                switch (col_index) {
                    case 'type':
                        expect(screen.getByText(dummyRowObj.contract_info.id)).toBeInTheDocument();
                        break;
                    case 'multiplier':
                        expect(screen.getByText(`x${dummyRowObj.contract_info.multiplier}`)).toBeInTheDocument();
                        break;
                    case 'currency':
                        expect(screen.getByText(dummyRowObj.contract_info.currency)).toBeInTheDocument();
                        break;
                    default:
                        break;
                }
            }
        });
    });

    it('should render "Total" for the "Type" column when is_footer is true', () => {
        const { renderCellContent: content } = typeColumn;
        const cellContent = content({
            ...input_mocked_obj,
            is_footer: true,
        });

        render(<div>{cellContent}</div>);

        expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('should render empty content for the "Limit Order" column when is_footer is true', () => {
        const { renderCellContent: content } = limitOrderColumn;

        const cellContent = content({
            ...input_mocked_obj,
            is_footer: true,
        });

        render(<div>{cellContent}</div>);

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
    });

    it('should render empty content for the "Bid Price" column when is_footer is true', () => {
        const { renderCellContent: content } = bidPriceColumn;

        const cellContent = content({
            ...input_mocked_obj,
            is_footer: true,
        });

        render(<div>{cellContent}</div>);

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
    });

    it('should render empty content for the "Profit" column when is_footer is true', () => {
        const { renderCellContent: content } = profitColumn;

        const cellContent = content({
            ...input_mocked_obj,
            is_footer: true,
        });

        render(<div>{cellContent}</div>);

        expect(screen.queryByText('USD')).not.toBeInTheDocument();
    });

    it('should render row action element for the "Action" column when is_footer is true', () => {
        const { renderCellContent: content } = actionColumn;

        const cellContent = content({
            ...input_mocked_obj,
            is_footer: true,
        });

        render(<div data-testid='row-action'>{cellContent}</div>);

        expect(screen.getByTestId('row-action')).toBeInTheDocument();
    });
});

describe('getAccumulatorOpenPositionsColumnsTemplate', () => {
    const currency = 'USD';
    const onClickSell = jest.fn();
    const getPositionById = jest.fn();

    const dummyRowObj = {
        id: 'dummy_id',
        contract_info: {
            id: 'contract_info_id',
            currency: 'USD',
            growth_rate: 0.1,
            buy_price: 1000,
            limit_order: { take_profit: { order_amount: 1500 } },
            bid_price: 1200,
            profit: 200,
        },
        barrier: 1.2345,
        is_sell_requested: false,
    };

    const cell_value = '1000';
    const input_mocked_obj = {
        row_obj: dummyRowObj,
        cell_value,
        is_footer: false,
        is_vanilla: false,
        is_turbos: false,
        passthrough: {},
    };

    it('should return the correct number of columns', () => {
        const columns = getAccumulatorOpenPositionsColumnsTemplate({
            currency,
            onClickSell,
            getPositionById,
        });

        expect(columns).toHaveLength(8);
    });

    it('should render all columns correctly', () => {
        const columns = getAccumulatorOpenPositionsColumnsTemplate({
            currency,
            onClickSell,
            getPositionById,
        });

        columns.forEach(column => {
            const { title } = column;
            if (title) {
                render(<div>{title}</div>);
                expect(screen.getByText(title)).toBeInTheDocument();
            }
        });
    });

    it('should render cell content correctly for each column', () => {
        const columns = getAccumulatorOpenPositionsColumnsTemplate({
            currency,
            onClickSell,
            getPositionById,
        });

        columns.forEach(column => {
            const { renderCellContent: content, col_index } = column;
            const cellContent = content(input_mocked_obj);

            render(<div>{cellContent}</div>);

            switch (col_index) {
                case 'type':
                    expect(screen.getByText('contract_info_id')).toBeInTheDocument();
                    break;
                case 'growth_rate':
                    expect(screen.getByText('10%')).toBeInTheDocument();
                    break;
                case 'currency':
                    expect(screen.getByText('USD')).toBeInTheDocument();
                    break;
                case 'purchase':
                case 'buy_price':
                    expect(screen.getByText('1000')).toBeInTheDocument();
                    break;
                case 'limit_order':
                    expect(screen.getByText('1500')).toBeInTheDocument();
                    break;
                case 'bid_price':
                    expect(screen.getByText('1200')).toBeInTheDocument();
                    break;
                case 'profit':
                    expect(screen.getByText('200')).toBeInTheDocument();
                    break;
                case 'action':
                    expect(screen.getByText('contract_info_id')).toBeInTheDocument();
                    break;
                default:
                    break;
            }
        });
    });

    it('should return "Total" for "type" column when is_footer is true', () => {
        const columns = getAccumulatorOpenPositionsColumnsTemplate({
            currency,
            onClickSell,
            getPositionById,
        });

        const typeColumn = columns.find(column => column.col_index === 'type');
        if (typeColumn) {
            const { renderCellContent: content } = typeColumn;
            const cellContent = content({ ...input_mocked_obj, row_obj: {}, is_footer: true });
            expect(cellContent).toEqual('Total');
        }
    });

    it('should return "-" for "purchase" column when contract_info is undefined', () => {
        const columns = getAccumulatorOpenPositionsColumnsTemplate({
            currency,
            onClickSell,
            getPositionById,
        });

        const purchaseColumn = columns.find(column => column.col_index === 'purchase');
        if (purchaseColumn) {
            const { renderCellContent: content } = purchaseColumn;
            const cellContent = content({ ...input_mocked_obj, row_obj: {} });
            expect(cellContent).toEqual('');
        }
    });

    it('should return "-" for "bid_price" column when contract_info.bid_price is undefined', () => {
        const columns = getAccumulatorOpenPositionsColumnsTemplate({
            currency,
            onClickSell,
            getPositionById,
        });

        const bidPriceColumn = columns.find(column => column.col_index === 'bid_price');
        if (bidPriceColumn) {
            const { renderCellContent: content } = bidPriceColumn;
            const cellContent = content({ ...input_mocked_obj, row_obj: {} });
            expect(cellContent).toEqual('-');
        }
    });
});
