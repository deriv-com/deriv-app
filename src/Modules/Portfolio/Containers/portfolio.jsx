import classnames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { withRouter }                 from 'react-router-dom';
import DataTable                      from 'App/Components/Elements/DataTable';
import { getContractPath }            from 'App/Components/Routes/helpers';
import { connect }                    from 'Stores/connect';
import CardList                       from '../Components/card-list.jsx';
import EmptyPortfolioMessage          from '../Components/empty-portfolio-message.jsx';
import { getTableColumnsTemplate }    from '../Constants/data-table-constants';
import Loading                        from '../../../templates/_common/components/loading.jsx';

class Portfolio extends React.Component {
    componentDidMount()    { this.props.onMount(); }
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const {
            active_positions,
            is_mobile,
            is_tablet,
            is_loading,
            error,
            totals,
            is_empty,
            currency,
        } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        if (is_loading) {
            return <Loading />;
        }

        if (is_empty) {
            return <EmptyPortfolioMessage />;
        }

        const should_show_cards = is_mobile || is_tablet;

        return (
            <div className={classnames('portfolio container', { 'portfolio--card-view': should_show_cards })}>
                {
                    should_show_cards ?
                        <CardList data={active_positions} currency={currency} />
                        :
                        <DataTable
                            className='portfolio'
                            columns={getTableColumnsTemplate(currency)}
                            data_source={active_positions}
                            footer={totals}
                            has_fixed_header
                            getRowAction={(row_obj) => getContractPath(row_obj.id)}
                        />
                }
            </div>
        );
    }
}

Portfolio.propTypes = {
    active_positions: MobxPropTypes.arrayOrObservableArray,
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
        currency        : client.currency,
        active_positions: modules.portfolio.active_positions,
        error           : modules.portfolio.error,
        is_empty        : modules.portfolio.is_empty,
        is_loading      : modules.portfolio.is_loading,
        totals          : modules.portfolio.totals,
        onMount         : modules.portfolio.onMount,
        onUnmount       : modules.portfolio.onUnmount,
        is_mobile       : ui.is_mobile,
        is_tablet       : ui.is_tablet,
    })
)(withRouter(Portfolio));
