import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router-dom';
import { localize }      from '_common/localize';
import { connect }       from 'Stores/connect';
import { FadeWrapper }   from 'App/Components/Animations';
import VerticalTab       from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import AppRoutes         from 'Constants/routes';
import WalletInformation from './wallet-information.jsx';

class Reports extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            this.props.history.push(AppRoutes.trade);
        }
    };

    componentDidMount() {
        // SmartCharts keeps saving layout for ContractPlay even if layouts prop is set to null
        // As a result, we have to remove it manually for each SmartChart instance in ContractReplay
        // TODO: Remove this once SmartCharts finds a way to stop ChartIQ from saving layouts to localStorage
        localStorage.removeItem('layout-contract-replay');
        this.props.showBlur();
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.toggleReports(true);
    }

    componentWillUnmount() {
        this.props.toggleReports(false);
        this.props.hideBlur();
        document.removeEventListener('mousedown', this.handleClickOutside);
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
                onClick: () => {
                    this.props.history.push(AppRoutes.trade);
                    this.props.toggleReports(false);
                },
                icon : 'SettingsIconClose',
                title: localize('Close'),
            },
            {
                component: () => <WalletInformation />,
                title    : '',
            },
        ];
        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='reports-page-wrapper'
                keyname='reports-page-wrapper'
            >
                <div className='reports' ref={this.setWrapperRef}>
                    <VerticalTab
                        header_title={localize('Reports')}
                        action_bar={action_bar_items}
                        action_bar_classname='reports__inset_header'
                        alignment='center'
                        classNameHeader='reports__tab-header'
                        current_path={this.props.location.pathname}
                        is_routed={true}
                        is_full_width={true}
                        list={menu_options()}
                    />
                </div>
            </FadeWrapper>
        );
    }
}

Reports.propTypes = {
    hideBlur     : PropTypes.func,
    history      : PropTypes.object,
    is_visible   : PropTypes.bool,
    location     : PropTypes.object,
    routes       : PropTypes.arrayOf(PropTypes.object),
    showBlur     : PropTypes.func,
    toggleReports: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        hideBlur     : ui.hideRouteBlur,
        is_visible   : ui.is_reports_visible,
        showBlur     : ui.showRouteBlur,
        toggleReports: ui.toggleReports,
    })
)(withRouter(Reports));
