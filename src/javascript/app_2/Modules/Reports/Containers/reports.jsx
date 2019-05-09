import PropTypes      from 'prop-types';
import React          from 'react';
import { withRouter } from 'react-router-dom';
import VerticalTab    from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import { IconClose }  from 'Assets/Settings';
import AppRoutes      from 'Constants/routes';
import { localize }   from '_common/localize';

const Reports = ({ routes, location, history }) => {
    const menu_options = () => {
        const options = [];

        routes.forEach(route => {
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
            onClick: () => { history.push(AppRoutes.trade); },
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
                current_path={location.pathname}
                is_routed={true}
                is_full_width={true}
                list={menu_options()}
            />
        </div>
    );
};

Reports.propTypes = {
    history : PropTypes.object,
    location: PropTypes.object,
    routes  : PropTypes.arrayOf(PropTypes.object),
};

export default withRouter(Reports);
