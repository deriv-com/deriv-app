import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    Div100vhContainer,
    VerticalTab,
    DesktopWrapper,
    MobileWrapper,
    FadeWrapper,
    PageOverlay,
    SelectNative,
} from '@deriv/components';
import { getSelectedRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import 'Sass/app/modules/reports.scss';

class Reports extends React.Component {
    componentDidMount() {
        this.props.toggleReports(true);
    }

    componentWillUnmount() {
        this.props.setVisibilityRealityCheck(1);
        this.props.toggleReports(false);
    }

    onClickClose = () => this.props.routeBackInApp(this.props.history);

    handleRouteChange = e => {
        this.props.history.push(e.target.value);
    };

    render() {
        const menu_options = () => {
            const options = [];

            this.props.routes.forEach(route => {
                options.push({
                    default: route.default,
                    icon: route.icon_component,
                    label: route.getTitle(),
                    value: route.component,
                    path: route.path,
                });
            });

            return options;
        };

        const { routes, location } = this.props;
        const selected_route = getSelectedRoute({ routes, pathname: location.pathname });

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
                                setVerticalTabIndex={this.props.setTabIndex}
                                vertical_tab_index={selected_route.default ? 0 : this.props.tab_index}
                                list={menu_options()}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <Div100vhContainer className='reports__mobile-wrapper' height_offset='80px'>
                                <SelectNative
                                    className='reports__route-selection'
                                    list_items={menu_options().map(option => ({
                                        text: option.label,
                                        value: option.path,
                                    }))}
                                    value={selected_route.path}
                                    should_show_empty_option={false}
                                    onChange={this.handleRouteChange}
                                />
                                {selected_route && (
                                    <selected_route.component component_icon={selected_route.icon_component} />
                                )}
                            </Div100vhContainer>
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
    setTabIndex: PropTypes.func,
    setVisibilityRealityCheck: PropTypes.func,
    tab_index: PropTypes.number,
    toggleReports: PropTypes.func,
};

export default connect(({ client, common, ui }) => ({
    setVisibilityRealityCheck: client.setVisibilityRealityCheck,
    routeBackInApp: common.routeBackInApp,
    is_visible: ui.is_reports_visible,
    setTabIndex: ui.setReportsTabIndex,
    tab_index: ui.reports_route_tab_index,
    toggleReports: ui.toggleReports,
}))(withRouter(Reports));
