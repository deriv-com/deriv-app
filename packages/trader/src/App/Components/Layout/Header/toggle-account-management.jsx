// import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import Lazy         from 'App/Containers/Lazy';
import { Modal }    from 'App/Components/Elements/modal.jsx';
import UILoader     from '../../Elements/ui-loader.jsx';
import Icon from 'Assets/icon.jsx';
// const IconUser = React.lazy(() => import(/* webpackChunkName: "wallet-information" */'Modules/Reports/Containers/wallet-information.jsx'));

const tabs = {
    deposit : 0,
    withdraw: 1,
};

const Deposit    = () => import('App/Containers/CashierModal/deposit.jsx');
// const Withdrawal = () => import('App/Containers/CashierModal/withdrawal.jsx');

const modal_content = [
    {
        icon        : 'IconUser',
        tab_heading : localize('Profile'),
        sub_tab_list: [
            {
                label: localize('Personal details'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={Deposit}
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
                        ctor={Deposit}
                        should_load={true}
                        has_progress={true}
                    />
                )

            }
        ],
    },
    {
        icon        : 'IconUser',
        tab_heading : localize('Verification'),
        sub_tab_list: [
            {
                label: localize('Proof of identity'),
                // eslint-disable-next-line react/display-name
                value: () => (
                    <Lazy
                        ctor={Deposit}
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
                        ctor={Deposit}
                        should_load={true}
                        has_progress={true}
                    />
                )

            }
        ],
    }
];

class ToggleAccountManagement extends React.PureComponent {
    // onClick = () => { this.props.toggleAccountManagementModal(); };

    render() {
        const {
            active_tab,
            // className,
            disableApp,
            enableApp,
            is_open,
            // toggleCashier,
        } = this.props;

        return (
            <React.Suspense fallback={<UILoader />}>
                <div onClick={this.props.toggleModal}>
                    <Icon icon='IconUser' />
                </div>
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    menu_type='accordion'
                    modal_content={modal_content}
                    is_open={is_open}
                    selected_index={tabs[active_tab]}
                    title={localize('Settings')}
                    toggleModal={this.props.toggleModal}
                />
            </React.Suspense>
        );
    }
}

ToggleAccountManagement.propTypes = {
    active_tab : PropTypes.string,
    className  : PropTypes.string,
    disableApp : PropTypes.func,
    enableApp  : PropTypes.func,
    is_open    : PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default ToggleAccountManagement;
