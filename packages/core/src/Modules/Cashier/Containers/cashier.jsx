import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router-dom';
import { PageOverlay }   from '@deriv/components';
import { localize }      from '@deriv/translations';
import { FadeWrapper }   from 'App/Components/Animations';
import VerticalTab       from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import routes            from 'Constants/routes';
import { connect }       from 'Stores/connect';

class Cashier extends React.Component {
    componentDidMount() {
        this.props.toggleCashier();
        // we still need to populate the tabs shown on cashier
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.toggleCashier();
    }

    // TODO: [history-routing] handle going back as per user actions
    onClickClose = () => {
        this.props.history.push(routes.trade);
    };

    render () {
        const menu_options = () => {
            const options = [];

            // TODO: remove show_dp2p hash check once released
            this.props.routes.forEach(route => {
                if ((route.path !== routes.cashier_pa || this.props.is_payment_agent_visible) &&
                    (route.path !== routes.cashier_pa_transfer || this.props.is_payment_agent_transfer_visible) &&
                    (route.path !== routes.cashier_dp2p || (this.props.is_dp2p_visible && /show_dp2p/.test(this.props.location.hash)))) {
                    options.push({
                        // TODO: [p2p-replace-with-api] You can pass 'count' for having notification counter in the tab, like this:
                        // count  : 1,
                        default: route.default,
                        icon   : route.icon_component,
                        label  : route.title,
                        value  : route.component,
                        path   : route.path,
                    });
                }
            });

            return options;
        };

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='cashier-page-wrapper'
                keyname='cashier-page-wrapper'
            >
                <div className='cashier'>
                    <PageOverlay
                        header={localize('Cashier')}
                        onClickClose={this.onClickClose}
                        has_side_note
                    >
                        <VerticalTab
                            alignment='center'
                            id='cashier'
                            classNameHeader='cashier__tab-header'
                            current_path={this.props.location.pathname}
                            is_floating
                            is_routed
                            is_full_width
                            list={menu_options()}
                        />
                    </PageOverlay>
                </div>
            </FadeWrapper>
        );
    }
}

Cashier.propTypes = {
    history                          : PropTypes.object,
    is_dp2p_visible                  : PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible         : PropTypes.bool,
    is_visible                       : PropTypes.bool,
    location                         : PropTypes.object,
    onMount                          : PropTypes.func,
    routes                           : PropTypes.arrayOf(PropTypes.object),
    toggleCashier                    : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        is_dp2p_visible         : modules.cashier.is_dp2p_visible,
        is_visible              : ui.is_cashier_visible,
        is_payment_agent_visible: !!(modules.cashier.config.payment_agent.filtered_list.length
            || modules.cashier.config.payment_agent.agents.length),
        is_payment_agent_transfer_visible: modules.cashier.config.payment_agent_transfer.is_payment_agent,
        onMount                          : modules.cashier.onMountCommon,
        toggleCashier                    : ui.toggleCashier,
    })
)(withRouter(Cashier));
