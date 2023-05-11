import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper, DataList, DataTable, Text, Clipboard } from '@deriv/components';
import { extractInfoFromShortcode, isForwardStarting, getUnsupportedContracts, getContractPath } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import { getSupportedContracts } from '_common/contract';
import { connect } from 'Stores/connect';
import { getStatementTableColumnsTemplate } from '../Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component.jsx';
import AccountStatistics from '../Components/account-statistics.jsx';
import FilterComponent from '../Components/filter-component.jsx';
import { ReportsMeta } from '../Components/reports-meta.jsx';
import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message.jsx';

const DetailsComponent = ({ message = '', action_type = '' }) => {
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

const getRowAction = row_obj => {
    let action;
    if (row_obj.id && ['buy', 'sell'].includes(row_obj.action_type)) {
        const contract_type = extractInfoFromShortcode(row_obj.shortcode).category.toUpperCase();
        action =
            getSupportedContracts()[contract_type] &&
            !isForwardStarting(row_obj.shortcode, row_obj.purchase_time || row_obj.transaction_time)
                ? getContractPath(row_obj.id)
                : {
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

    if (action?.message) {
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
}) => {
    React.useEffect(() => {
        onMount();
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) return <p>{error}</p>;

    const columns = getStatementTableColumnsTemplate(currency);
    const columns_map = columns.reduce((map, item) => {
        map[item.col_index] = item;
        return map;
    }, {});

    const mobileRowRenderer = ({ row, passthrough }) => (
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
                                        isTopUp: item => is_virtual && item.action === 'Deposit',
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
                                        isTopUp: item => is_virtual && item.action === 'Deposit',
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

Statement.propTypes = {
    action_type: PropTypes.string,
    account_statistics: PropTypes.object,
    component_icon: PropTypes.string,
    currency: PropTypes.string,
    data: MobxPropTypes.arrayOrObservableArray,
    date_from: PropTypes.number,
    date_to: PropTypes.number,
    error: PropTypes.string,
    filtered_date_range: PropTypes.object,
    handleDateChange: PropTypes.func,
    handleFilterChange: PropTypes.func,
    handleScroll: PropTypes.func,
    has_selected_date: PropTypes.bool,
    is_empty: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_mx_mlt: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default connect(({ modules, client }) => ({
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
}))(withRouter(Statement));
