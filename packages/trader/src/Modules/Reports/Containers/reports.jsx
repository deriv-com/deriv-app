import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { PageOverlay, VerticalTab, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared/utils/screen';
import { getSelectedRoute } from '@deriv/shared/utils/route';
import { localize } from '@deriv/translations';
import { FadeWrapper } from 'App/Components/Animations';
import { connect } from 'Stores/connect';
import 'Sass/app/modules/reports.scss';

class Reports extends React.Component {
    componentDidMount() {
        this.props.toggleReports(true);
    }

    componentWillUnmount() {
        this.props.toggleReports(false);
    }

    onClickClose = () => this.props.routeBackInApp(this.props.history);

    render() {
        const menu_options = () => {
            const options = [];

            this.props.routes.forEach(route => {
                options.push({
                    default: route.default,
                    icon: route.icon_component,
                    label: route.title,
                    value: route.component,
                    path: route.path,
                });
            });

            return options;
        };

        const { routes, location } = this.props;
        const selected_route = isMobile() ? getSelectedRoute({ routes, pathname: location.pathname }) : null;

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='reports-page-wrapper'
                keyname='reports-page-wrapper'
            >
                <div className='reports'>
                    <PageOverlay header={localize('Reports')} onClickClose={this.onClickClose}>
                        <DesktopWrapper>
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
                        </DesktopWrapper>
                        <MobileWrapper>
                            <div className='reports__mobile-wrapper'>
                                {selected_route && (
                                    <selected_route.component component_icon={selected_route.icon_component} />
                                )}
                            </div>
                        </MobileWrapper>
                    </PageOverlay>
                </div>
            </FadeWrapper>
        );
    }
}

Reports.propTypes = {
    history: PropTypes.object,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    routes: PropTypes.arrayOf(PropTypes.object),
    toggleReports: PropTypes.func,
};

export default connect(({ common, ui }) => ({
    routeBackInApp: common.routeBackInApp,
    is_visible: ui.is_reports_visible,
    toggleReports: ui.toggleReports,
}))(withRouter(Reports));
