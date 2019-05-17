import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router-dom';
import { connect }    from 'Stores/connect';
import VerticalTab    from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import { IconClose }  from 'Assets/Settings';
import AppRoutes      from 'Constants/routes';
import { localize }   from '_common/localize';

class Reports extends React.Component {
    componentDidMount() {
        this.props.showBlur();
    }

    componentWillUnmount() {
        this.props.hideBlur();
    }

    render () {
        const menu_options = () => {
            const options = [];

            this.props.routes.forEach(route => {
                options.push({
                    default: route.default,
                    icon   : route.icon_component,
                    label  : route.title,
                    value  : route.component,
                    path   : route.path,
                });
            });

            return options;
        };

        const action_bar_items = [
            {
                onClick: () => { this.props.history.push(AppRoutes.trade); },
                icon   : IconClose,
                title  : localize('Close'),
            },
        ];
        return (
            <div className='reports'>
                <VerticalTab
                    header_title={localize('Reports')}
                    action_bar={action_bar_items}
                    alignment='center'
                    classNameHeader='reports__tab-header'
                    current_path={this.props.location.pathname}
                    is_routed={true}
                    is_full_width={true}
                    list={menu_options()}
                />
            </div>
        );
    }
}

Reports.propTypes = {
    hideBlur: PropTypes.func,
    history : PropTypes.object,
    location: PropTypes.object,
    routes  : PropTypes.arrayOf(PropTypes.object),
    showBlur: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        hideBlur: ui.hideRouteBlur,
        showBlur: ui.showRouteBlur,
    })
)(withRouter(Reports));
