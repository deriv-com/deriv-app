import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper, DataList, DataTable, Text, Clipboard } from '@deriv/components';
import {
    extractInfoFromShortcode,
    isForwardStarting,
    getUnsupportedContracts,
    getContractPath,
    getSupportedContracts,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import { connect } from 'Stores/connect';
import { getStatementTableColumnsTemplate } from '../Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component';
import AccountStatistics from '../Components/account-statistics';
import FilterComponent from '../Components/filter-component';
import { ReportsMeta } from '../Components/reports-meta';
import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message';
import { TRootStore } from 'Stores/index';

type TGetStatementTableColumnsTemplate = ReturnType<typeof getStatementTableColumnsTemplate>;
type TColIndex = 'icon' | 'refid' | 'currency' | 'date' | 'action_type' | 'amount' | 'balance';

type TFormatStatementTransaction = {
    action: string;
    date: string;
    display_name: string;
    refid: number;
    payout: string;
    amount: string;
    balance: string;
    desc: string;
    id: number;
    app_id: number;
    shortcode: string;
    action_type: string;
    purchase_time: number;
    transaction_time: number;
    withdrawal_details: string;
    longcode: string;
};

type TAction =
    | {
          message?: string;
          component?: React.ReactElement;
      }
    | string;

type TStatement = {
    action_type: string;
    account_statistics: React.ComponentProps<typeof AccountStatistics>['account_statistics'];
    component_icon: string;
    currency: string;
    data: TFormatStatementTransaction[];
    date_from: number | null;
    date_to: number | null;
    error: string;
    filtered_date_range: React.ComponentProps<typeof FilterComponent>['filtered_date_range'];
    handleDateChange: () => void;
    handleFilterChange: () => void;
    handleScroll: () => void;
    has_selected_date: boolean;
    is_empty: boolean;
    is_loading: boolean;
    is_mx_mlt: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    onMount: () => void;
    onUnmount: () => void;
};

type TDetailsComponent = {
    message: string;
    action_type: string;
};

const DetailsComponent = ({ message = '', action_type = '' }: TDetailsComponent) => {
    const address_hash_match = /:\s([0-9a-zA-Z]+.{25,28})/gm.exec(message.split(/,\s/)[0]);
    const address_hash = address_hash_match?.[1];
    const blockchain_hash_match = /:\s([0-9a-zA-Z]+.{25,34})/gm.exec(message.split(/,\s/)[1]);
    const blockchain_hash = blockchain_hash_match?.[1];

    let messages = [message];

    if (address_hash || blockchain_hash) {
        const lines = message.split(/,\s/);
        messages = lines.map((text, index) => {
            if (index !== lines.length - 1) {
                return `${text}, `;
            }
            return text;
        });
    }

    return (
        <Text as='div' size='xs' className='statement__row--detail-text' align='center'>
            {messages.map((text, index) => {
                return (
                    <div key={text}>
                        {text}
                        {blockchain_hash && index === messages.length - 1 && (
                            <Clipboard text_copy={blockchain_hash} popoverAlignment='top' />
                        )}
                        {address_hash && action_type === 'withdrawal' && index === messages.length - 1 && (
                            <Clipboard text_copy={address_hash} popoverAlignment='top' />
                        )}
                    </div>
                );
            })}
        </Text>
    );
};

const getRowAction = (row_obj: TFormatStatementTransaction) => {
    let action: TAction = {};
    if (row_obj.id && ['buy', 'sell'].includes(row_obj.action_type)) {
        const contract_type = extractInfoFromShortcode(row_obj.shortcode).category.toUpperCase();
        action =
            getSupportedContracts()[contract_type] &&
            !isForwardStarting(row_obj.shortcode, row_obj.purchase_time || row_obj.transaction_time)
                ? getContractPath(row_obj.id)
                : {
                      message: '',
                      component: (
                          <Localize
                              i18n_default_text="The {{trade_type_name}} contract details aren't currently available. We're working on making them available soon."
                              values={{
                                  trade_type_name: getUnsupportedContracts()[contract_type]?.name,
                              }}
                          />
                      ),
                  };
    } else if (row_obj.action_type === 'withdrawal') {
        if (row_obj.withdrawal_details && row_obj.longcode) {
            action = {
                message: `${row_obj.withdrawal_details} ${row_obj.longcode}`,
            };
        } else {
            action = {
                message: row_obj.desc,
            };
        }
    } else if (row_obj.desc && ['deposit', 'transfer', 'adjustment', 'hold', 'release'].includes(row_obj.action_type)) {
        action = {
            message: row_obj.desc,
        };
    }

    // add typeof check because action can be object or string
    if (typeof action === 'object' && action?.message) {
        action.component = <DetailsComponent message={action.message} action_type={row_obj.action_type} />;
    }

    return action;
};

const Statement = ({
    account_statistics,
    action_type,
    component_icon,
    currency,
    data,
    date_from,
    date_to,
    error,
    filtered_date_range,
    handleDateChange,
    handleFilterChange,
    handleScroll,
    has_selected_date,
    is_empty,
    is_loading,
    is_mx_mlt,
    is_switching,
    is_virtual,
    onMount,
    onUnmount,
}: TStatement) => {
    React.useEffect(() => {
        onMount();
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) return <p>{error}</p>;

    const columns: TGetStatementTableColumnsTemplate = getStatementTableColumnsTemplate(currency);
    const columns_map = columns.reduce((map, item) => {
        map[item.col_index as TColIndex] = item;
        return map;
    }, {} as Record<TColIndex, typeof columns[number]>);

    // TODO: Export type instead of any from 'DataList' component when it migrates to tsx
    const mobileRowRenderer = ({ row, passthrough }: any) => (
        <React.Fragment>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.icon} passthrough={passthrough} />
                <DataList.Cell row={row} column={columns_map.action_type} passthrough={passthrough} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.refid} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.currency} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.date} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.amount} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.balance} />
            </div>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <ReportsMeta
                className={is_mx_mlt ? undefined : 'reports__meta--statement'}
                filter_component={
                    <FilterComponent
                        action_type={action_type}
                        date_from={date_from}
                        date_to={date_to}
                        handleDateChange={handleDateChange}
                        handleFilterChange={handleFilterChange}
                        filtered_date_range={filtered_date_range}
                    />
                }
                is_statement
                optional_component={
                    !is_switching &&
                    is_mx_mlt && <AccountStatistics account_statistics={account_statistics} currency={currency} />
                }
            />
            {is_switching ? (
                <PlaceholderComponent is_loading />
            ) : (
                <React.Fragment>
                    {data.length === 0 || is_empty ? (
                        <PlaceholderComponent
                            is_loading={is_loading}
                            has_selected_date={has_selected_date}
                            is_empty={is_empty}
                            empty_message_component={EmptyTradeHistoryMessage}
                            component_icon={component_icon}
                            localized_message={localize('You have no transactions yet.')}
                            localized_period_message={localize(
                                "You've made no transactions of this type during this period."
                            )}
                        />
                    ) : (
                        <div className='reports__content'>
                            <DesktopWrapper>
                                <DataTable
                                    className='statement'
                                    columns={columns}
                                    content_loader={ReportsTableRowLoader}
                                    data_source={data}
                                    getRowAction={row => getRowAction(row)}
                                    onScroll={handleScroll}
                                    passthrough={{
                                        isTopUp: (item: TFormatStatementTransaction) =>
                                            is_virtual && item.action === 'Deposit',
                                    }}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataTable>
                            </DesktopWrapper>
                            <MobileWrapper>
                                <DataList
                                    className='statement'
                                    data_source={data}
                                    getRowAction={getRowAction}
                                    onScroll={handleScroll}
                                    rowRenderer={mobileRowRenderer}
                                    row_gap={8}
                                    passthrough={{
                                        isTopUp: (item: TFormatStatementTransaction) =>
                                            is_virtual && item.action === 'Deposit',
                                    }}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataList>
                            </MobileWrapper>
                        </div>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default withRouter(
    connect(({ modules, client }: TRootStore) => ({
        action_type: modules.statement.action_type,
        account_statistics: modules.statement.account_statistics,
        currency: client.currency,
        data: modules.statement.data,
        date_from: modules.statement.date_from,
        date_to: modules.statement.date_to,
        error: modules.statement.error,
        filtered_date_range: modules.statement.filtered_date_range,
        handleDateChange: modules.statement.handleDateChange,
        handleFilterChange: modules.statement.handleFilterChange,
        handleScroll: modules.statement.handleScroll,
        has_selected_date: modules.statement.has_selected_date,
        is_empty: modules.statement.is_empty,
        is_loading: modules.statement.is_loading,
        is_mx_mlt: client.standpoint.iom || client.standpoint.malta,
        is_switching: client.is_switching,
        is_virtual: client.is_virtual,
        onMount: modules.statement.onMount,
        onUnmount: modules.statement.onUnmount,
    }))(Statement)
);
