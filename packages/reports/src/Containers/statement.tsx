import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper, DataList, DataTable, Text, Clipboard, usePrevious } from '@deriv/components';
import {
    capitalizeFirstLetter,
    extractInfoFromShortcode,
    formatDate,
    getContractPath,
    getSupportedContracts,
    getUnsupportedContracts,
    isForwardStarting,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import { getStatementTableColumnsTemplate } from '../Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component';
import AccountStatistics from '../Components/account-statistics';
import FilterComponent from '../Components/filter-component';
import { ReportsMeta } from '../Components/reports-meta';
import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message';
import { observer, useStore } from '@deriv/stores';
import { useReportsStore } from 'Stores/useReportsStores';
import { TSupportedContractType, TUnsupportedContractType } from 'Types';
import { TSource } from '@deriv/components/src/components/data-table/data-table';
import { TRow } from '@deriv/components/src/components/types/common.types';

type TGetStatementTableColumnsTemplate = ReturnType<typeof getStatementTableColumnsTemplate>;
type TColIndex = 'icon' | 'refid' | 'currency' | 'date' | 'action_type' | 'amount' | 'balance';

type TAction =
    | {
          message?: string;
          component?: React.ReactElement;
      }
    | string;

type TStatement = {
    component_icon: string;
};

type TDetailsComponent = {
    message: string;
    action_type: string;
};

type TDataList = React.ComponentProps<typeof DataList>;
type TDataListCell = React.ComponentProps<typeof DataList.Cell>;

const DetailsComponent = ({ message = '', action_type = '' }: TDetailsComponent) => {
    const address_hash_match = /:\s([0-9a-zA-Z]+.{25,28})/gm.exec(message.split(/,\s/)[0]);
    const address_hash = address_hash_match?.[1];
    const blockchain_hash_match = /:\s([0-9a-zA-Z]+.{25,34})/gm.exec(message.split(/,\s/)[1]);
    const blockchain_hash = blockchain_hash_match?.[1];

    let messages = [message];

    if (address_hash || blockchain_hash) {
        const lines = message.split(/,\s/);
        messages = lines.map((text, index) => {
            return capitalizeFirstLetter(index !== lines.length - 1 ? `${text}, ` : text);
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

type TGetRowAction = TDataList['getRowAction'] | React.ComponentProps<typeof DataTable>['getRowAction'];

const getRowAction: TGetRowAction = (row_obj: TSource | TRow) => {
    let action: TAction = {};
    if (row_obj.id && ['buy', 'sell'].includes(row_obj.action_type)) {
        const contract_type = extractInfoFromShortcode(row_obj.shortcode)?.category?.toUpperCase();
        action =
            getSupportedContracts()[contract_type as TSupportedContractType] &&
            !isForwardStarting(row_obj.shortcode, row_obj.purchase_time || row_obj.transaction_time)
                ? getContractPath(row_obj.id)
                : {
                      message: '',
                      component: (
                          <Localize
                              i18n_default_text="The {{trade_type_name}} contract details aren't currently available. We're working on making them available soon."
                              values={{
                                  trade_type_name:
                                      getUnsupportedContracts()[contract_type as TUnsupportedContractType]?.name,
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

const Statement = observer(({ component_icon }: TStatement) => {
    const { client } = useStore();
    const { statement } = useReportsStore();
    const { currency, standpoint, is_switching, is_virtual } = client;
    const {
        action_type,
        data,
        date_from,
        date_to,
        error,
        handleScroll,
        has_selected_date,
        is_empty,
        is_loading,
        onMount,
        onUnmount,
    } = statement;
    const is_mx_mlt = standpoint.iom || standpoint.malta;
    const prev_action_type = usePrevious(action_type);
    const prev_date_from = usePrevious(date_from);
    const prev_date_to = usePrevious(date_to);

    React.useEffect(() => {
        onMount();
        Analytics.trackEvent('ce_reports_form', {
            action: 'choose_report_type',
            form_name: 'default',
            subform_name: 'statement_form',
            transaction_type_filter: action_type,
            start_date_filter: formatDate(date_from, 'DD/MM/YYYY', false),
            end_date_filter: formatDate(date_to, 'DD/MM/YYYY', false),
        });
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (prev_action_type) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_transaction_type',
                form_name: 'default',
                subform_name: 'statement_form',
                transaction_type_filter: action_type,
            });
        }
    }, [action_type]);

    React.useEffect(() => {
        if (prev_date_from !== undefined && prev_date_to !== undefined) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_dates',
                form_name: 'default',
                subform_name: 'statement_form',
                start_date_filter: formatDate(date_from, 'DD/MM/YYYY', false),
                end_date_filter: formatDate(date_to, 'DD/MM/YYYY', false),
            });
        }
    }, [date_to, date_from]);

    if (error) return <p>{error}</p>;

    const columns: TGetStatementTableColumnsTemplate = getStatementTableColumnsTemplate(currency);
    const columns_map = columns.reduce((map, item) => {
        map[item.col_index as TColIndex] = item;
        return map;
    }, {} as Record<TColIndex, typeof columns[number]>);

    // TODO: Export type instead of any from 'DataList' component when it migrates to tsx
    const mobileRowRenderer = ({
        row,
        passthrough,
    }: Pick<Parameters<TDataList['rowRenderer']>[0], 'row' | 'passthrough'>) => (
        <React.Fragment>
            <div className='data-list__row'>
                <DataList.Cell
                    row={row}
                    column={columns_map.icon as TDataListCell['column']}
                    passthrough={passthrough}
                />
                <DataList.Cell
                    row={row}
                    column={columns_map.action_type as TDataListCell['column']}
                    passthrough={passthrough}
                />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.refid as TDataListCell['column']} />
                <DataList.Cell
                    className='data-list__row-cell--amount'
                    row={row}
                    column={columns_map.currency as TDataListCell['column']}
                />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.date as TDataListCell['column']} />
                <DataList.Cell
                    className='data-list__row-cell--amount'
                    row={row}
                    column={columns_map.amount as TDataListCell['column']}
                />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.balance as TDataListCell['column']} />
            </div>
        </React.Fragment>
    );
    // TODO: Uncomment and update this when DTrader 2.0 development starts:
    // if (useFeatureFlags().is_dtrader_v2_enabled) return <Text size='l'>I am Statement for DTrader 2.0.</Text>;
    return (
        <React.Fragment>
            <ReportsMeta
                className={is_mx_mlt ? undefined : 'reports__meta--statement'}
                filter_component={<FilterComponent />}
                is_statement
                optional_component={!is_switching && is_mx_mlt && <AccountStatistics />}
            />
            {is_switching ? (
                <PlaceholderComponent is_loading />
            ) : (
                <React.Fragment>
                    {data?.length === 0 || is_empty ? (
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
                                    getRowAction={getRowAction}
                                    onScroll={handleScroll}
                                    passthrough={{
                                        isTopUp: (item: { action?: string }) => is_virtual && item.action === 'Deposit',
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
                                        isTopUp: (item: { action?: string }) => is_virtual && item.action === 'Deposit',
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
});

export default withRouter(Statement);
