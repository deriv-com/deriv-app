// import classNames   from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import { Modal }     from 'deriv-components';
import { localize }  from 'App/i18n';
import MenuAccordion from 'App/Components/Elements/MenuAccordion';
import Lazy          from 'App/Containers/Lazy';
import UILoader      from '../../Elements/ui-loader.jsx';
import Icon          from 'Assets/icon.jsx';

// Profile
const PersonalDetails     = () => import('App/Containers/AccountManagementModal/Profile/personal-details.jsx');
const FinancialAssessment = () => import('App/Containers/AccountManagementModal/Profile/financial-assessment.jsx');

// Verification
const ProofOfAddress  = () => import('App/Containers/AccountManagementModal/Verification/proof-of-address.jsx');
const ProofOfIdentity = () => import('App/Containers/AccountManagementModal/Verification/proof-of-identity.jsx');

// Security and Safety
const AccountLimits           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/account-limits.jsx');
const ApiToken                = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/api-token.jsx');
const ConnectedApps           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/connected-apps.jsx');
const DerivPassword           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/deriv-password.jsx');
const LoginHistory            = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/login-history.jsx');
const SelfExclusion           = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/self-exclusion.jsx');
const TwoFactorAuthentication = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/two-factor-authentication.jsx');
const Vpn                     = () => import('App/Containers/AccountManagementModal/SecurityAndSafety/vpn.jsx');

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
            {     
                label: localize('Self-exclusion'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={SelfExclusion}
                        should_load={true}
                        has_progress={true}
                    />
                )

            },
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
            {     
                label: localize('Login history'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={LoginHistory}
                        should_load={true}
                        has_progress={true}
                    />
                )

            },
            {     
                label: localize('API token'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={ApiToken}
                        should_load={true}
                        has_progress={true}
                    />
                )

            },
            {     
                label: localize('Connected apps'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={ConnectedApps}
                        should_load={true}
                        has_progress={true}
                    />
                )

            },
            {     
                label: localize('Two-factor authentication'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={TwoFactorAuthentication}
                        should_load={true}
                        has_progress={true}
                    />
                )

            },
            {     
                label: localize('VPN'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={Vpn}
                        should_load={true}
                        has_progress={true}
                    />
                )

            }
        ],
    }
];

class ToggleAccountManagement extends React.PureComponent {
    state = {
        header: modal_content[0].sub_tab_list[0].label,
    };

    onChangeHeader = (header) => this.setState({ header });

    render() {
        const { disableApp, enableApp, is_open } = this.props;

        return (
            <React.Suspense fallback={<UILoader />}>
                <div onClick={this.props.toggleModal} className='account-management-toggle'>
                    <Icon icon='IconUser' />
                </div>
                <Modal
                    className='account-management'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    header={this.state.header}
                    menu_type='accordion'
                    modal_content={modal_content}
                    is_open={is_open}
                    title={localize('Settings')}
                    toggleModal={this.props.toggleModal}
                >
                    <MenuAccordion
                        alignment='center'
                        classNameHeader='modal__tab-header'
                        list={modal_content}
                        onChangeHeader={this.onChangeHeader}
                    />
                </Modal>
            </React.Suspense>
        );
    }
}

ToggleAccountManagement.propTypes = {
    active_tab : PropTypes.string,
    disableApp : PropTypes.func,
    enableApp  : PropTypes.func,
    is_open    : PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default ToggleAccountManagement;
