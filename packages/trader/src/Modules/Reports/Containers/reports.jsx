import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router-dom';
import { VerticalTab }   from 'deriv-components';
import { localize }      from 'deriv-translations';
import { FadeWrapper }   from 'App/Components/Animations';
import Icon              from 'Assets/icon.jsx';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';
import WalletInformation from './wallet-information.jsx';
import 'Sass/app/modules/reports.scss';

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
        this.props.enableRouteMode();
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.toggleReports(true);
    }

    componentWillUnmount() {
        this.props.toggleReports(false);
        this.props.disableRouteMode();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render () {
        const menu_options = () => {
            const options = [];

            this.props.routes.forEach(route => {
                options.push({
                    default: route.default,
                    icon   : <Icon icon={route.icon_component} />,
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
                icon: <Icon icon={'ModalIconClose'} />,
                title: localize('Close'),
            },
            {
                component: () => <WalletInformation has_description has_loginid />,
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
                        id='report'
                        classNameHeader='reports__tab-header'
                        current_path={this.props.location.pathname}
                        is_routed={true}
                        is_full_width={true}
                        list={menu_options()}
                        modal_index={this.props.modal_index}
                        setModalIndex={this.props.setModalIndex}
                    />
                </div>
            </FadeWrapper>
        );
    }
}

Reports.propTypes = {
    disableRouteMode: PropTypes.func,
    enableRouteMode : PropTypes.func,
    history         : PropTypes.object,
    is_visible      : PropTypes.bool,
    location        : PropTypes.object,
    modal_index     : PropTypes.number,
    routes          : PropTypes.arrayOf(PropTypes.object),
    setModalIndex   : PropTypes.func,
    toggleReports   : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        disableRouteMode: ui.disableRouteModal,
        enableRouteMode : ui.setRouteModal,
        is_visible      : ui.is_reports_visible,
        modal_index     : ui.modal_index,
        setModalIndex   : ui.setModalIndex,
        toggleReports   : ui.toggleReports,
    })
)(withRouter(Reports));
