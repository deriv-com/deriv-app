import PropTypes         from 'prop-types';
import React             from 'react';
import Lazy          from 'App/Containers/Lazy';
import { withRouter }    from 'react-router-dom';
import { localize }      from 'App/i18n';
import { FadeWrapper }   from 'App/Components/Animations';
// import VerticalTab       from 'App/Components/Elements/VerticalTabs/vertical-tab.jsx';
import MenuAccordion from 'App/Components/Elements/MenuAccordion';
import AppRoutes         from 'Constants/routes';
import { connect }       from 'Stores/connect';
import 'Sass/app/modules/account.scss';

// Profile
const PersonalDetails     = () => import('App/Containers/AccountManagementModal/Profile/personal-details.jsx');
const FinancialAssessment = () => import('App/Containers/AccountManagementModal/Profile/financial-assessment.jsx');

// Verification
const ProofOfAddress  = () => import('App/Containers/AccountManagementModal/Verification/proof-of-address.jsx');
const ProofOfIdentity = () => import('App/Containers/AccountManagementModal/Verification/proof-of-identity.jsx');

// Security and Safety
const AccountLimits           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/account-limits.jsx');
// const ApiToken                = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/api-token.jsx');
// const ConnectedApps           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/connected-apps.jsx');
const DerivPassword           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/DerivPassword/');
// const LoginHistory            = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/login-history.jsx');
// const SelfExclusion           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/self-exclusion.jsx');
// const TwoFactorAuthentication = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/two-factor-authentication.jsx');
// const Vpn                     = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/vpn.jsx');

const modal_content = [
    {
        icon        : 'IconUser',
        label       : localize('Profile'),
        sub_tab_list: [
            {
                label: localize('Personal details'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={PersonalDetails}
                        should_load={true}
                        has_progress={true}
                    />
                )
            },
            {     
                label: localize('Financial assessment'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={FinancialAssessment}
                        should_load={true}
                        has_progress={true}
                    />
                )

            }
        ],
    },
    {
        icon        : 'IconVerification',
        label       : localize('Verification'),
        sub_tab_list: [
            {
                label: localize('Proof of identity'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={ProofOfIdentity}
                        should_load={true}
                        has_progress={true}
                    />
                )
            },
            {     
                label: localize('Proof of address'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={ProofOfAddress}
                        should_load={true}
                        has_progress={true}
                    />
                )

            }
        ],
    },
    {
        icon        : 'IconSecurity',
        label       : localize('Security and safety'),
        sub_tab_list: [
            {
                label: localize('Deriv password'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={DerivPassword}
                        should_load={true}
                        has_progress={true}
                    />
                )
            },
            // {     
            //     label: localize('Self-exclusion'),
            //     // eslint-disable-next-line react/display-name
            //     value: () => (
            //         <Lazy
            //             ctor={SelfExclusion}
            //             should_load={true}
            //             has_progress={true}
            //         />
            //     )

            // },
            {     
                label: localize('Account limits'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={AccountLimits}
                        should_load={true}
                        has_progress={true}
                    />
                )

            },
            // {     
            //     label: localize('Login history'),
            //     // eslint-disable-next-line react/display-name
            //     value: () => (
            //         <Lazy
            //             ctor={LoginHistory}
            //             should_load={true}
            //             has_progress={true}
            //         />
            //     )

            // },
            // {     
            //     label: localize('API token'),
            //     // eslint-disable-next-line react/display-name
            //     value: () => (
            //         <Lazy
            //             ctor={ApiToken}
            //             should_load={true}
            //             has_progress={true}
            //         />
            //     )

            // },
            // {     
            //     label: localize('Connected apps'),
            //     // eslint-disable-next-line react/display-name
            //     value: () => (
            //         <Lazy
            //             ctor={ConnectedApps}
            //             should_load={true}
            //             has_progress={true}
            //         />
            //     )

            // },
            // {     
            //     label: localize('Two-factor authentication'),
            //     // eslint-disable-next-line react/display-name
            //     value: () => (
            //         <Lazy
            //             ctor={TwoFactorAuthentication}
            //             should_load={true}
            //             has_progress={true}
            //         />
            //     )

            // },
            // {     
            //     label: localize('VPN'),
            //     // eslint-disable-next-line react/display-name
            //     value: () => (
            //         <Lazy
            //             ctor={Vpn}
            //             should_load={true}
            //             has_progress={true}
            //         />
            //     )

            // }
        ],
    }
];

class Account extends React.Component {
    state = {
        header: modal_content[0].sub_tab_list[0].label,
    };

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
        this.props.toggleAccount(true);
    }

    componentWillUnmount() {
        this.props.toggleAccount(false);
        this.props.disableRouteMode();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    onChangeHeader = header => this.setState({ header });

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
                    this.props.toggleAccount(false);
                },
                icon : 'ModalIconClose',
                title: localize('Close'),
            },
        ];
        return (
            <FadeWrapper
                is_visible={this.props.is_visible}
                className='account-page-wrapper'
                keyname='account-page-wrapper'
            >
                <div className='account' ref={this.setWrapperRef}>
                    {/* <VerticalTab
                        header_title={localize('Settings')}
                        action_bar={action_bar_items}
                        action_bar_classname='account__inset_header'
                        alignment='center'
                        id='account'
                        classNameHeader='account__tab-header'
                        current_path={this.props.location.pathname}
                        is_routed={true}
                        is_full_width={true}
                        list={menu_options()}
                    /> */}
                    <MenuAccordion
                        alignment='center'
                        classNameHeader='modal__tab-header'
                        list={modal_content}
                        onChangeHeader={this.onChangeHeader}
                    />
                </div>
            </FadeWrapper>
        );
    }
}

Account.propTypes = {
    disableRouteMode: PropTypes.func,
    enableRouteMode : PropTypes.func,
    history         : PropTypes.object,
    is_visible      : PropTypes.bool,
    location        : PropTypes.object,
    routes          : PropTypes.arrayOf(PropTypes.object),
    toggleAccount   : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        disableRouteMode: ui.disableRouteModal,
        enableRouteMode : ui.setRouteModal,
        is_visible      : ui.is_account_settings_visible,
        toggleAccount   : ui.toggleAccount,
    })
)(withRouter(Account));
