import PropTypes         from 'prop-types';
import React             from 'react';
import { withRouter }    from 'react-router-dom';
import { localize }      from 'App/i18n';
import { FadeWrapper }   from 'App/Components/Animations';
import VerticalTab       from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';
import 'Sass/app/modules/otc.scss';

class OTC extends React.Component {
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
        this.props.toggleOtc(true);
    }

    componentWillUnmount() {
        this.props.toggleOtc(false);
        this.props.disableRouteMode();
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
                    this.props.toggleOtc(false);
                },
                icon : 'ModalIconClose',
                title: localize('Close'),
            },
        ];

        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='otc-page-wrapper'
                keyname='otc-page-wrapper'
            >
                <div className='otc' ref={this.setWrapperRef}>
                    <VerticalTab
                        modal_index={1}
                        header_title={localize('OTC Payment')}
                        action_bar={action_bar_items}
                        action_bar_classname='otc__inset-header'
                        alignment='center'
                        id='otc'
                        classNameHeader='otc__tab-header'
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

OTC.propTypes = {
    disableRouteMode: PropTypes.func,
    enableRouteMode : PropTypes.func,
    history         : PropTypes.object,
    is_visible      : PropTypes.bool,
    location        : PropTypes.object,
    routes          : PropTypes.arrayOf(PropTypes.object),
    toggleOtc       : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        disableRouteMode: ui.disableRouteModal,
        enableRouteMode : ui.setRouteModal,
        is_visible      : ui.is_otc_visible,
        toggleOtc       : ui.toggleOtc,
    })
)(withRouter(OTC));
