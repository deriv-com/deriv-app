import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router-dom';
import { PageOverlay }   from '@deriv/components';
import { localize }      from '@deriv/translations';
import { FadeWrapper }   from 'App/Components/Animations';
import VerticalTab       from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';
import 'Sass/app/modules/reports.scss';

class Reports extends React.Component {
    componentDidMount() {
        this.props.toggleReports(true);
    }

    componentWillUnmount() {
        this.props.toggleReports(false);
    }

    // TODO: [history-routing] handle going back as per user actions
    onClickClose = () => {
        this.props.history.push(AppRoutes.trade);
        this.props.toggleReports(false);
    };

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

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='reports-page-wrapper'
                keyname='reports-page-wrapper'
            >
                <div className='reports'>
                    <PageOverlay
                        header={localize('Reports')}
                        onClickClose={this.onClickClose}
                    >
                        <VerticalTab
                            alignment='center'
                            id='report'
                            is_floating
                            classNameHeader='reports__tab-header'
                            current_path={this.props.location.pathname}
                            is_routed={true}
                            is_full_width={true}
                            list={menu_options()}
                        />
                    </PageOverlay>
                </div>
            </FadeWrapper>
        );
    }
}

Reports.propTypes = {
    history      : PropTypes.object,
    is_visible   : PropTypes.bool,
    location     : PropTypes.object,
    routes       : PropTypes.arrayOf(PropTypes.object),
    toggleReports: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_visible   : ui.is_reports_visible,
        toggleReports: ui.toggleReports,
    })
)(withRouter(Reports));
