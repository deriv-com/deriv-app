import PropTypes                         from 'prop-types';
import { PropTypes as MobxPropTypes }    from 'mobx-react';
import React                             from 'react';
import { withRouter }                    from 'react-router';
import { localize }                      from '_common/localize';
import { urlFor }                        from '_common/url';
import { website_name }                  from 'App/Constants/app-config';
import DataTable                         from 'App/Components/Elements/DataTable';
import Localize                          from 'App/Components/Elements/localize.jsx';
import { getContractPath }               from 'App/Components/Routes/helpers';
import { getSupportedContracts }         from 'Constants';
import { connect }                       from 'Stores/connect';
import EmptyTradeHistoryMessage          from '../Components/empty-trade-history-message.jsx';
import PlaceholderComponent              from '../Components/placeholder-component.jsx';
import { ReportsMeta }                   from '../Components/reports-meta.jsx';
import { getProfitTableColumnsTemplate } from '../Constants/data-table-constants';
import { getMarketInformation }          from '../Helpers/market-underlying';

class ProfitTable extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    getRowAction = (row_obj) => (
        getSupportedContracts()[getMarketInformation(row_obj).category.toUpperCase()] ?
            getContractPath(row_obj.contract_id)
            : {
                component: (
                    <Localize
                        str='This trade type is currently not supported on [_1]. Please go to [_2]Binary.com[_3] for details.'
                        replacers={{
                            '1'  : website_name,
                            '2_3': <a className='link link--orange' rel='noopener noreferrer' target='_blank' href={urlFor('user/profit_tablews', undefined, undefined, true)} />,
                        }}
                    />
                ),
            }
    );

    render () {
        const {
            component_icon,
            currency,
            data,
            is_empty,
            is_loading,
            error,
            handleScroll,
            has_selected_date,
            totals,
        } = this.props;
        if (error) return <p>{error}</p>;

        const columns = getProfitTableColumnsTemplate(currency);

        return (
            <React.Fragment>
                <ReportsMeta
                    i18n_heading={localize('Profit table')}
                    i18n_message={localize('View all trades purchased on your account, and a summary of your total profit/loss.')}
                />
                { (is_loading && data.length === 0) || is_empty ?
                    <PlaceholderComponent
                        is_loading={is_loading}
                        has_selected_date={has_selected_date}
                        is_empty={is_empty}
                        empty_message_component={EmptyTradeHistoryMessage}
                        component_icon={component_icon}
                        localized_message={localize('You have no trading activity yet.')}
                        localized_period_message={localize('You have no trading activity for this period.')}
                    />
                    :
                    <DataTable
                        className='profit-table'
                        data_source={data}
                        columns={columns}
                        onScroll={handleScroll}
                        footer={totals}
                        is_empty={is_empty}
                        getRowAction={this.getRowAction}
                    >
                        <PlaceholderComponent
                            is_loading={is_loading}
                        />
                    </DataTable>
                }
            </React.Fragment>
        );
    }
}

ProfitTable.propTypes = {
    component_icon   : PropTypes.string,
    currency         : PropTypes.string,
    data             : MobxPropTypes.arrayOrObservableArray,
    error            : PropTypes.string,
    handleScroll     : PropTypes.func,
    has_selected_date: PropTypes.bool,
    history          : PropTypes.object,
    is_empty         : PropTypes.bool,
    is_loading       : PropTypes.bool,
    onMount          : PropTypes.func,
    onUnmount        : PropTypes.func,
    totals           : PropTypes.object,
};

export default connect(
    ({ modules, client }) => ({
        currency         : client.currency,
        data             : modules.profit_table.data,
        error            : modules.profit_table.error,
        handleScroll     : modules.profit_table.handleScroll,
        has_selected_date: modules.profit_table.has_selected_date,
        is_empty         : modules.profit_table.is_empty,
        is_loading       : modules.profit_table.is_loading,
        onMount          : modules.profit_table.onMount,
        onUnmount        : modules.profit_table.onUnmount,
        totals           : modules.profit_table.totals,
    })
)(withRouter(ProfitTable));
