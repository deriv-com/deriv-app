import { PropTypes as MobxPropTypes }           from 'mobx-react';
import PropTypes                                from 'prop-types';
import React                                    from 'react';
import { withRouter }                           from 'react-router-dom';
import { Tabs }                         from 'deriv-components';
import { localize, Localize }                   from 'deriv-translations';
import { urlFor }                               from '_common/url';
import DataTable                                from 'App/Components/Elements/DataTable';
import MultiplierCloseActions                   from 'App/Components/Elements/PositionsDrawer/PositionsDrawerCard/multiplier-close-actions.jsx';
import { website_name }                         from 'App/Constants/app-config';
import { getContractPath }                      from 'App/Components/Routes/helpers';
import EmptyTradeHistoryMessage                 from 'Modules/Reports/Components/empty-trade-history-message.jsx';
import { getOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate } from 'Modules/Reports/Constants/data-table-constants';
import PlaceholderComponent                     from 'Modules/Reports/Components/placeholder-component.jsx';
import { connect }                              from 'Stores/connect';
import { isMultiplierContract }                 from 'Stores/Modules/Contract/Helpers/multiplier';

const getActionColumns = ({ onClickCancel, onClickSell, getPositionById }) => ({ row_obj, is_header, is_footer }) => {
    if (is_header || is_footer) { return <div className='open-positions__row-action' />; }

    const { contract_info } = row_obj;
    const position = getPositionById(contract_info.contract_id);
    const { is_sell_requested } = position || {};

    return (
        <div className='open-positions__row-action'>
            <MultiplierCloseActions
                contract_info={contract_info}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
            />
        </div>
    );
};

const EmptyPlaceholderWrapper = (props) => {
    return (
        <React.Fragment>
            { props.is_empty ?
                <PlaceholderComponent
                    is_empty={props.is_empty}
                    empty_message_component={EmptyTradeHistoryMessage}
                    component_icon={props.component_icon}
                    localized_message={localize('You have no open positions yet.')}
                /> : props.children
            }
        </React.Fragment>);
};

class OpenPositions extends React.Component {
    state = {
        active_index: 0,
    };
    
    componentDidMount() {
        this.props.onMount();

        const { getPositionById, onClickCancel, onClickSell } = this.props;
        this.getActionColumns = getActionColumns({ getPositionById, onClickCancel, onClickSell });

        const { is_multiplier } = this.props;
        this.setState({ active_index: is_multiplier ? 1 : 0 });
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    getRowAction = (row_obj) => (
        row_obj.is_unsupported ?
            {
                component: (
                    <Localize
                        i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to <0>Binary.com</0> for details.'
                        values={{
                            website_name,
                        }}
                        components={[
                            <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href={urlFor('user/portfoliows', undefined, undefined, true)} />,
                        ]}
                    />
                ),
            }
            : getContractPath(row_obj.id)
    );

    // After refactoring transactionHandler for creating positions,
    // purchase property in contract positions object is somehow NaN or undefined in the first few responses.
    // So we set it to true in these cases to show a preloader for the data-table-row until the correct value is set.
    isPurchaseReceived = (item) => isNaN(item.purchase) || !item.purchase;

    getTotals = (active_positions_filtered, is_multiplier_selected) => {
        let totals;

        if (is_multiplier_selected) {
            let ask_price = 0;
            let profit = 0;
            let purchase = 0;

            active_positions_filtered.forEach((portfolio_pos) => {
                purchase   += (+portfolio_pos.purchase);
                if (portfolio_pos.contract_info) {
                    profit += portfolio_pos.contract_info.profit;

                    if (portfolio_pos.contract_info.deal_cancellation) {
                        ask_price += portfolio_pos.contract_info.deal_cancellation.ask_price || 0;
                    }
                }
            });
            totals = {
                contract_info: {
                    profit,
                },
                purchase,
            };

            if (ask_price > 0) {
                totals.contract_info.deal_cancellation = {
                    ask_price,
                };
            }
        } else {
            let indicative = 0;
            let purchase   = 0;

            active_positions_filtered.forEach((portfolio_pos) => {
                indicative += (+portfolio_pos.indicative);
                purchase   += (+portfolio_pos.purchase);
            });
            totals = {
                indicative,
                purchase,
            };
        }
        return totals;
    };

    setActiveTabIndex = (index) => {
        this.setState({ active_index: index });
    };

    render() {
        const {
            active_positions,
            component_icon,
            is_loading,
            error,
            is_empty,
            currency,
            NotificationMessages,
        } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        const is_multiplier_selected = this.state.active_index === 1 ;

        const active_positions_filtered = active_positions.filter((p) => {
            if (p.contract_info) {
                return is_multiplier_selected ? isMultiplierContract(p.contract_info.contract_type)
                    : !isMultiplierContract(p.contract_info.contract_type);
            }
            return true;
        });

        const active_positions_filtered_totals = this.getTotals(active_positions_filtered, is_multiplier_selected);

        return (
            <React.Fragment>
                <NotificationMessages />
                {(is_loading && active_positions.length === 0) || is_empty ?
                    <PlaceholderComponent
                        is_loading={is_loading || !active_positions}
                        is_empty={is_empty}
                        empty_message_component={EmptyTradeHistoryMessage}
                        component_icon={component_icon}
                        localized_message={localize('You have no open positions yet.')}
                    />
                    :
                    currency && active_positions.length > 0 &&
                    <Tabs
                        active_index={ this.state.active_index }
                        className='open-positions'
                        onTabItemClick={this.setActiveTabIndex}
                        top
                        header_fit_content
                    >
                        <div label={ localize('Classic options') }>
                            <EmptyPlaceholderWrapper
                                component_icon={component_icon}
                                is_empty={active_positions_filtered.length === 0}
                            >
                                <DataTable
                                    className='open-positions'
                                    columns={getOpenPositionsColumnsTemplate(currency)}
                                    preloaderCheck={this.isPurchaseReceived}
                                    footer={active_positions_filtered_totals}
                                    data_source={active_positions_filtered}
                                    getRowAction={this.getRowAction}
                                    getRowSize={() => 63}
                                    custom_width={'100%'}
                                >
                                    <PlaceholderComponent
                                        is_loading={is_loading}
                                    />
                                </DataTable>
                            </EmptyPlaceholderWrapper>
                        </div>
                        <div label={ localize('Multiplier options') }>
                            <EmptyPlaceholderWrapper
                                component_icon={component_icon}
                                is_empty={active_positions_filtered.length === 0}
                            >
                                <DataTable
                                    className='open-positions-multiplier open-positions'
                                    columns={getMultiplierOpenPositionsColumnsTemplate(currency)}
                                    preloaderCheck={this.isPurchaseReceived}
                                    footer={active_positions_filtered_totals}
                                    data_source={active_positions_filtered}
                                    getRowAction={this.getRowAction}
                                    getRowSize={() => 63}
                                    custom_width={'100%'}
                                    getActionColumns={this.getActionColumns}
                                >
                                    <PlaceholderComponent
                                        is_loading={is_loading}
                                    />
                                </DataTable>
                            </EmptyPlaceholderWrapper>
                        </div>
                    </Tabs>
                }
            </React.Fragment>

        );
    }
}

OpenPositions.propTypes = {
    active_positions: MobxPropTypes.arrayOrObservableArray,
    component_icon  : PropTypes.string,
    currency        : PropTypes.string,
    error           : PropTypes.string,
    history         : PropTypes.object,
    is_empty        : PropTypes.bool,
    is_loading      : PropTypes.bool,
    is_mobile       : PropTypes.bool,
    is_tablet       : PropTypes.bool,
    onMount         : PropTypes.func,
    onUnmount       : PropTypes.func,
    totals          : PropTypes.object,
};

export default connect(
    ({ modules, client, ui }) => ({
        currency            : client.currency,
        active_positions    : modules.portfolio.active_positions,
        error               : modules.portfolio.error,
        getPositionById     : modules.portfolio.getPositionById,
        is_empty            : modules.portfolio.is_active_empty,
        is_loading          : modules.portfolio.is_loading,
        is_multiplier       : modules.trade.is_multiplier,
        NotificationMessages: ui.notification_messages_ui,
        onClickCancel       : modules.portfolio.onClickCancel,
        onClickSell         : modules.portfolio.onClickSell,
        onMount             : modules.portfolio.onMount,
        onUnmount           : modules.portfolio.onUnmount,
    })
)(withRouter(OpenPositions));
