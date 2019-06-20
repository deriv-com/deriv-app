import { PropTypes as MobxPropTypes }       from 'mobx-react';
import PropTypes                            from 'prop-types';
import React                                from 'react';
import { withRouter }                       from 'react-router-dom';
import { localize }                         from 'App/i18n';
import { urlFor }                           from '_common/url';
import DataTable                            from 'App/Components/Elements/DataTable';
import Localize                             from 'App/Components/Elements/localize.jsx';
import { getContractPath }                  from 'App/Components/Routes/helpers';
import { website_name }                     from 'App/Constants/app-config';
import { getSupportedContracts }            from 'Constants';
import { connect }                          from 'Stores/connect';
import { getStatementTableColumnsTemplate } from '../Constants/data-table-constants';
import PlaceholderComponent                 from '../Components/placeholder-component.jsx';
import { ReportsMeta }                      from '../Components/reports-meta.jsx';
import EmptyTradeHistoryMessage             from '../Components/empty-trade-history-message.jsx';
import { getMarketInformation }             from '../Helpers/market-underyling';

class Statement extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    getRowAction = (row_obj) => {
        let action;

        if (row_obj.id && ['buy', 'sell'].includes(row_obj.action_type)) {
            action = getSupportedContracts()[getMarketInformation(row_obj).category.toUpperCase()] ?
                getContractPath(row_obj.id)
                : {
                    component: (
                        <Localize
                            i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to <0>Binary.com</0> for details.'
                            values={{
                                website_name,
                            }}
                            components={[
                                <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href={urlFor('user/statementws', undefined, undefined, true)} />,
                            ]}
                        />
                    ),
                };
        } else if (['deposit', 'withdrawal'].includes(row_obj.action_type)) {
            action = {
                message: row_obj.desc,
            };
        }

        return action;
    };

    render() {
        const {
            component_icon,
            currency,
            data,
            is_empty,
            is_loading,
            error,
            handleScroll,
            has_selected_date,
        } = this.props;

        if (error) return <p>{error}</p>;

        const columns = getStatementTableColumnsTemplate(currency);

        return (
            <React.Fragment>
                <ReportsMeta
                    i18n_heading={localize('Statement')}
                    i18n_message={localize('View all transactions on your account, including trades, deposits, and withdrawals.')}
                />
                { (is_loading && data.length === 0) || is_empty ?
                    <PlaceholderComponent
                        is_loading={is_loading}
                        has_selected_date={has_selected_date}
                        is_empty={is_empty}
                        empty_message_component={EmptyTradeHistoryMessage}
                        component_icon={component_icon}
                        localized_message={localize('You have no transactions yet.')}
                        localized_period_message={localize('You have no transactions for this period.')}
                    />
                    :
                    <DataTable
                        className='statement'
                        data_source={data}
                        columns={columns}
                        onScroll={handleScroll}
                        getRowAction={(row) => this.getRowAction(row)}
                        is_empty={is_empty}
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

Statement.propTypes = {
    component_icon   : PropTypes.string,
    data             : MobxPropTypes.arrayOrObservableArray,
    error            : PropTypes.string,
    handleScroll     : PropTypes.func,
    has_selected_date: PropTypes.bool,
    history          : PropTypes.object,
    is_empty         : PropTypes.bool,
    is_loading       : PropTypes.bool,
    onMount          : PropTypes.func,
    onUnmount        : PropTypes.func,
};

export default connect(
    ({ modules, client }) => ({
        currency         : client.currency,
        data             : modules.statement.data,
        error            : modules.statement.error,
        handleScroll     : modules.statement.handleScroll,
        has_selected_date: modules.statement.has_selected_date,
        is_empty         : modules.statement.is_empty,
        is_loading       : modules.statement.is_loading,
        onMount          : modules.statement.onMount,
        onUnmount        : modules.statement.onUnmount,
    })
)(withRouter(Statement));
