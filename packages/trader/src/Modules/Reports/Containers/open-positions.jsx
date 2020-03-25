import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper, ProgressBar } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { urlFor } from '_common/url';
import DataList from 'App/Components/Elements/DataList';
import DataTable from 'App/Components/Elements/DataTable';
import { getTimePercentage } from 'App/Components/Elements/PositionsDrawer/helpers';
import { website_name } from 'App/Constants/app-config';
import { getContractPath } from 'App/Components/Routes/helpers';
import { getContractDurationType } from 'Modules/Reports/Helpers/market-underlying';
import EmptyTradeHistoryMessage from 'Modules/Reports/Components/empty-trade-history-message.jsx';
import { ReportsMeta } from 'Modules/Reports/Components/reports-meta.jsx';
import { getOpenPositionsColumnsTemplate } from 'Modules/Reports/Constants/data-table-constants';
import PlaceholderComponent from 'Modules/Reports/Components/placeholder-component.jsx';
import { connect } from 'Stores/connect';

class OpenPositions extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    mobileRowRenderer = ({ row, is_footer }) => {
        if (is_footer) {
            return (
                <>
                    <span className='open-positions__data-list-footer--title'>Total</span>
                    <div className='open-positions__data-list-footer--content'>
                        <div>
                            <DataList.Cell row={row} column={this.columns_map.purchase} />
                            <DataList.Cell row={row} column={this.columns_map.payout} />
                        </div>
                        <div>
                            <DataList.Cell
                                className='data-list__row-cell--amount'
                                row={row}
                                column={this.columns_map.indicative}
                            />
                            <DataList.Cell
                                className='data-list__row-cell--amount'
                                row={row}
                                column={this.columns_map.profit}
                            />
                        </div>
                    </div>
                </>
            );
        }

        const { server_time } = this.props;
        const { contract_info } = row;
        const { date_expiry, date_start } = contract_info;
        const duration_type = getContractDurationType(contract_info.longcode);
        const progress_value = getTimePercentage(server_time, date_start, date_expiry) / 100;

        return (
            <>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.type} />
                    <ProgressBar label={duration_type} value={progress_value} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.reference} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.purchase} />
                    <DataList.Cell
                        className='data-list__row-cell--amount'
                        row={row}
                        column={this.columns_map.indicative}
                    />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.payout} />
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={this.columns_map.profit} />
                </div>
            </>
        );
    };

    getRowAction = row_obj =>
        row_obj.is_unsupported
            ? {
                  component: (
                      <Localize
                          i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to <0>Binary.com</0> for details.'
                          values={{
                              website_name,
                          }}
                          components={[
                              <a
                                  key={0}
                                  className='link link--orange'
                                  rel='noopener noreferrer'
                                  target='_blank'
                                  href={urlFor('user/portfoliows', undefined, undefined, true)}
                              />,
                          ]}
                      />
                  ),
              }
            : getContractPath(row_obj.id);

    // After refactoring transactionHandler for creating positions,
    // purchase property in contract positions object is somehow NaN or undefined in the first few responses.
    // So we set it to true in these cases to show a preloader for the data-table-row until the correct value is set.
    isPurchaseReceived = item => isNaN(item.purchase) || !item.purchase;

    render() {
        const { active_positions, component_icon, is_loading, error, is_empty, currency, totals } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        this.columns = getOpenPositionsColumnsTemplate(currency);
        this.columns_map = this.columns.reduce((map, item) => {
            map[item.col_index] = item;
            return map;
        }, {});

        return (
            <React.Fragment>
                <ReportsMeta
                    className='open-positions__reports-meta'
                    i18n_heading={localize('Open positions')}
                    i18n_message={localize(
                        'View all active trades on your account that can still incur a profit or a loss.'
                    )}
                />
                {is_loading || active_positions.length === 0 || is_empty ? (
                    <PlaceholderComponent
                        is_loading={is_loading || !active_positions}
                        is_empty={is_empty}
                        empty_message_component={EmptyTradeHistoryMessage}
                        component_icon={component_icon}
                        localized_message={localize('You have no open positions yet.')}
                    />
                ) : (
                    currency &&
                    active_positions.length > 0 && (
                        <>
                            <DesktopWrapper>
                                <DataTable
                                    className='open-positions'
                                    columns={this.columns}
                                    preloaderCheck={this.isPurchaseReceived}
                                    footer={totals}
                                    data_source={active_positions}
                                    getRowAction={this.getRowAction}
                                    getRowSize={() => 63}
                                    custom_width={'100%'}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataTable>
                            </DesktopWrapper>
                            <MobileWrapper>
                                <DataList
                                    className='open-positions'
                                    data_source={active_positions}
                                    footer={totals}
                                    rowRenderer={this.mobileRowRenderer}
                                    getRowAction={this.getRowAction}
                                    custom_width={'100%'}
                                    getRowSize={() => 194}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataList>
                            </MobileWrapper>
                        </>
                    )
                )}
            </React.Fragment>
        );
    }
}

OpenPositions.propTypes = {
    active_positions: MobxPropTypes.arrayOrObservableArray,
    component_icon: PropTypes.string,
    currency: PropTypes.string,
    error: PropTypes.string,
    history: PropTypes.object,
    is_empty: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_tablet: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    server_time: PropTypes.object,
    totals: PropTypes.object,
};

export default connect(({ modules, client, common }) => ({
    currency: client.currency,
    active_positions: modules.portfolio.active_positions,
    error: modules.portfolio.error,
    is_empty: modules.portfolio.is_active_empty,
    is_loading: modules.portfolio.is_loading,
    onMount: modules.portfolio.onMount,
    onUnmount: modules.portfolio.onUnmount,
    server_time: common.server_time,
    totals: modules.portfolio.active_positions_totals,
}))(withRouter(OpenPositions));
