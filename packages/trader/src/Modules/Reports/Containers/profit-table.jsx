import PropTypes                         from 'prop-types';
import { PropTypes as MobxPropTypes }    from 'mobx-react';
import React                             from 'react';
import { withRouter }                    from 'react-router';
import { localize, Localize }            from 'deriv-translations';
import { urlFor }                        from '_common/url';
import { website_name }                  from 'App/Constants/app-config';
import DataTable                         from 'App/Components/Elements/DataTable';
import CompositeCalendar                 from 'App/Components/Form/CompositeCalendar';
import { getContractPath }               from 'App/Components/Routes/helpers';
import { getSupportedContracts }         from 'Constants';
import { connect }                       from 'Stores/connect';
import EmptyTradeHistoryMessage          from '../Components/empty-trade-history-message.jsx';
import PlaceholderComponent              from '../Components/placeholder-component.jsx';
import { ReportsMeta }                   from '../Components/reports-meta.jsx';
import { getProfitTableColumnsTemplate } from '../Constants/data-table-constants';
import Shortcode                         from '../Helpers/shortcode';

class ProfitTable extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    getRowAction = (row_obj) => (
        getSupportedContracts()[Shortcode.extractInfoFromShortcode(row_obj.shortcode).category.toUpperCase()] ?
            getContractPath(row_obj.contract_id)
            : {
                component: (
                    <Localize
                        i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to <0>Binary.com</0> for details.'
                        values={{
                            website_name,
                        }}
                        components={[
                            <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href={urlFor('user/profit_tablews', undefined, undefined, true)} />,
                        ]}
                    />
                ),
            }
    );

    render () {
        const {
            component_icon,
            currency,
            data,
            date_from,
            date_to,
            is_empty,
            is_loading,
            error,
            handleDateChange,
            handleScroll,
            has_selected_date,
            totals,
        } = this.props;
        if (error) return <p>{error}</p>;

        const filter_component = (
            <React.Fragment>
                <CompositeCalendar
                    onChange={handleDateChange}
                    from={date_from}
                    to={date_to}
                />
            </React.Fragment>
        );
        const columns = getProfitTableColumnsTemplate(currency, data.length);

        return (
            <React.Fragment>
                <ReportsMeta
                    i18n_heading={localize('Profit table')}
                    i18n_message={localize('View all trades purchased on your account, and a summary of your total profit/loss.')}
                    filter_component={filter_component}
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
                        custom_width={'100%'}
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
    date_from        : PropTypes.number,
    date_to          : PropTypes.number,
    error            : PropTypes.string,
    handleDateChange : PropTypes.func,
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
        date_from        : modules.profit_table.date_from,
        date_to          : modules.profit_table.date_to,
        error            : modules.profit_table.error,
        handleScroll     : modules.profit_table.handleScroll,
        handleDateChange : modules.profit_table.handleDateChange,
        has_selected_date: modules.profit_table.has_selected_date,
        is_empty         : modules.profit_table.is_empty,
        is_loading       : modules.profit_table.is_loading,
        onMount          : modules.profit_table.onMount,
        onUnmount        : modules.profit_table.onUnmount,
        totals           : modules.profit_table.totals,
    })
)(withRouter(ProfitTable));
